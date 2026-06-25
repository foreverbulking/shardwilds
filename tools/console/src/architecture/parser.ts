import type { GraphModel, GraphNode, GraphEdge } from './types';

const SERVER_ID = 'server';

export function parseArchitectureDoc(doc: string): GraphModel {
  const model: GraphModel = { nodes: [], edges: [] };
  if (!doc.trim()) return model;

  ensureNode(model, { id: 'client', label: 'Client', shape: 'rect' });
  ensureNode(model, { id: SERVER_ID, label: 'SpacetimeDB', shape: 'cyl' });
  model.edges.push({ from: 'client', to: SERVER_ID, label: 'websocket' });

  const phaseSections = extractPhaseSections(doc);
  for (const phase of phaseSections) {
    const tables = extractCodeBlockItems(phase.body, /Tables:/i);
    const reducers = extractCodeBlockItems(phase.body, /Reducers:/i);
    const subscriptions = extractCodeBlockItems(phase.body, /Subscriptions:/i);

    for (const table of tables) {
      ensureNode(model, {
        id: table,
        label: table,
        shape: 'cyl',
        subgraph: phase.title,
      });
      model.edges.push({ from: SERVER_ID, to: table, label: 'read' });
    }
    for (const reducer of reducers) {
      const name = reducer.replace(/\(.*\)/, '').trim();
      ensureNode(model, {
        id: name,
        label: reducer,
        shape: 'hex',
        subgraph: phase.title,
      });
      const targetTable = tables[0] ?? SERVER_ID;
      model.edges.push({ from: name, to: targetTable, label: 'write' });
    }
    for (const sub of subscriptions) {
      ensureNode(model, {
        id: `sub:${sub}`,
        label: sub,
        shape: 'asym',
        subgraph: phase.title,
      });
      model.edges.push({ from: SERVER_ID, to: 'client', label: `subscribe: ${sub}` });
    }
  }

  return model;
}

function ensureNode(model: GraphModel, node: GraphNode): void {
  if (!model.nodes.some((existing) => existing.id === node.id)) {
    model.nodes.push(node);
  }
}

interface PhaseSection {
  title: string;
  body: string;
}

function extractPhaseSections(doc: string): PhaseSection[] {
  const sections: PhaseSection[] = [];
  const lines = doc.split('\n');
  let current: PhaseSection | null = null;
  for (const line of lines) {
    const match = line.match(/^##\s+(.+)$/);
    if (match) {
      if (current) sections.push(current);
      current = { title: match[1].trim(), body: '' };
    } else if (current) {
      current.body += line + '\n';
    }
  }
  if (current) sections.push(current);
  return sections;
}

function extractCodeBlockItems(text: string, sectionHeading: RegExp): string[] {
  const headingMatch = text.match(sectionHeading);
  if (!headingMatch || headingMatch.index === undefined) return [];
  const after = text.slice(headingMatch.index + headingMatch[0].length);
  const codeBlockMatch = after.match(/```[a-z]*\n([\s\S]*?)```/);
  if (!codeBlockMatch) return [];
  return codeBlockMatch[1]
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}