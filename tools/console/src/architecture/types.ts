export interface GraphNode {
  id: string;
  label: string;
  shape: 'rect' | 'cyl' | 'hex' | 'asym';
  subgraph?: string;
}

export interface GraphEdge {
  from: string;
  to: string;
  label: string;
}

export interface GraphModel {
  nodes: GraphNode[];
  edges: GraphEdge[];
}