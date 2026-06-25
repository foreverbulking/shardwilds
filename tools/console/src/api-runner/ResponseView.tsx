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