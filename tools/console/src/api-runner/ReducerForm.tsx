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
                type={
                  inputType === 'number' ? 'number' : inputType === 'checkbox' ? 'checkbox' : 'text'
                }
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