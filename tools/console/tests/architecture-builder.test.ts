import { describe, it, expect } from 'vitest';
import { buildMermaid } from '../src/architecture/builder';

describe('buildMermaid', () => {
  it('produces graph TD header and node lines', () => {
    const syntax = buildMermaid({
      nodes: [
        { id: 'client', label: 'Client', shape: 'rect' },
        { id: 'Player', label: 'Player', shape: 'cyl', subgraph: 'Phase 1' },
      ],
      edges: [{ from: 'client', to: 'server', label: 'ws' }],
    });
    expect(syntax).toContain('graph TD');
    expect(syntax).toContain('client[Client]');
    expect(syntax).toContain('Player[(Player)]');
    expect(syntax).toContain('subgraph Phase 1');
  });

  it('handles empty model', () => {
    const syntax = buildMermaid({ nodes: [], edges: [] });
    expect(syntax.trim()).toBe('graph TD');
  });
});