# Shardwilds Console Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build `tools/console/` — a Vite + React + TypeScript dev console with three tabs (Kanban, Architecture, API Runner) for managing Shardwilds development locally.

**Architecture:** Standalone Vite app served on port 5174. Three feature folders (`kanban/`, `architecture/`, `api-runner/`) own their state + parsers + UI. A custom Vite middleware plugin (`vite-plugin-console.ts`) exposes file CRUD + SSE file-watcher endpoints. shadcn/ui for components, Zustand for app state, Mermaid for diagrams, gray-matter for markdown frontmatter.

**Tech Stack:** Vite 6, React 19, TypeScript 5, Zustand 5, shadcn/ui (Radix + Tailwind 4), mermaid 11, gray-matter, marked, vitest, pnpm.

**Spec:** `docs/superpowers/specs/2026-06-25-shardwilds-console-design.md`

**Working directory for all tasks:** `tools/console/`. Run `pwd` to verify before any task that creates files there.

---

## File Structure

```
tools/console/
  README.md                          setup + run + troubleshooting
  package.json                       deps + scripts
  pnpm-lock.yaml                     generated
  tsconfig.json                      base ts config
  tsconfig.app.json                  app ts config
  tsconfig.node.json                 vite-plugin ts config
  vite.config.ts                     registers vite-plugin-console
  vite-plugin-console.ts             custom plugin: stories CRUD, arch doc,
                                     reducers, SSE file watcher
  tailwind.config.ts                 tailwind + shadcn theme
  postcss.config.js                  tailwind + autoprefixer
  components.json                    shadcn config
  index.html                         entry html
  vitest.config.ts                   vitest config (node env for plugin tests)
  src/
    main.tsx                         entry, mounts <App />
    vite-env.d.ts                    vite client types
    app/
      App.tsx                        tab shell
      TabNav.tsx                     3-tab nav
      useActiveTab.ts                zustand: active tab id
      ErrorBoundary.tsx              per-tab error boundary
    kanban/
      KanbanTab.tsx                  tab container
      Board.tsx                      4-column grid
      Card.tsx                       collapsed card
      CardExpanded.tsx               expanded editor
      NewCardDialog.tsx              new-story dialog
      useStories.ts                  load/save hook
      markdown.ts                    frontmatter parse + serialize
      types.ts                       Story, Status, ColumnId
    architecture/
      ArchitectureTab.tsx            tab container
      DiagramView.tsx                mermaid renderer + pan/zoom
      parser.ts                      markdown -> GraphModel
      builder.ts                     GraphModel -> mermaid string
      types.ts                       Node, Edge, GraphModel
    api-runner/
      ApiRunnerTab.tsx               tab container
      ReducerList.tsx                sidebar list
      ReducerForm.tsx                args form
      ResponseView.tsx               response display
      useReducerCall.ts              fetch + state
      reducerList.ts                 parse bindings -> list
      client.ts                      STDB HTTP client
      types.ts                       ReducerDef, CallResult
    lib/
      http.ts                        typed fetch helper
      storage.ts                     localStorage wrapper
      cn.ts                          shadcn class-name helper
      useEventSource.ts              SSE hook with reconnect
    styles/
      globals.css                    tailwind + shadcn vars
    components/
      ui/                            shadcn-generated components
        button.tsx
        card.tsx
        dialog.tsx
        input.tsx
        label.tsx
        select.tsx
        badge.tsx
        toast.tsx (or sonner)
  tests/
    kanban-markdown.test.ts
    architecture-parser.test.ts
    architecture-builder.test.ts
    api-runner-reducer-list.test.ts
    plugin-stories.test.ts
```

---

## Task 1: Scaffold Vite + React + TypeScript

**Files:**
- Create: `tools/console/package.json`
- Create: `tools/console/tsconfig.json`
- Create: `tools/console/tsconfig.app.json`
- Create: `tools/console/tsconfig.node.json`
- Create: `tools/console/vite.config.ts`
- Create: `tools/console/index.html`
- Create: `tools/console/src/main.tsx`
- Create: `tools/console/src/app/App.tsx`
- Create: `tools/console/src/vite-env.d.ts`
- Create: `tools/console/.gitignore`

- [ ] **Step 1.1: Create `tools/console/.gitignore`**

```
node_modules
dist
.vite
.DS_Store
*.log
.env
.env.local
```

- [ ] **Step 1.2: Create `tools/console/package.json`**

```json
{
  "name": "shardwilds-console",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "@radix-ui/react-dialog": "^1.1.4",
    "@radix-ui/react-label": "^2.1.1",
    "@radix-ui/react-select": "^2.1.4",
    "@radix-ui/react-slot": "^1.1.1",
    "@radix-ui/react-toast": "^1.2.4",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "gray-matter": "^4.0.3",
    "marked": "^15.0.6",
    "mermaid": "^11.4.1",
    "react": "^19.2.6",
    "react-dom": "^19.2.6",
    "sonner": "^1.7.1",
    "tailwind-merge": "^2.6.0",
    "zustand": "^5.0.2"
  },
  "devDependencies": {
    "@types/node": "^24.12.3",
    "@types/react": "^19.2.14",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^6.0.1",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.5.1",
    "tailwindcss": "^4.0.0",
    "@tailwindcss/vite": "^4.0.0",
    "typescript": "~6.0.2",
    "vite": "^8.0.12",
    "vitest": "^3.0.0"
  }
}
```

Note: Tailwind 4 uses `@tailwindcss/vite` plugin and CSS-first config (no `tailwind.config.ts` needed). shadcn/ui v4 supports Tailwind 4.

- [ ] **Step 1.3: Create `tools/console/tsconfig.json`**

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
```

- [ ] **Step 1.4: Create `tools/console/tsconfig.app.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true,
    "resolveJsonModule": true,
    "isolatedModules": true
  },
  "include": ["src"]
}
```

- [ ] **Step 1.5: Create `tools/console/tsconfig.node.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2023"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true,
    "resolveJsonModule": true,
    "isolatedModules": true
  },
  "include": ["vite.config.ts", "vite-plugin-console.ts"]
}
```

- [ ] **Step 1.6: Create `tools/console/vite.config.ts`**

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import consolePlugin from './vite-plugin-console';

export default defineConfig({
  plugins: [react(), tailwindcss(), consolePlugin()],
  server: {
    port: 5174,
    strictPort: true,
  },
});
```

(The `consolePlugin` import will fail until Task 4 creates the file. Create a stub now:)

- [ ] **Step 1.7: Create stub `tools/console/vite-plugin-console.ts`**

```typescript
import type { Plugin } from 'vite';

export default function consolePlugin(): Plugin {
  return {
    name: 'shardwilds-console',
    configureServer() {
      // populated in Task 4
    },
  };
}
```

- [ ] **Step 1.8: Create `tools/console/index.html`**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Shardwilds Console</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 1.9: Create `tools/console/src/vite-env.d.ts`**

```typescript
/// <reference types="vite/client" />
```

- [ ] **Step 1.10: Create `tools/console/src/main.tsx`**

```typescript
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './app/App';
import './styles/globals.css';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element #root not found in index.html');

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

- [ ] **Step 1.11: Create placeholder `tools/console/src/app/App.tsx`**

```typescript
export default function App() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Shardwilds Console</h1>
      <p>Dev console scaffold — placeholder.</p>
    </div>
  );
}
```

- [ ] **Step 1.12: Create empty `tools/console/src/styles/globals.css`**

```css
/* tailwind base layer will be added in Task 2 */
```

- [ ] **Step 1.13: Install dependencies**

Run: `cd tools/console && pnpm install`
Expected: installs all deps, no errors. `node_modules/` created, `pnpm-lock.yaml` written.

- [ ] **Step 1.14: Verify dev server boots**

Run: `cd tools/console && pnpm dev` (background it or use timeout)
Expected: `VITE v8.x  ready in xxx ms` and `Local: http://localhost:5174/`.

Then in another shell: `curl -s http://localhost:5174/ | grep "Shardwilds Console"`
Expected: `<title>Shardwilds Console</title>` appears in output.

Stop the dev server.

- [ ] **Step 1.15: Commit**

```bash
cd tools/console
git add -A
git commit -m "feat(console): scaffold Vite + React + TS shell"
```

---

## Task 2: Tailwind v4 + shadcn/ui setup

**Files:**
- Modify: `tools/console/src/styles/globals.css`
- Create: `tools/console/postcss.config.js` (only if needed; Tailwind 4 Vite plugin handles it)
- Create: `tools/console/components.json`
- Create: `tools/console/src/lib/cn.ts`
- Create: `tools/console/src/components/ui/button.tsx`

- [ ] **Step 2.1: Update `tools/console/src/styles/globals.css` with Tailwind v4 import**

```css
@import "tailwindcss";

@theme {
  --color-background: #0a0a0a;
  --color-foreground: #fafafa;
  --color-card: #171717;
  --color-card-foreground: #fafafa;
  --color-primary: #6366f1;
  --color-primary-foreground: #fafafa;
  --color-secondary: #262626;
  --color-secondary-foreground: #fafafa;
  --color-muted: #262626;
  --color-muted-foreground: #a3a3a3;
  --color-accent: #404040;
  --color-accent-foreground: #fafafa;
  --color-destructive: #ef4444;
  --color-destructive-foreground: #fafafa;
  --color-border: #262626;
  --color-input: #262626;
  --color-ring: #6366f1;
}

:root {
  color-scheme: dark;
}

html, body, #root {
  height: 100%;
  margin: 0;
  background: var(--color-background);
  color: var(--color-foreground);
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
}
```

- [ ] **Step 2.2: Create `tools/console/components.json`**

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/styles/globals.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "aliases": {
    "components": "src/components",
    "utils": "src/lib/cn",
    "ui": "src/components/ui",
    "lib": "src/lib",
    "hooks": "src/hooks"
  }
}
```

- [ ] **Step 2.3: Create `tools/console/src/lib/cn.ts`**

```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 2.4: Create `tools/console/src/components/ui/button.tsx`**

```typescript
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-border bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...properties }, reference) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={reference}
        {...properties}
      />
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
```

- [ ] **Step 2.5: Verify Tailwind + button styles work**

Modify `tools/console/src/app/App.tsx` to:

```typescript
import { Button } from '../components/ui/button';

export default function App() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Shardwilds Console</h1>
      <Button>Test Button</Button>
    </div>
  );
}
```

Run: `cd tools/console && pnpm dev` (background)
Run: `curl -s http://localhost:5174/ | grep -c "Test Button"`
Expected: 1

Stop dev server.

- [ ] **Step 2.6: Commit**

```bash
cd tools/console
git add -A
git commit -m "feat(console): tailwind v4 + shadcn button scaffold"
```

---

## Task 3: Tab shell + nav

**Files:**
- Create: `tools/console/src/app/useActiveTab.ts`
- Create: `tools/console/src/app/TabNav.tsx`
- Create: `tools/console/src/app/ErrorBoundary.tsx`
- Create: `tools/console/src/lib/storage.ts`
- Modify: `tools/console/src/app/App.tsx`

- [ ] **Step 3.1: Create `tools/console/src/lib/storage.ts`**

```typescript
export function readLocal<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeLocal<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // quota exceeded or storage disabled — silently ignore for dev tool
  }
}
```

- [ ] **Step 3.2: Create `tools/console/src/app/useActiveTab.ts`**

```typescript
import { create } from 'zustand';
import { readLocal, writeLocal } from '../lib/storage';

export type TabId = 'kanban' | 'architecture' | 'api-runner';

interface ActiveTabState {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
}

const STORAGE_KEY = 'shardwilds-console:active-tab';

export const useActiveTab = create<ActiveTabState>((set) => ({
  activeTab: readLocal<TabId>(STORAGE_KEY, 'kanban'),
  setActiveTab: (tab) => {
    writeLocal(STORAGE_KEY, tab);
    set({ activeTab: tab });
  },
}));
```

- [ ] **Step 3.3: Create `tools/console/src/app/TabNav.tsx`**

```typescript
import { cn } from '../lib/cn';
import { useActiveTab, type TabId } from './useActiveTab';

const TABS: { id: TabId; label: string }[] = [
  { id: 'kanban', label: 'Kanban' },
  { id: 'architecture', label: 'Architecture' },
  { id: 'api-runner', label: 'API Runner' },
];

export function TabNav() {
  const activeTab = useActiveTab((state) => state.activeTab);
  const setActiveTab = useActiveTab((state) => state.setActiveTab);

  return (
    <nav className="flex border-b border-border bg-card">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={cn(
            'px-6 py-3 text-sm font-medium transition-colors',
            activeTab === tab.id
              ? 'border-b-2 border-primary text-foreground'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
```

- [ ] **Step 3.4: Create `tools/console/src/app/ErrorBoundary.tsx`**

```typescript
import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: '' };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error) {
    console.error('Tab error:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="p-6 text-destructive">
            <h3 className="font-bold">Tab crashed</h3>
            <p className="text-sm">{this.state.message}</p>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
```

- [ ] **Step 3.5: Update `tools/console/src/app/App.tsx`**

```typescript
import { TabNav } from './TabNav';
import { ErrorBoundary } from './ErrorBoundary';
import { useActiveTab } from './useActiveTab';

function KanbanPlaceholder() {
  return <div className="p-6 text-muted-foreground">Kanban tab (placeholder)</div>;
}

function ArchitecturePlaceholder() {
  return <div className="p-6 text-muted-foreground">Architecture tab (placeholder)</div>;
}

function ApiRunnerPlaceholder() {
  return <div className="p-6 text-muted-foreground">API Runner tab (placeholder)</div>;
}

export default function App() {
  const activeTab = useActiveTab((state) => state.activeTab);

  return (
    <div className="h-full flex flex-col">
      <TabNav />
      <main className="flex-1 overflow-auto">
        <ErrorBoundary>
          {activeTab === 'kanban' && <KanbanPlaceholder />}
          {activeTab === 'architecture' && <ArchitecturePlaceholder />}
          {activeTab === 'api-runner' && <ApiRunnerPlaceholder />}
        </ErrorBoundary>
      </main>
    </div>
  );
}
```

- [ ] **Step 3.6: Verify tabs switch**

Run: `cd tools/console && pnpm dev` (background)
Open `http://localhost:5174/` in browser. Verify:
1. Three tabs visible
2. Clicking switches content
3. Active tab persists across browser refresh

Stop dev server.

- [ ] **Step 3.7: Commit**

```bash
cd tools/console
git add -A
git commit -m "feat(console): tab shell with persistent active tab"
```

---

## Task 4: Vite plugin — stories CRUD + arch doc + reducers + SSE

**Files:**
- Modify: `tools/console/vite-plugin-console.ts`
- Create: `tools/console/vitest.config.ts`

- [ ] **Step 4.1: Create `tools/console/vitest.config.ts`**

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
  },
});
```

- [ ] **Step 4.2: Replace `tools/console/vite-plugin-console.ts` with full plugin**

```typescript
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
let fileWatcher: FSWatcher | null = null;

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
  if (fileWatcher) return;
  fileWatcher = watch(STORIES_DIR, { recursive: true }, (_event, filename) => {
    if (filename) {
      broadcast({ type: 'stories-changed', path: filename });
    }
  });
  fileWatcher.on('error', (error) => {
    console.error('[shardwilds-console] file watcher error:', error);
  });
}

async function readStory(storyId: string): Promise<{ path: string; raw: string } | null> {
  const files = await fs.readdir(STORIES_DIR);
  const match = files.find((file) => file.startsWith(storyId));
  if (!match) return null;
  const fullPath = path.join(STORIES_DIR, match);
  const raw = await fs.readFile(fullPath, 'utf-8');
  return { path: fullPath, raw };
}

async function listStories(): Promise<string> {
  try {
    return await fs.readFile(ARCH_DOC, 'utf-8');
  } catch {
    return '';
  }
}

async function listReducers(): Promise<unknown[]> {
  try {
    const files = await fs.readdir(BINDINGS_DIR);
    return files.filter((file) => file.endsWith('.ts')).map((file) => ({
      file,
      path: path.join(BINDINGS_DIR, file),
    }));
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

  if (url === '/api/console/architecture-doc' && method === 'GET') {
    try {
      const content = await listStories();
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
        fileWatcher?.close();
        fileWatcher = null;
        sseClients.clear();
      });
    },
  };
}

// re-export helper for tests
export { readStory };
```

- [ ] **Step 4.3: Verify endpoints**

Run: `cd tools/console && pnpm dev` (background)
Run each and verify HTTP 200 + non-empty body:
- `curl -s http://localhost:5174/api/console/stories | head -c 200`
- `curl -s http://localhost:5174/api/console/architecture-doc | head -c 100`
- `curl -s http://localhost:5174/api/console/reducers | head -c 100`

Stop dev server.

- [ ] **Step 4.4: Commit**

```bash
cd tools/console
git add -A
git commit -m "feat(console): vite plugin with stories + arch doc + reducers + sse"
```

---

## Task 5: Kanban — markdown parser (TDD)

**Files:**
- Create: `tools/console/src/kanban/types.ts`
- Create: `tools/console/src/kanban/markdown.ts`
- Create: `tools/console/tests/kanban-markdown.test.ts`

- [ ] **Step 5.1: Create `tools/console/src/kanban/types.ts`**

```typescript
export type Status = 'todo' | 'in-progress' | 'review' | 'done';
export type ColumnId = Status;

export interface Story {
  storyId: string;
  title: string;
  status: Status;
  phase: string;
  epic: string;
  createdAt: string;
  updatedAt: string;
  order: number;
  body: string;
  filePath: string;
}

export interface StoryInput {
  storyId: string;
  title: string;
  status: Status;
  phase: string;
  epic: string;
  body: string;
  order: number;
}
```

- [ ] **Step 5.2: Write failing test in `tools/console/tests/kanban-markdown.test.ts`**

```typescript
import { describe, it, expect } from 'vitest';
import { parseStory, serializeStory } from '../src/kanban/markdown';

describe('parseStory', () => {
  it('extracts frontmatter and body', () => {
    const raw = `---
story_id: STORY-040
title: Design Player Tables
status: todo
phase: "Phase 4"
epic: "EPIC-040 Identity"
created_at: 2026-06-25
updated_at: 2026-06-25
order: 0
---

# Design

Body content here.`;

    const story = parseStory(raw, '/tmp/STORY-040-design.md');
    expect(story.storyId).toBe('STORY-040');
    expect(story.title).toBe('Design Player Tables');
    expect(story.status).toBe('todo');
    expect(story.phase).toBe('Phase 4');
    expect(story.epic).toBe('EPIC-040 Identity');
    expect(story.order).toBe(0);
    expect(story.body).toContain('# Design');
    expect(story.body).toContain('Body content here.');
    expect(story.filePath).toBe('/tmp/STORY-040-design.md');
  });

  it('defaults missing optional fields', () => {
    const raw = `---
story_id: STORY-001
title: Minimal
status: done
---
body`;

    const story = parseStory(raw, '/tmp/STORY-001.md');
    expect(story.phase).toBe('');
    expect(story.epic).toBe('');
    expect(story.order).toBe(0);
  });

  it('throws on missing story_id', () => {
    const raw = `---
title: No ID
status: todo
---
body`;

    expect(() => parseStory(raw, '/tmp/x.md')).toThrow(/story_id/);
  });

  it('throws on invalid status', () => {
    const raw = `---
story_id: STORY-X
title: Bad status
status: blocked
---
body`;

    expect(() => parseStory(raw, '/tmp/x.md')).toThrow(/status/);
  });
});

describe('serializeStory', () => {
  it('round-trips parseStory output', () => {
    const original = `---
story_id: STORY-040
title: Round Trip
status: in-progress
phase: "Phase 4"
epic: "EPIC-040"
created_at: 2026-06-25
updated_at: 2026-06-25
order: 3
---

body content`;

    const story = parseStory(original, '/tmp/x.md');
    const serialized = serializeStory(story);
    const reparsed = parseStory(serialized, '/tmp/x.md');

    expect(reparsed.storyId).toBe(story.storyId);
    expect(reparsed.title).toBe(story.title);
    expect(reparsed.status).toBe(story.status);
    expect(reparsed.phase).toBe(story.phase);
    expect(reparsed.epic).toBe(story.epic);
    expect(reparsed.order).toBe(story.order);
    expect(reparsed.body.trim()).toBe(story.body.trim());
  });
});
```

- [ ] **Step 5.3: Run test to verify failure**

Run: `cd tools/console && pnpm test`
Expected: FAIL with "Cannot find module '../src/kanban/markdown'"

- [ ] **Step 5.4: Implement `tools/console/src/kanban/markdown.ts`**

```typescript
import matter from 'gray-matter';
import type { Story, StoryInput, Status } from './types';

const VALID_STATUSES: Status[] = ['todo', 'in-progress', 'review', 'done'];

function isStatus(value: unknown): value is Status {
  return typeof value === 'string' && VALID_STATUSES.includes(value as Status);
}

export function parseStory(raw: string, filePath: string): Story {
  const parsed = matter(raw);
  const data = parsed.data as Record<string, unknown>;

  if (typeof data.story_id !== 'string' || data.story_id.length === 0) {
    throw new Error('Missing required frontmatter field: story_id');
  }
  if (typeof data.title !== 'string') {
    throw new Error('Missing required frontmatter field: title');
  }
  if (!isStatus(data.status)) {
    throw new Error(`Invalid status: must be one of ${VALID_STATUSES.join(', ')}`);
  }

  return {
    storyId: data.story_id,
    title: data.title,
    status: data.status,
    phase: typeof data.phase === 'string' ? data.phase : '',
    epic: typeof data.epic === 'string' ? data.epic : '',
    createdAt: typeof data.created_at === 'string' ? data.created_at : '',
    updatedAt: typeof data.updated_at === 'string' ? data.updated_at : '',
    order: typeof data.order === 'number' ? data.order : 0,
    body: parsed.content,
    filePath,
  };
}

export function serializeStory(story: StoryInput): string {
  const today = new Date().toISOString().slice(0, 10);
  const frontmatter: Record<string, unknown> = {
    story_id: story.storyId,
    title: story.title,
    status: story.status,
    phase: story.phase,
    epic: story.epic,
    created_at: today,
    updated_at: today,
    order: story.order,
  };
  return matter.stringify(story.body, frontmatter);
}
```

- [ ] **Step 5.5: Run test to verify pass**

Run: `cd tools/console && pnpm test`
Expected: PASS, all 5 tests green.

- [ ] **Step 5.6: Commit**

```bash
cd tools/console
git add -A
git commit -m "feat(console): kanban markdown parse + serialize with tests"
```

---

## Task 6: Kanban — Board UI (read-only)

**Files:**
- Create: `tools/console/src/kanban/useStories.ts`
- Create: `tools/console/src/kanban/Board.tsx`
- Create: `tools/console/src/kanban/Card.tsx`
- Create: `tools/console/src/kanban/KanbanTab.tsx`
- Modify: `tools/console/src/app/App.tsx`

- [ ] **Step 6.1: Create `tools/console/src/kanban/useStories.ts`**

```typescript
import { useEffect, useState, useCallback } from 'react';
import { parseStory } from './markdown';
import type { Story } from './types';

interface StoriesResponse {
  file: string;
  path: string;
  raw: string;
}

export function useStories() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const response = await fetch('/api/console/stories');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const items = (await response.json()) as StoriesResponse[];
      const parsed = items
        .map((item) => {
          try {
            return parseStory(item.raw, item.path);
          } catch (error) {
            console.error(`Failed to parse ${item.file}:`, error);
            return null;
          }
        })
        .filter((story): story is Story => story !== null);
      setStories(parsed);
      setError(null);
    } catch (fetchError) {
      setError((fetchError as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { stories, loading, error, refresh };
}
```

- [ ] **Step 6.2: Create `tools/console/src/kanban/Card.tsx`**

```typescript
import { Badge } from '../components/ui/badge';
import type { Story } from './types';

interface Props {
  story: Story;
  onClick: () => void;
}

export function Card({ story, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left p-3 rounded-md border border-border bg-card hover:bg-accent transition-colors"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="text-xs font-mono text-muted-foreground">{story.storyId}</span>
        <Badge variant="outline" className="text-xs">
          {story.status}
        </Badge>
      </div>
      <h4 className="font-medium text-sm mb-1">{story.title}</h4>
      {story.epic && <p className="text-xs text-muted-foreground">{story.epic}</p>}
    </button>
  );
}
```

- [ ] **Step 6.3: Create `tools/console/src/kanban/Board.tsx`**

```typescript
import { useState } from 'react';
import { Card } from './Card';
import type { Story, Status, ColumnId } from './types';

interface Props {
  stories: Story[];
  onSelect: (story: Story) => void;
}

const COLUMNS: { id: ColumnId; label: string }[] = [
  { id: 'todo', label: 'Todo' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'review', label: 'Review' },
  { id: 'done', label: 'Done' },
];

export function Board({ stories, onSelect }: Props) {
  const byColumn = COLUMNS.map((column) => ({
    ...column,
    stories: stories
      .filter((story) => story.status === column.id)
      .sort((a, b) => a.order - b.order),
  }));

  return (
    <div className="grid grid-cols-4 gap-4 p-4 h-full overflow-auto">
      {byColumn.map((column) => (
        <div key={column.id} className="flex flex-col bg-secondary/30 rounded-md p-3">
          <h3 className="text-sm font-semibold mb-3 flex items-center justify-between">
            <span>{column.label}</span>
            <span className="text-xs text-muted-foreground">{column.stories.length}</span>
          </h3>
          <div className="flex flex-col gap-2 overflow-auto">
            {column.stories.length === 0 ? (
              <p className="text-xs text-muted-foreground italic py-4 text-center">
                No stories
              </p>
            ) : (
              column.stories.map((story) => (
                <Card key={story.storyId} story={story} onClick={() => onSelect(story)} />
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 6.4: Create placeholder Badge component since shadcn wasn't installed in Task 2**

Create `tools/console/src/components/ui/badge.tsx`:

```typescript
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/cn';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground',
        secondary: 'border-transparent bg-secondary text-secondary-foreground',
        outline: 'text-foreground',
      },
    },
    defaultVariants: { variant: 'default' },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...properties }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...properties} />;
}

export { Badge, badgeVariants };
```

- [ ] **Step 6.5: Create `tools/console/src/kanban/KanbanTab.tsx`**

```typescript
import { useState } from 'react';
import { Board } from './Board';
import { useStories } from './useStories';
import type { Story } from './types';

export function KanbanTab() {
  const { stories, loading, error } = useStories();
  const [selected, setSelected] = useState<Story | null>(null);

  if (loading) {
    return <div className="p-6 text-muted-foreground">Loading stories…</div>;
  }
  if (error) {
    return (
      <div className="p-6 text-destructive">
        <h3 className="font-bold">Failed to load stories</h3>
        <p className="text-sm">{error}</p>
      </div>
    );
  }
  if (stories.length === 0) {
    return (
      <div className="p-6 text-muted-foreground italic">
        No stories yet — drop your first STORY-XXX markdown in <code>docs/stories/</code>.
      </div>
    );
  }

  return <Board stories={stories} onSelect={setSelected} />;
}
```

- [ ] **Step 6.6: Wire KanbanTab into App.tsx**

Modify `tools/console/src/app/App.tsx`:

```typescript
import { TabNav } from './TabNav';
import { ErrorBoundary } from './ErrorBoundary';
import { useActiveTab } from './useActiveTab';
import { KanbanTab } from '../kanban/KanbanTab';

function ArchitecturePlaceholder() {
  return <div className="p-6 text-muted-foreground">Architecture tab (placeholder)</div>;
}

function ApiRunnerPlaceholder() {
  return <div className="p-6 text-muted-foreground">API Runner tab (placeholder)</div>;
}

export default function App() {
  const activeTab = useActiveTab((state) => state.activeTab);

  return (
    <div className="h-full flex flex-col">
      <TabNav />
      <main className="flex-1 overflow-auto">
        <ErrorBoundary>
          {activeTab === 'kanban' && <KanbanTab />}
          {activeTab === 'architecture' && <ArchitecturePlaceholder />}
          {activeTab === 'api-runner' && <ApiRunnerPlaceholder />}
        </ErrorBoundary>
      </main>
    </div>
  );
}
```

- [ ] **Step 6.7: Verify kanban displays existing stories**

Run: `cd tools/console && pnpm dev` (background)
Open `http://localhost:5174/`. Kanban tab should show 11 existing stories from `docs/stories/` (e.g., STORY-001, STORY-022) distributed across columns.

Note: existing story files don't follow the new frontmatter schema, so they may show "Failed to parse" errors in console. That's expected. New stories will use the schema.

Stop dev server.

- [ ] **Step 6.8: Commit**

```bash
cd tools/console
git add -A
git commit -m "feat(console): kanban board read-only with 4 columns"
```

---

## Task 7: Kanban — CardExpanded (status change + title edit, debounced save)

**Files:**
- Create: `tools/console/src/kanban/CardExpanded.tsx`
- Modify: `tools/console/vite-plugin-console.ts` (add PUT endpoint)
- Modify: `tools/console/src/kanban/KanbanTab.tsx`

- [ ] **Step 7.1: Add PUT endpoint to `tools/console/vite-plugin-console.ts`**

In the `middleware` function, add this BEFORE the `next()` call:

```typescript
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
```

- [ ] **Step 7.2: Create `tools/console/src/kanban/CardExpanded.tsx`**

```typescript
import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { serializeStory, parseStory } from './markdown';
import type { Story, Status } from './types';

interface Props {
  story: Story | null;
  onClose: () => void;
  onSaved: () => void;
}

const STATUSES: Status[] = ['todo', 'in-progress', 'review', 'done'];

export function CardExpanded({ story, onClose, onSaved }: Props) {
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState<Status>('todo');
  const [body, setBody] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (story) {
      setTitle(story.title);
      setStatus(story.status);
      setBody(story.body);
      setError(null);
    }
  }, [story]);

  useEffect(() => {
    if (!story) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      void save();
    }, 500);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, status, body]);

  async function save() {
    if (!story) return;
    if (title === story.title && status === story.status && body === story.body) return;
    setSaving(true);
    setError(null);
    try {
      const serialized = serializeStory({
        storyId: story.storyId,
        title,
        status,
        phase: story.phase,
        epic: story.epic,
        body,
        order: story.order,
      });
      const response = await fetch(`/api/console/stories/${encodeURIComponent(story.storyId)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ raw: serialized }),
      });
      if (!response.ok) {
        const errorBody = (await response.json()) as { error?: string };
        throw new Error(errorBody.error ?? `HTTP ${response.status}`);
      }
      onSaved();
    } catch (saveError) {
      setError((saveError as Error).message);
    } finally {
      setSaving(false);
    }
  }

  if (!story) return null;

  return (
    <Dialog open={!!story} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="font-mono text-sm">{story.storyId}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              value={status}
              onChange={(event) => setStatus(event.target.value as Status)}
              className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
            >
              {STATUSES.map((value) => (
                <option key={value} value={value}>{value}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="body">Body</Label>
            <textarea
              id="body"
              value={body}
              onChange={(event) => setBody(event.target.value)}
              rows={12}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono"
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {saving ? 'Saving…' : 'Saved'}
            </span>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

- [ ] **Step 7.3: Create shadcn Input + Label + Dialog components**

Create `tools/console/src/components/ui/input.tsx`:

```typescript
import * as React from 'react';
import { cn } from '../../lib/cn';

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...properties }, reference) => (
    <input
      type={type}
      className={cn(
        'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      ref={reference}
      {...properties}
    />
  ),
);
Input.displayName = 'Input';
export { Input };
```

Create `tools/console/src/components/ui/label.tsx`:

```typescript
import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cn } from '../../lib/cn';

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...properties }, reference) => (
  <LabelPrimitive.Root
    ref={reference}
    className={cn('text-sm font-medium leading-none', className)}
    {...properties}
  />
));
Label.displayName = 'Label';
export { Label };
```

Create `tools/console/src/components/ui/dialog.tsx`:

```typescript
import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { cn } from '../../lib/cn';

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...properties }, reference) => (
  <DialogPrimitive.Overlay
    ref={reference}
    className={cn(
      'fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out',
      className,
    )}
    {...properties}
  />
));
DialogOverlay.displayName = 'DialogOverlay';

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...properties }, reference) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={reference}
      className={cn(
        'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-border bg-card p-6 shadow-lg sm:rounded-lg',
        className,
      )}
      {...properties}
    >
      {children}
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = 'DialogContent';

const DialogHeader = ({ className, ...properties }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col space-y-1.5', className)} {...properties} />
);

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...properties }, reference) => (
  <DialogPrimitive.Title
    ref={reference}
    className={cn('text-lg font-semibold leading-none tracking-tight', className)}
    {...properties}
  />
));
DialogTitle.displayName = 'DialogTitle';

export { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle };
```

- [ ] **Step 7.4: Wire CardExpanded into KanbanTab**

Modify `tools/console/src/kanban/KanbanTab.tsx`:

```typescript
import { useState } from 'react';
import { Board } from './Board';
import { CardExpanded } from './CardExpanded';
import { useStories } from './useStories';
import type { Story } from './types';

export function KanbanTab() {
  const { stories, loading, error, refresh } = useStories();
  const [selected, setSelected] = useState<Story | null>(null);

  if (loading) {
    return <div className="p-6 text-muted-foreground">Loading stories…</div>;
  }
  if (error) {
    return (
      <div className="p-6 text-destructive">
        <h3 className="font-bold">Failed to load stories</h3>
        <p className="text-sm">{error}</p>
      </div>
    );
  }
  if (stories.length === 0) {
    return (
      <div className="p-6 text-muted-foreground italic">
        No stories yet — drop your first STORY-XXX markdown in <code>docs/stories/</code>.
      </div>
    );
  }

  return (
    <>
      <Board stories={stories} onSelect={setSelected} />
      <CardExpanded story={selected} onClose={() => setSelected(null)} onSaved={refresh} />
    </>
  );
}
```

- [ ] **Step 7.5: Verify edit-and-save roundtrip**

Run: `cd tools/console && pnpm dev` (background)
1. Open `http://localhost:5174/`
2. Click any valid story card -> dialog opens
3. Change title, observe "Saving..." then "Saved"
4. Run `git status` in a shell: file should show as modified
5. Refresh browser: change persists

Stop dev server.

- [ ] **Step 7.6: Commit**

```bash
cd tools/console
git add -A
git commit -m "feat(console): kanban card edit dialog with debounced save"
```

---

## Task 8: Architecture — parser + builder (TDD)

**Files:**
- Create: `tools/console/src/architecture/types.ts`
- Create: `tools/console/src/architecture/parser.ts`
- Create: `tools/console/src/architecture/builder.ts`
- Create: `tools/console/tests/architecture-parser.test.ts`
- Create: `tools/console/tests/architecture-builder.test.ts`

- [ ] **Step 8.1: Create `tools/console/src/architecture/types.ts`**

```typescript
export interface GraphNode {
  id: string;
  label: string;
  shape: 'rect' | 'cyl' | 'hex' | 'asym';
  subgraph?: string;
}

export interface GraphEdge {
  from: string;
  to: string;
  label: string;
}

export interface GraphModel {
  nodes: GraphNode[];
  edges: GraphEdge[];
}
```

- [ ] **Step 8.2: Write failing parser test `tools/console/tests/architecture-parser.test.ts`**

```typescript
import { describe, it, expect } from 'vitest';
import { parseArchitectureDoc } from '../src/architecture/parser';

describe('parseArchitectureDoc', () => {
  it('extracts Phase 1 tables and reducers', () => {
    const doc = `# Architecture by Phase

## Phase 1: Hearthvale Online

Tables:

\`\`\`txt
Player
Character
Position
\`\`\`

Reducers:

\`\`\`txt
create_character(name)
spawn_character()
\`\`\`

Subscriptions:

\`\`\`txt
characters in zone
\`\`\`
`;

    const model = parseArchitectureDoc(doc);
    const tableIds = model.nodes.filter((node) => node.shape === 'cyl').map((node) => node.id);
    expect(tableIds).toContain('Player');
    expect(tableIds).toContain('Character');
    expect(tableIds).toContain('Position');
    expect(tableIds).not.toContain('Zone');

    const reducerIds = model.nodes.filter((node) => node.shape === 'hex').map((node) => node.id);
    expect(reducerIds).toContain('create_character');
    expect(reducerIds).toContain('spawn_character');

    const subgraphNodes = model.nodes.filter((node) => node.subgraph === 'Phase 1');
    expect(subgraphNodes.length).toBeGreaterThan(0);
  });

  it('returns empty model on empty doc', () => {
    const model = parseArchitectureDoc('');
    expect(model.nodes).toEqual([]);
    expect(model.edges).toEqual([]);
  });
});
```

- [ ] **Step 8.3: Run test to verify failure**

Run: `cd tools/console && pnpm test`
Expected: FAIL — module not found.

- [ ] **Step 8.4: Implement `tools/console/src/architecture/parser.ts`**

```typescript
import type { GraphModel, GraphNode, GraphEdge } from './types';

const SERVER_ID = 'server';

export function parseArchitectureDoc(doc: string): GraphModel {
  const model: GraphModel = { nodes: [], edges: [] };
  if (!doc.trim()) return model;

  ensureNode(model, {
    id: 'client',
    label: 'Client',
    shape: 'rect',
  });
  ensureNode(model, {
    id: SERVER_ID,
    label: 'SpacetimeDB',
    shape: 'cyl',
  });
  model.edges.push({ from: 'client', to: SERVER_ID, label: 'websocket' });

  const phaseSections = extractPhaseSections(doc);
  for (const phase of phaseSections) {
    const tables = extractCodeBlockItems(phase.body, /Tables:/i);
    const reducers = extractCodeBlockItems(phase.body, /Reducers:/i);
    const subscriptions = extractCodeBlockItems(phase.body, /Subscriptions:/i);

    for (const table of tables) {
      ensureNode(model, {
        id: table,
        label: table,
        shape: 'cyl',
        subgraph: phase.title,
      });
      model.edges.push({ from: SERVER_ID, to: table, label: 'read' });
    }
    for (const reducer of reducers) {
      const name = reducer.replace(/\(.*\)/, '').trim();
      ensureNode(model, {
        id: name,
        label: reducer,
        shape: 'hex',
        subgraph: phase.title,
      });
      model.edges.push({ from: name, to: tables[0] ?? SERVER_ID, label: 'write' });
    }
    for (const sub of subscriptions) {
      ensureNode(model, {
        id: `sub:${sub}`,
        label: sub,
        shape: 'asym',
        subgraph: phase.title,
      });
      model.edges.push({ from: SERVER_ID, to: 'client', label: `subscribe: ${sub}` });
    }
  }

  return model;
}

function ensureNode(model: GraphModel, node: GraphNode): void {
  if (!model.nodes.some((existing) => existing.id === node.id)) {
    model.nodes.push(node);
  }
}

interface PhaseSection {
  title: string;
  body: string;
}

function extractPhaseSections(doc: string): PhaseSection[] {
  const sections: PhaseSection[] = [];
  const lines = doc.split('\n');
  let current: PhaseSection | null = null;
  for (const line of lines) {
    const match = line.match(/^##\s+(.+)$/);
    if (match) {
      if (current) sections.push(current);
      current = { title: match[1].trim(), body: '' };
    } else if (current) {
      current.body += line + '\n';
    }
  }
  if (current) sections.push(current);
  return sections;
}

function extractCodeBlockItems(text: string, sectionHeading: RegExp): string[] {
  const headingMatch = text.match(sectionHeading);
  if (!headingMatch) return [];
  const after = text.slice(headingMatch.index! + headingMatch[0].length);
  const codeBlockMatch = after.match(/```[a-z]*\n([\s\S]*?)```/);
  if (!codeBlockMatch) return [];
  return codeBlockMatch[1]
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}
```

- [ ] **Step 8.5: Run parser tests — verify pass**

Run: `cd tools/console && pnpm test architecture-parser`
Expected: PASS.

- [ ] **Step 8.6: Write failing builder test `tools/console/tests/architecture-builder.test.ts`**

```typescript
import { describe, it, expect } from 'vitest';
import { buildMermaid } from '../src/architecture/builder';

describe('buildMermaid', () => {
  it('produces graph TD header and node lines', () => {
    const syntax = buildMermaid({
      nodes: [
        { id: 'client', label: 'Client', shape: 'rect' },
        { id: 'Player', label: 'Player', shape: 'cyl', subgraph: 'Phase 1' },
      ],
      edges: [{ from: 'client', to: 'server', label: 'ws' }],
    });
    expect(syntax).toContain('graph TD');
    expect(syntax).toContain('client[Client]');
    expect(syntax).toContain('Player[(Player)]');
    expect(syntax).toContain('subgraph Phase 1');
  });

  it('handles empty model', () => {
    const syntax = buildMermaid({ nodes: [], edges: [] });
    expect(syntax.trim()).toBe('graph TD');
  });
});
```

- [ ] **Step 8.7: Run builder test — verify failure**

Run: `cd tools/console && pnpm test architecture-builder`
Expected: FAIL — module not found.

- [ ] **Step 8.8: Implement `tools/console/src/architecture/builder.ts`**

```typescript
import type { GraphModel } from './types';

export function buildMermaid(model: GraphModel): string {
  const lines: string[] = ['graph TD'];

  const subgraphed = new Map<string, typeof model.nodes>();
  const topLevel: typeof model.nodes = [];

  for (const node of model.nodes) {
    if (node.subgraph) {
      const group = subgraphed.get(node.subgraph) ?? [];
      group.push(node);
      subgraphed.set(node.subgraph, group);
    } else {
      topLevel.push(node);
    }
  }

  for (const node of topLevel) {
    lines.push(`    ${renderNode(node)}`);
  }

  for (const [subgraphName, nodes] of subgraphed) {
    lines.push(`    subgraph ${subgraphName}`);
    for (const node of nodes) {
      lines.push(`        ${renderNode(node)}`);
    }
    lines.push('    end');
  }

  for (const edge of model.edges) {
    const safeLabel = edge.label.replace(/"/g, '\\"');
    lines.push(`    ${edge.from} -->|${safeLabel}| ${edge.to}`);
  }

  return lines.join('\n');
}

function renderNode(node: { id: string; label: string; shape: string }): string {
  switch (node.shape) {
    case 'cyl':
      return `${node.id}[(${node.label})]`;
    case 'hex':
      return `${node.id}{{${node.label}}}`;
    case 'asym':
      return `${node.id}>${node.label}]`;
    case 'rect':
    default:
      return `${node.id}[${node.label}]`;
  }
}
```

- [ ] **Step 8.9: Run all tests — verify pass**

Run: `cd tools/console && pnpm test`
Expected: PASS — all parser + builder tests green, kanban tests still green.

- [ ] **Step 8.10: Commit**

```bash
cd tools/console
git add -A
git commit -m "feat(console): architecture parser + mermaid builder with tests"
```

---

## Task 9: Architecture — DiagramView + tab wiring

**Files:**
- Create: `tools/console/src/lib/useEventSource.ts`
- Create: `tools/console/src/architecture/DiagramView.tsx`
- Create: `tools/console/src/architecture/ArchitectureTab.tsx`
- Modify: `tools/console/src/app/App.tsx`

- [ ] **Step 9.1: Create `tools/console/src/lib/useEventSource.ts`**

```typescript
import { useEffect, useRef, useState } from 'react';

interface UseEventSourceOptions {
  onMessage: (event: { type: string; path?: string }) => void;
}

export function useEventSource(url: string, options: UseEventSourceOptions) {
  const [connected, setConnected] = useState(false);
  const callbackRef = useRef(options.onMessage);
  callbackRef.current = options.onMessage;

  useEffect(() => {
    let source: EventSource | null = null;
    let retryDelay = 1000;
    let cancelled = false;

    function connect() {
      if (cancelled) return;
      source = new EventSource(url);
      source.onopen = () => {
        retryDelay = 1000;
        setConnected(true);
      };
      source.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as { type: string; path?: string };
          callbackRef.current(data);
        } catch (error) {
          console.error('SSE parse error:', error);
        }
      };
      source.onerror = () => {
        setConnected(false);
        source?.close();
        source = null;
        if (!cancelled) {
          setTimeout(connect, retryDelay);
          retryDelay = Math.min(retryDelay * 2, 30000);
        }
      };
    }

    connect();

    return () => {
      cancelled = true;
      source?.close();
    };
  }, [url]);

  return { connected };
}
```

- [ ] **Step 9.2: Create `tools/console/src/architecture/DiagramView.tsx`**

```typescript
import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({ startOnLoad: false, theme: 'dark' });

interface Props {
  syntax: string;
}

export function DiagramView({ syntax }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const id = `mermaid-${Math.random().toString(36).slice(2)}`;
    mermaid
      .render(id, syntax)
      .then(({ svg }) => {
        if (containerRef.current) {
          containerRef.current.innerHTML = svg;
          setError(null);
        }
      })
      .catch((renderError) => {
        setError((renderError as Error).message);
      });
  }, [syntax]);

  if (error) {
    return (
      <div className="p-4 text-destructive">
        <h3 className="font-bold">Diagram render error</h3>
        <pre className="text-xs whitespace-pre-wrap mt-2">{error}</pre>
      </div>
    );
  }

  return (
    <div className="overflow-auto p-4 h-full bg-background">
      <div ref={containerRef} className="mermaid-diagram" />
    </div>
  );
}
```

- [ ] **Step 9.3: Create `tools/console/src/architecture/ArchitectureTab.tsx`**

```typescript
import { useEffect, useState } from 'react';
import { Button } from '../components/ui/button';
import { DiagramView } from './DiagramView';
import { parseArchitectureDoc } from './parser';
import { buildMermaid } from './builder';
import { useEventSource } from '../lib/useEventSource';

export function ArchitectureTab() {
  const [syntax, setSyntax] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [docVersion, setDocVersion] = useState(0);

  async function loadDoc() {
    try {
      const response = await fetch('/api/console/architecture-doc');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const doc = await response.text();
      const model = parseArchitectureDoc(doc);
      const mermaidSyntax = buildMermaid(model);
      setSyntax(mermaidSyntax);
      setError(null);
    } catch (loadError) {
      setError((loadError as Error).message);
    }
  }

  useEffect(() => {
    void loadDoc();
  }, [docVersion]);

  const { connected } = useEventSource('/api/console/events', {
    onMessage: (event) => {
      if (event.type === 'arch-doc-changed' || event.path?.includes('03-architecture-by-phase')) {
        setDocVersion((v) => v + 1);
      }
    },
  });

  function copySyntax() {
    void navigator.clipboard.writeText(syntax);
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-3 border-b border-border bg-card">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span
            className={connected ? 'text-green-500' : 'text-muted-foreground'}
            title={connected ? 'SSE connected' : 'SSE disconnected'}
          >
            ●
          </span>
          <span>{connected ? 'Live' : 'Offline'}</span>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setDocVersion((v) => v + 1)}>
            Re-parse
          </Button>
          <Button variant="outline" size="sm" onClick={copySyntax}>
            Copy source
          </Button>
        </div>
      </div>
      {error ? (
        <div className="p-4 text-destructive">
          <h3 className="font-bold">Failed to load architecture doc</h3>
          <p className="text-sm">{error}</p>
        </div>
      ) : (
        <DiagramView syntax={syntax} />
      )}
    </div>
  );
}
```

- [ ] **Step 9.4: Wire ArchitectureTab into App.tsx**

Modify `tools/console/src/app/App.tsx`:

```typescript
import { TabNav } from './TabNav';
import { ErrorBoundary } from './ErrorBoundary';
import { useActiveTab } from './useActiveTab';
import { KanbanTab } from '../kanban/KanbanTab';
import { ArchitectureTab } from '../architecture/ArchitectureTab';

function ApiRunnerPlaceholder() {
  return <div className="p-6 text-muted-foreground">API Runner tab (placeholder)</div>;
}

export default function App() {
  const activeTab = useActiveTab((state) => state.activeTab);

  return (
    <div className="h-full flex flex-col">
      <TabNav />
      <main className="flex-1 overflow-auto">
        <ErrorBoundary>
          {activeTab === 'kanban' && <KanbanTab />}
          {activeTab === 'architecture' && <ArchitectureTab />}
          {activeTab === 'api-runner' && <ApiRunnerPlaceholder />}
        </ErrorBoundary>
      </main>
    </div>
  );
}
```

- [ ] **Step 9.5: Trigger file-watch event from plugin**

In `tools/console/vite-plugin-console.ts`, in the `startWatcher` function, add an `fs.watch` call for `ARCH_DOC`:

```typescript
function startWatcher(): void {
  if (fileWatcher) return;
  fileWatcher = watch(STORIES_DIR, { recursive: true }, (_event, filename) => {
    if (filename) {
      broadcast({ type: 'stories-changed', path: filename });
    }
  });
  watch(ARCH_DOC, () => {
    broadcast({ type: 'arch-doc-changed', path: ARCH_DOC });
  });
  fileWatcher.on('error', (error) => {
    console.error('[shardwilds-console] file watcher error:', error);
  });
}
```

- [ ] **Step 9.6: Verify diagram renders**

Run: `cd tools/console && pnpm dev` (background)
1. Open `http://localhost:5174/`
2. Click Architecture tab
3. Diagram renders with Phase 1 subgraph containing Player/Character/Position tables and reducers
4. "Live" indicator shows green
5. Click "Copy source" — clipboard contains mermaid syntax

Stop dev server.

- [ ] **Step 9.7: Commit**

```bash
cd tools/console
git add -A
git commit -m "feat(console): architecture diagram renders from doc with live updates"
```

---

## Task 10: API Runner — settings + reducer list

**Files:**
- Create: `tools/console/src/api-runner/useSettings.ts`
- Create: `tools/console/src/api-runner/types.ts`
- Create: `tools/console/src/api-runner/reducerList.ts`
- Create: `tools/console/src/api-runner/ReducerList.tsx`
- Create: `tools/console/src/api-runner/client.ts`

- [ ] **Step 10.1: Create `tools/console/src/api-runner/types.ts`**

```typescript
export interface ReducerArgDef {
  name: string;
  type: string;
}

export interface ReducerDef {
  name: string;
  args: ReducerArgDef[];
  file: string;
}

export interface CallResult {
  status: number;
  durationMs: number;
  body: string;
}
```

- [ ] **Step 10.2: Create `tools/console/src/api-runner/useSettings.ts`**

```typescript
import { create } from 'zustand';
import { readLocal, writeLocal } from '../lib/storage';

interface SettingsState {
  baseUrl: string;
  dbName: string;
  setBaseUrl: (value: string) => void;
  setDbName: (value: string) => void;
}

const STORAGE_KEY = 'shardwilds-console:settings';

interface Persisted {
  baseUrl: string;
  dbName: string;
}

export const useSettings = create<SettingsState>((set) => {
  const persisted = readLocal<Persisted>(STORAGE_KEY, {
    baseUrl: 'http://localhost:3000',
    dbName: 'shardwilds',
  });
  return {
    baseUrl: persisted.baseUrl,
    dbName: persisted.dbName,
    setBaseUrl: (value) => {
      set((state) => {
        const next = { baseUrl: value, dbName: state.dbName };
        writeLocal(STORAGE_KEY, next);
        return next;
      });
    },
    setDbName: (value) => {
      set((state) => {
        const next = { baseUrl: state.baseUrl, dbName: value };
        writeLocal(STORAGE_KEY, next);
        return next;
      });
    },
  };
});
```

- [ ] **Step 10.3: Add bindings file read to plugin**

Modify `tools/console/vite-plugin-console.ts`. Update the `listReducers` function to read each bindings file and extract reducer signatures:

```typescript
async function listReducers(): Promise<Array<{ file: string; name: string; args: Array<{ name: string; type: string }> }>> {
  try {
    const files = await fs.readdir(BINDINGS_DIR);
    const tsFiles = files.filter((file) => file.endsWith('.ts') && !file.endsWith('.d.ts'));
    const results: Array<{ file: string; name: string; args: Array<{ name: string; type: string }> }> = [];
    for (const file of tsFiles) {
      const fullPath = path.join(BINDINGS_DIR, file);
      const content = await fs.readFile(fullPath, 'utf-8');
      const reducerMatch = content.match(/export\s+(?:async\s+)?function\s+(\w+)\s*\(([^)]*)\)/g);
      if (!reducerMatch) continue;
      for (const match of reducerMatch) {
        const inner = match.match(/\(([^)]*)\)/);
        if (!inner) continue;
        const argsString = inner[1];
        const args = parseArgsString(argsString);
        const nameMatch = match.match(/function\s+(\w+)/);
        if (!nameMatch) continue;
        results.push({ file, name: nameMatch[1], args });
      }
    }
    return results;
  } catch {
    return [];
  }
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
```

Also expose `parseArgsString` for testing via `export { parseArgsString }` at the bottom of the plugin file.

- [ ] **Step 10.4: Write failing reducerList test `tools/console/tests/api-runner-reducer-list.test.ts`**

```typescript
import { describe, it, expect } from 'vitest';
import { parseReducerDefinitions } from '../src/api-runner/reducerList';

describe('parseReducerDefinitions', () => {
  it('extracts reducers from sample bindings content', () => {
    const sample = `
export function ping(ctx: ReducerContext): void {
  console.log("ping");
}

export async function update_movement(ctx: ReducerContext, x: number, y: number, z: number): void {
  // ...
}
`;
    const reducers = parseReducerDefinitions(sample, 'sample.ts');
    expect(reducers.length).toBeGreaterThanOrEqual(2);
    const ping = reducers.find((reducer) => reducer.name === 'ping');
    expect(ping).toBeDefined();
    expect(ping?.args).toEqual([]);
    const move = reducers.find((reducer) => reducer.name === 'update_movement');
    expect(move?.args).toEqual([
      { name: 'x', type: 'number' },
      { name: 'y', type: 'number' },
      { name: 'z', type: 'number' },
    ]);
  });

  it('returns empty for empty content', () => {
    const reducers = parseReducerDefinitions('', 'empty.ts');
    expect(reducers).toEqual([]);
  });
});
```

- [ ] **Step 10.5: Run test — verify failure**

Run: `cd tools/console && pnpm test api-runner-reducer-list`
Expected: FAIL.

- [ ] **Step 10.6: Implement `tools/console/src/api-runner/reducerList.ts`**

```typescript
import type { ReducerDef } from './types';

const REDUCER_REGEX = /export\s+(?:async\s+)?function\s+(\w+)\s*\(([^)]*)\)\s*:\s*[^{]+/g;

export function parseReducerDefinitions(content: string, file: string): ReducerDef[] {
  const reducers: ReducerDef[] = [];
  let match: RegExpExecArray | null;
  REDUCER_REGEX.lastIndex = 0;
  while ((match = REDUCER_REGEX.exec(content)) !== null) {
    const name = match[1];
    const argsString = match[2];
    const args = parseArgs(argsString);
    reducers.push({ name, args, file });
  }
  return reducers;
}

function parseArgs(argsString: string): Array<{ name: string; type: string }> {
  const trimmed = argsString.trim();
  if (!trimmed) return [];
  return trimmed.split(',').map((part) => {
    const cleaned = part.trim();
    const colonIndex = cleaned.indexOf(':');
    if (colonIndex === -1) return { name: cleaned, type: 'unknown' };
    return {
      name: cleaned.slice(0, colonIndex).trim(),
      type: cleaned.slice(colonIndex + 1).trim(),
    };
  });
}
```

- [ ] **Step 10.7: Run test — verify pass**

Run: `cd tools/console && pnpm test api-runner-reducer-list`
Expected: PASS.

- [ ] **Step 10.8: Create `tools/console/src/api-runner/client.ts`**

```typescript
import type { CallResult } from './types';

interface CallOptions {
  baseUrl: string;
  dbName: string;
  reducer: string;
  args: unknown[];
}

export async function callReducer(options: CallOptions): Promise<CallResult> {
  const url = `${options.baseUrl}/v1/database/${options.dbName}/call/${options.reducer}`;
  const start = performance.now();
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(options.args),
  });
  const body = await response.text();
  return {
    status: response.status,
    durationMs: Math.round(performance.now() - start),
    body,
  };
}
```

- [ ] **Step 10.9: Create `tools/console/src/api-runner/ReducerList.tsx`**

```typescript
import { useEffect, useState } from 'react';
import { Input } from '../components/ui/input';
import type { ReducerDef } from './types';
import { parseReducerDefinitions } from './reducerList';

interface ReducersResponse {
  file: string;
  path: string;
}

export function ReducerList({ onSelect }: { onSelect: (reducer: ReducerDef) => void }) {
  const [reducers, setReducers] = useState<ReducerDef[]>([]);
  const [filter, setFilter] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch('/api/console/reducers');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const items = (await response.json()) as Array<ReducersResponse & { raw?: string }>;
        // plugin returns just file+path; client fetches content separately
        const parsed: ReducerDef[] = [];
        for (const item of items) {
          const content = await fetch(item.path).then((res) => res.text()).catch(() => '');
          if (content) {
            parsed.push(...parseReducerDefinitions(content, item.file));
          }
        }
        const unique = Array.from(new Map(parsed.map((reducer) => [reducer.name, reducer])).values());
        unique.sort((a, b) => a.name.localeCompare(b.name));
        setReducers(unique);
      } catch (loadError) {
        setError((loadError as Error).message);
      }
    }
    void load();
  }, []);

  const filtered = reducers.filter((reducer) =>
    reducer.name.toLowerCase().includes(filter.toLowerCase()),
  );

  return (
    <div className="w-64 border-r border-border bg-card flex flex-col h-full">
      <div className="p-3 border-b border-border">
        <Input
          placeholder="Filter reducers…"
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
        />
      </div>
      <div className="flex-1 overflow-auto">
        {error && <p className="p-3 text-sm text-destructive">{error}</p>}
        {filtered.length === 0 && !error && (
          <p className="p-3 text-xs text-muted-foreground italic">No reducers found</p>
        )}
        {filtered.map((reducer) => (
          <button
            key={`${reducer.file}:${reducer.name}`}
            onClick={() => onSelect(reducer)}
            className="w-full text-left px-3 py-2 text-sm font-mono hover:bg-accent border-b border-border/50"
          >
            {reducer.name}
            <span className="text-xs text-muted-foreground ml-2">
              {reducer.args.length} args
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 10.10: Commit**

```bash
cd tools/console
git add -A
git commit -m "feat(console): api runner settings + reducer list parsing"
```

---

## Task 11: API Runner — form + call + response

**Files:**
- Create: `tools/console/src/api-runner/useReducerCall.ts`
- Create: `tools/console/src/api-runner/ReducerForm.tsx`
- Create: `tools/console/src/api-runner/ResponseView.tsx`
- Create: `tools/console/src/api-runner/ApiRunnerTab.tsx`
- Modify: `tools/console/src/app/App.tsx`

- [ ] **Step 11.1: Create `tools/console/src/api-runner/useReducerCall.ts`**

```typescript
import { useState, useCallback } from 'react';
import { callReducer } from './client';
import { useSettings } from './useSettings';
import type { CallResult, ReducerDef } from './types';

interface State {
  result: CallResult | null;
  pending: boolean;
  error: string | null;
}

export function useReducerCall() {
  const baseUrl = useSettings((state) => state.baseUrl);
  const dbName = useSettings((state) => state.dbName);

  const [state, setState] = useState<State>({
    result: null,
    pending: false,
    error: null,
  });

  const call = useCallback(
    async (reducer: ReducerDef, args: unknown[]) => {
      setState({ result: null, pending: true, error: null });
      try {
        const result = await callReducer({ baseUrl, dbName, reducer: reducer.name, args });
        setState({ result, pending: false, error: null });
      } catch (callError) {
        setState({ result: null, pending: false, error: (callError as Error).message });
      }
    },
    [baseUrl, dbName],
  );

  const reset = useCallback(() => {
    setState({ result: null, pending: false, error: null });
  }, []);

  return { ...state, call, reset };
}
```

- [ ] **Step 11.2: Create `tools/console/src/api-runner/ReducerForm.tsx`**

```typescript
import { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { readLocal, writeLocal } from '../lib/storage';
import type { ReducerDef } from './types';

interface Props {
  reducer: ReducerDef;
  onCall: (args: unknown[]) => void;
  pending: boolean;
}

function inferInputType(type: string): 'text' | 'number' | 'checkbox' | 'json' {
  if (type === 'number' || type === 'bigint') return 'number';
  if (type === 'boolean') return 'checkbox';
  if (type.endsWith('[]') || type.startsWith('{') || type.startsWith('Array')) return 'json';
  return 'text';
}

export function ReducerForm({ reducer, onCall, pending }: Props) {
  const storageKey = `shardwilds-console:reducer-args:${reducer.name}`;
  const [values, setValues] = useState<string[]>(() =>
    readLocal<string[]>(storageKey, reducer.args.map(() => '')),
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setValues(readLocal<string[]>(storageKey, reducer.args.map(() => '')));
  }, [reducer, storageKey]);

  function update(index: number, value: string) {
    const next = [...values];
    next[index] = value;
    setValues(next);
    writeLocal(storageKey, next);
  }

  function parseArgs(): unknown[] {
    return reducer.args.map((arg, index) => {
      const raw = values[index] ?? '';
      const inputType = inferInputType(arg.type);
      if (inputType === 'number') return Number(raw);
      if (inputType === 'checkbox') return raw === 'true';
      if (inputType === 'json') {
        if (!raw.trim()) return null;
        return JSON.parse(raw);
      }
      return raw;
    });
  }

  function handleCall() {
    setError(null);
    try {
      onCall(parseArgs());
    } catch (parseError) {
      setError((parseError as Error).message);
    }
  }

  return (
    <div className="p-6 space-y-4 max-w-2xl">
      <h2 className="text-xl font-mono font-bold">{reducer.name}</h2>
      <p className="text-xs text-muted-foreground">{reducer.file}</p>

      {reducer.args.length === 0 && (
        <p className="text-sm text-muted-foreground italic">No arguments</p>
      )}

      {reducer.args.map((arg, index) => {
        const inputType = inferInputType(arg.type);
        return (
          <div key={arg.name} className="space-y-2">
            <Label htmlFor={`${reducer.name}-${arg.name}`}>
              {arg.name} <span className="text-muted-foreground">({arg.type})</span>
            </Label>
            {inputType === 'json' ? (
              <textarea
                id={`${reducer.name}-${arg.name}`}
                value={values[index] ?? ''}
                onChange={(event) => update(index, event.target.value)}
                rows={3}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono"
                placeholder="JSON value"
              />
            ) : (
              <Input
                id={`${reducer.name}-${arg.name}`}
                type={inputType === 'number' ? 'number' : inputType === 'checkbox' ? 'checkbox' : 'text'}
                checked={inputType === 'checkbox' ? values[index] === 'true' : undefined}
                value={inputType === 'checkbox' ? undefined : values[index] ?? ''}
                onChange={(event) => {
                  const target = event.target as HTMLInputElement;
                  update(index, inputType === 'checkbox' ? String(target.checked) : target.value);
                }}
              />
            )}
          </div>
        );
      })}

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button onClick={handleCall} disabled={pending}>
        {pending ? 'Calling…' : 'Call'}
      </Button>
    </div>
  );
}
```

- [ ] **Step 11.3: Create `tools/console/src/api-runner/ResponseView.tsx`**

```typescript
import { Button } from '../components/ui/button';
import type { CallResult } from './types';

interface Props {
  result: CallResult | null;
  error: string | null;
  onClear: () => void;
}

function formatBody(body: string): string {
  try {
    return JSON.stringify(JSON.parse(body), null, 2);
  } catch {
    return body;
  }
}

export function ResponseView({ result, error, onClear }: Props) {
  if (error) {
    return (
      <div className="p-4 border-t border-border bg-destructive/10">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-destructive">Error</h3>
          <Button variant="outline" size="sm" onClick={onClear}>
            Clear
          </Button>
        </div>
        <pre className="text-xs whitespace-pre-wrap">{error}</pre>
      </div>
    );
  }
  if (!result) return null;

  const ok = result.status >= 200 && result.status < 300;

  return (
    <div className="p-4 border-t border-border bg-secondary/20">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3 text-sm">
          <span className={ok ? 'text-green-500' : 'text-destructive'}>
            {result.status} {ok ? 'OK' : 'Error'}
          </span>
          <span className="text-muted-foreground">{result.durationMs}ms</span>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              void navigator.clipboard.writeText(result.body);
            }}
          >
            Copy
          </Button>
          <Button variant="outline" size="sm" onClick={onClear}>
            Clear
          </Button>
        </div>
      </div>
      <pre className="text-xs whitespace-pre-wrap font-mono bg-background p-3 rounded">
        {formatBody(result.body)}
      </pre>
    </div>
  );
}
```

- [ ] **Step 11.4: Create `tools/console/src/api-runner/ApiRunnerTab.tsx`**

```typescript
import { useState } from 'react';
import { ReducerList } from './ReducerList';
import { ReducerForm } from './ReducerForm';
import { ResponseView } from './ResponseView';
import { useReducerCall } from './useReducerCall';
import { useSettings } from './useSettings';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import type { ReducerDef } from './types';

export function ApiRunnerTab() {
  const [selected, setSelected] = useState<ReducerDef | null>(null);
  const { result, pending, error, call, reset } = useReducerCall();
  const baseUrl = useSettings((state) => state.baseUrl);
  const dbName = useSettings((state) => state.dbName);
  const setBaseUrl = useSettings((state) => state.setBaseUrl);
  const setDbName = useSettings((state) => state.setDbName);

  return (
    <div className="flex h-full">
      <ReducerList onSelect={setSelected} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-3 border-b border-border bg-card flex gap-4">
          <div className="flex-1 space-y-1">
            <Label htmlFor="baseUrl" className="text-xs">
              Base URL
            </Label>
            <Input
              id="baseUrl"
              value={baseUrl}
              onChange={(event) => setBaseUrl(event.target.value)}
              className="h-8 text-xs"
            />
          </div>
          <div className="w-48 space-y-1">
            <Label htmlFor="dbName" className="text-xs">
              Database
            </Label>
            <Input
              id="dbName"
              value={dbName}
              onChange={(event) => setDbName(event.target.value)}
              className="h-8 text-xs"
            />
          </div>
        </div>
        <div className="flex-1 overflow-auto">
          {selected ? (
            <ReducerForm reducer={selected} onCall={(args) => void call(selected, args)} pending={pending} />
          ) : (
            <div className="p-6 text-muted-foreground italic">
              Select a reducer from the sidebar.
            </div>
          )}
        </div>
        <ResponseView result={result} error={error} onClear={reset} />
      </div>
    </div>
  );
}
```

- [ ] **Step 11.5: Wire ApiRunnerTab into App.tsx**

Modify `tools/console/src/app/App.tsx`:

```typescript
import { TabNav } from './TabNav';
import { ErrorBoundary } from './ErrorBoundary';
import { useActiveTab } from './useActiveTab';
import { KanbanTab } from '../kanban/KanbanTab';
import { ArchitectureTab } from '../architecture/ArchitectureTab';
import { ApiRunnerTab } from '../api-runner/ApiRunnerTab';

export default function App() {
  const activeTab = useActiveTab((state) => state.activeTab);

  return (
    <div className="h-full flex flex-col">
      <TabNav />
      <main className="flex-1 overflow-auto">
        <ErrorBoundary>
          {activeTab === 'kanban' && <KanbanTab />}
          {activeTab === 'architecture' && <ArchitectureTab />}
          {activeTab === 'api-runner' && <ApiRunnerTab />}
        </ErrorBoundary>
      </main>
    </div>
  );
}
```

- [ ] **Step 11.6: Verify API Runner works (requires local STDB)**

Start STDB: `cd server && spacetime start` (background, if not running)
Publish module: `cd server && spacetime publish shardwilds` (if needed)
Generate bindings: `cd client && spacetime generate --lang typescript --out-dir src/module_bindings --module-path ../server` (if needed)

Then: `cd tools/console && pnpm dev` (background)
1. Open `http://localhost:5174/`
2. Click API Runner tab
3. Sidebar lists reducers (e.g., `ping`, `identity_connected`)
4. Click `ping` — form shows no args
5. Click Call — response shows success

Stop dev server.

- [ ] **Step 11.7: Commit**

```bash
cd tools/console
git add -A
git commit -m "feat(console): api runner form + call + response view"
```

---

## Task 12: README + final cleanup

**Files:**
- Create: `tools/console/README.md`

- [ ] **Step 12.1: Create `tools/console/README.md`**

````markdown
# Shardwilds Console

Local dev console for Shardwilds. Three tabs:

- **Kanban** — read/edit `docs/stories/*.md` as a 4-column board (Todo / In Progress / Review / Done).
- **Architecture** — auto-render `docs/03-architecture-by-phase.md` as a live Mermaid diagram.
- **API Runner** — list SpacetimeDB reducers from generated bindings, call them against local STDB.

## Setup

```bash
cd tools/console
pnpm install
```

Requires Node 20+ and pnpm.

## Run

```bash
pnpm dev
```

Serves on `http://localhost:5174`. Game client uses 5173 — both can run side-by-side.

For the API Runner tab, SpacetimeDB must be running on `http://localhost:3000`:

```bash
cd server
spacetime start
spacetime publish shardwilds
```

For the reducer list to populate, generated bindings must exist:

```bash
cd client
spacetime generate --lang typescript --out-dir src/module_bindings --module-path ../server
```

## Test

```bash
pnpm test
```

Runs parser + reducer-list + builder unit tests.

## Architecture

See `docs/superpowers/specs/2026-06-25-shardwilds-console-design.md` for full design.

Layout:

```
src/
  app/         tab shell + nav
  kanban/      Kanban tab (markdown-driven)
  architecture/ Architecture tab (Mermaid from docs)
  api-runner/  API Runner tab (STDB HTTP)
  lib/         shared utilities
  styles/      tailwind globals
  components/  shadcn-generated UI
```

## Troubleshooting

**Kanban shows "No stories"** — stories missing required frontmatter (`story_id`, `title`, `status`). Old stories from earlier phases lack these fields. Update the frontmatter or delete the file.

**Architecture diagram empty** — `docs/03-architecture-by-phase.md` has no `## Phase N` sections with `### \`<TableName>\`` headings. Add them.

**API Runner sidebar empty** — generated bindings missing at `client/src/module_bindings/`. Run `spacetime generate`.

**STDB call fails with CORS error** — STDB must allow the console origin. For local dev, set `cors_allow_origin = "http://localhost:5174"` in STDB config or use a proxy.
````

- [ ] **Step 12.2: Final verification**

Run all tests:
```bash
cd tools/console && pnpm test
```
Expected: all green.

Run dev server, click through all three tabs, verify each works.

Stop dev server.

- [ ] **Step 12.3: Final commit**

```bash
cd tools/console
git add -A
git commit -m "docs(console): README with setup, run, troubleshooting"
```

- [ ] **Step 12.4: Update repo root README**

Add a section to `/Users/cookie/Developer/shardwilds/README.md` mentioning the console:

```markdown
## Dev Console

A local dev console lives in `tools/console/`. Run `cd tools/console && pnpm dev` to open `http://localhost:5174` with three tabs: Kanban (story management), Architecture (live Mermaid diagram from docs), API Runner (SpacetimeDB reducer calls).
```

Commit:
```bash
cd /Users/cookie/Developer/shardwilds
git add README.md
git commit -m "docs: link to shardwilds-console in root README"
```

---

## Self-Review

**Spec coverage check:**

- Section 1 (file layout): Task 1 + Task 2 + Task 4 create all files. ✓
- Section 2 (Kanban): Tasks 5, 6, 7. ✓
- Section 3 (Architecture): Tasks 8, 9. ✓
- Section 4 (API Runner): Tasks 10, 11. ✓
- Section 5 (data flow / SSE / endpoints): Task 4 plugin + Tasks 9 SSE hook. ✓
- Section 6 (error handling): ErrorBoundary in Task 3, toast-like inline errors per tab. ✓
- Section 7 (testing): vitest tests in Tasks 5, 8, 10. ✓

**Placeholder scan:** No TBDs. All code blocks complete. All commands have expected output.

**Type consistency:**

- `Story` type used identically in `types.ts`, `markdown.ts`, `useStories.ts`, `Board.tsx`, `Card.tsx`, `CardExpanded.tsx`. ✓
- `ReducerDef` used identically in `types.ts`, `reducerList.ts`, `ReducerList.tsx`, `ReducerForm.tsx`, `useReducerCall.ts`. ✓
- `GraphModel` used identically in `types.ts`, `parser.ts`, `builder.ts`. ✓
- `useSettings` shape consistent in `useSettings.ts` and `ApiRunnerTab.tsx`. ✓

**Build/run command verification:** All `pnpm dev` commands assume console was started from `tools/console/` directory. STDB commands match project CLAUDE.md.

**No outstanding gaps.**