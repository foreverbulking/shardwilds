import type { Plugin, ViteDevServer, Connect } from 'vite';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { watch, type FSWatcher } from 'node:fs';

const PROJECT_ROOT = path.resolve(process.cwd(), '..', '..');
const STORIES_DIR = path.join(PROJECT_ROOT, 'docs', 'stories');
const ARCH_DOC = path.join(PROJECT_ROOT, 'docs', '03-architecture-by-phase.md');
const BINDINGS_DIR = path.join(PROJECT_ROOT, 'client', 'src', 'module_bindings');

interface SSEClient {
  res: ServerResponse;
}

const sseClients = new Set<SSEClient>();
let storiesWatcher: FSWatcher | null = null;
let archWatcher: FSWatcher | null = null;

function broadcast(event: { type: string; path?: string }): void {
  const payload = `data: ${JSON.stringify(event)}\n\n`;
  for (const client of sseClients) {
    try {
      client.res.write(payload);
    } catch {
      sseClients.delete(client);
    }
  }
}

function startWatcher(): void {
  if (!storiesWatcher) {
    storiesWatcher = watch(STORIES_DIR, { recursive: true }, (_event, filename) => {
      if (filename) {
        broadcast({ type: 'stories-changed', path: filename });
      }
    });
    storiesWatcher.on('error', (error) => {
      console.error('[shardwilds-console] stories watcher error:', error);
    });
  }
  if (!archWatcher) {
    archWatcher = watch(ARCH_DOC, () => {
      broadcast({ type: 'arch-doc-changed', path: ARCH_DOC });
    });
    archWatcher.on('error', (error) => {
      console.error('[shardwilds-console] arch watcher error:', error);
    });
  }
}

async function readStory(storyId: string): Promise<{ path: string; raw: string } | null> {
  const files = await fs.readdir(STORIES_DIR);
  const match = files.find((file) => file.startsWith(storyId));
  if (!match) return null;
  const fullPath = path.join(STORIES_DIR, match);
  const raw = await fs.readFile(fullPath, 'utf-8');
  return { path: fullPath, raw };
}

async function readArchitectureDoc(): Promise<string> {
  try {
    return await fs.readFile(ARCH_DOC, 'utf-8');
  } catch {
    return '';
  }
}

interface ReducerInfo {
  file: string;
  name: string;
  args: Array<{ name: string; type: string }>;
}

function parseArgsString(argsString: string): Array<{ name: string; type: string }> {
  if (!argsString.trim()) return [];
  return argsString.split(',').map((part) => {
    const trimmed = part.trim();
    const colonIndex = trimmed.indexOf(':');
    if (colonIndex === -1) return { name: trimmed, type: 'unknown' };
    return {
      name: trimmed.slice(0, colonIndex).trim(),
      type: trimmed.slice(colonIndex + 1).trim(),
    };
  });
}

async function listReducers(): Promise<ReducerInfo[]> {
  try {
    const files = await fs.readdir(BINDINGS_DIR);
    const tsFiles = files.filter((file) => file.endsWith('.ts') && !file.endsWith('.d.ts'));
    const results: ReducerInfo[] = [];
    for (const file of tsFiles) {
      const fullPath = path.join(BINDINGS_DIR, file);
      const content = await fs.readFile(fullPath, 'utf-8');
      const regex = /export\s+(?:async\s+)?function\s+(\w+)\s*\(([^)]*)\)\s*:\s*[^{]+/g;
      let match: RegExpExecArray | null;
      while ((match = regex.exec(content)) !== null) {
        results.push({
          file,
          name: match[1],
          args: parseArgsString(match[2]),
        });
      }
    }
    return results;
  } catch {
    return [];
  }
}

function attachSseClient(req: IncomingMessage, res: ServerResponse): void {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });
  const client: SSEClient = { res };
  sseClients.add(client);
  req.on('close', () => {
    sseClients.delete(client);
  });
}

const middleware: Connect.NextHandleFunction = async (req, res, next) => {
  const url = req.url ?? '';
  const method = req.method ?? 'GET';

  if (url === '/api/console/events' && method === 'GET') {
    attachSseClient(req, res);
    return;
  }

  if (url === '/api/console/stories' && method === 'GET') {
    try {
      const files = await fs.readdir(STORIES_DIR);
      const storyFiles = files.filter((file) => file.endsWith('.md'));
      const items = await Promise.all(
        storyFiles.map(async (file) => {
          const fullPath = path.join(STORIES_DIR, file);
          const raw = await fs.readFile(fullPath, 'utf-8');
          return { file, path: fullPath, raw };
        }),
      );
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(items));
    } catch (error) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: (error as Error).message }));
    }
    return;
  }

  if (url.startsWith('/api/console/stories/') && method === 'PUT') {
    const storyId = decodeURIComponent(url.slice('/api/console/stories/'.length));
    if (!storyId) {
      res.statusCode = 400;
      res.end(JSON.stringify({ error: 'Missing story id' }));
      return;
    }
    try {
      const chunks: Buffer[] = [];
      for await (const chunk of req) chunks.push(chunk as Buffer);
      const body = JSON.parse(Buffer.concat(chunks).toString('utf-8')) as { raw: string };
      const existing = await readStory(storyId);
      if (!existing) {
        res.statusCode = 404;
        res.end(JSON.stringify({ error: `Story not found: ${storyId}` }));
        return;
      }
      await fs.writeFile(existing.path, body.raw, 'utf-8');
      broadcast({ type: 'stories-changed', path: existing.path });
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ ok: true, path: existing.path }));
    } catch (error) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: (error as Error).message }));
    }
    return;
  }

  if (url === '/api/console/architecture-doc' && method === 'GET') {
    try {
      const content = await readArchitectureDoc();
      res.setHeader('Content-Type', 'text/plain');
      res.end(content);
    } catch (error) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: (error as Error).message }));
    }
    return;
  }

  if (url === '/api/console/reducers' && method === 'GET') {
    try {
      const items = await listReducers();
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(items));
    } catch (error) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: (error as Error).message }));
    }
    return;
  }

  next();
};

export default function consolePlugin(): Plugin {
  return {
    name: 'shardwilds-console',
    configureServer(server: ViteDevServer) {
      server.middlewares.use(middleware);
      startWatcher();
      server.httpServer?.on('close', () => {
        storiesWatcher?.close();
        archWatcher?.close();
        storiesWatcher = null;
        archWatcher = null;
        sseClients.clear();
      });
    },
  };
}

// re-export helpers for tests
export { readStory, parseArgsString, listReducers };