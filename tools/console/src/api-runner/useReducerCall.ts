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