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