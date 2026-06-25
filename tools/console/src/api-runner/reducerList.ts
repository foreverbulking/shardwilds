import type { ReducerDef } from './types';

const REDUCER_REGEX = /export\s+(?:async\s+)?function\s+(\w+)\s*\(([^)]*)\)\s*:\s*[^{]+/g;

export function parseReducerDefinitions(content: string, file: string): ReducerDef[] {
  const reducers: ReducerDef[] = [];
  let match: RegExpExecArray | null;
  REDUCER_REGEX.lastIndex = 0;
  while ((match = REDUCER_REGEX.exec(content)) !== null) {
    const name = match[1];
    const argsString = match[2];
    const args = parseArgs(argsString).filter(
      (arg) => !(arg.type === 'ReducerContext' || arg.type.endsWith('Context')),
    );
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