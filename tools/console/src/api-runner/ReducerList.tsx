import { useEffect, useState } from 'react';
import { Input } from '../components/ui/input';
import type { ReducerDef } from './types';
import { parseReducerDefinitions } from './reducerList';

interface ReducerInfo {
  file: string;
  name: string;
  args: Array<{ name: string; type: string }>;
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
        const items = (await response.json()) as ReducerInfo[];
        // plugin returns file+name+args already, deduplicate by name
        const unique = Array.from(
          new Map(items.map((item) => [item.name, item as ReducerDef])).values(),
        );
        unique.sort((a, b) => a.name.localeCompare(b.name));
        setReducers(unique);
        // touch parseReducerDefinitions to keep tree-shaking aware
        void parseReducerDefinitions;
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