import type { GraphModel, GraphNode } from './types';

export function buildMermaid(model: GraphModel): string {
  const lines: string[] = ['graph TD'];

  const subgraphed = new Map<string, GraphNode[]>();
  const topLevel: GraphNode[] = [];

  for (const node of model.nodes) {
    if (node.subgraph) {
      const group = subgraphed.get(node.subgraph) ?? [];
      group.push(node);
      subgraphed.set(node.subgraph, group);
    } else {
      topLevel.push(node);
    }
  }

  for (const node of topLevel) {
    lines.push(`    ${renderNode(node)}`);
  }

  for (const [subgraphName, nodes] of subgraphed) {
    lines.push(`    subgraph ${subgraphName}`);
    for (const node of nodes) {
      lines.push(`        ${renderNode(node)}`);
    }
    lines.push('    end');
  }

  for (const edge of model.edges) {
    const safeLabel = edge.label.replace(/"/g, '\\"');
    lines.push(`    ${edge.from} -->|${safeLabel}| ${edge.to}`);
  }

  return lines.join('\n');
}

function renderNode(node: GraphNode): string {
  switch (node.shape) {
    case 'cyl':
      return `${node.id}[(${node.label})]`;
    case 'hex':
      return `${node.id}{{${node.label}}}`;
    case 'asym':
      return `${node.id}>${node.label}]`;
    case 'rect':
    default:
      return `${node.id}[${node.label}]`;
  }
}