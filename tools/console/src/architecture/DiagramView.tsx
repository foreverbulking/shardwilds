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