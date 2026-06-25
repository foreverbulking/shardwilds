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