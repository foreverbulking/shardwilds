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
            <ReducerForm
              reducer={selected}
              onCall={(args) => void call(selected, args)}
              pending={pending}
            />
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