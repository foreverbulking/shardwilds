import { describe, it, expect } from 'vitest';
import { parseReducerDefinitions } from '../src/api-runner/reducers';

describe('parseReducerDefinitions', () => {
  it('extracts reducers from sample bindings content', () => {
    const sample = `
export function ping(_ctx: ReducerContext): void {
  console.log("ping");
}

export async function update_movement(ctx: ReducerContext, x: number, y: number, z: number): Promise<void> {
  // ...
}
`;
    const reducers = parseReducerDefinitions(sample, 'sample.ts');
    expect(reducers.length).toBeGreaterThanOrEqual(2);
    const ping = reducers.find((reducer) => reducer.name === 'ping');
    expect(ping).toBeDefined();
    expect(ping?.args).toEqual([]);
    const move = reducers.find((reducer) => reducer.name === 'update_movement');
    expect(move?.args).toEqual([
      { name: 'x', type: 'number' },
      { name: 'y', type: 'number' },
      { name: 'z', type: 'number' },
    ]);
  });

  it('returns empty for empty content', () => {
    const reducers = parseReducerDefinitions('', 'empty.ts');
    expect(reducers).toEqual([]);
  });
});