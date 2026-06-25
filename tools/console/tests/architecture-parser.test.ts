import { describe, it, expect } from 'vitest';
import { parseArchitectureDoc } from '../src/architecture/parser';

describe('parseArchitectureDoc', () => {
  it('extracts Phase 1 tables and reducers', () => {
    const doc = `# Architecture by Phase

## Phase 1: Hearthvale Online

Tables:

\`\`\`txt
Player
Character
Position
\`\`\`

Reducers:

\`\`\`txt
create_character(name)
spawn_character()
\`\`\`

Subscriptions:

\`\`\`txt
characters in zone
\`\`\`
`;

    const model = parseArchitectureDoc(doc);
    const tableIds = model.nodes
      .filter((node) => node.shape === 'cyl' && node.id !== 'server')
      .map((node) => node.id);
    expect(tableIds).toContain('Player');
    expect(tableIds).toContain('Character');
    expect(tableIds).toContain('Position');

    const reducerIds = model.nodes.filter((node) => node.shape === 'hex').map((node) => node.id);
    expect(reducerIds).toContain('create_character');
    expect(reducerIds).toContain('spawn_character');

    const subgraphNodes = model.nodes.filter((node) => node.subgraph === 'Phase 1: Hearthvale Online');
    expect(subgraphNodes.length).toBeGreaterThan(0);
  });

  it('returns empty model on empty doc', () => {
    const model = parseArchitectureDoc('');
    expect(model.nodes).toEqual([]);
    expect(model.edges).toEqual([]);
  });
});