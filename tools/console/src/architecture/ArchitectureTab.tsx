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