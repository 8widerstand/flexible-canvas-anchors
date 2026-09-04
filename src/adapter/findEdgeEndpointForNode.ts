import type { BezierEndpoint } from "../geometry/types";

export function findEdgeEndpointForNode(edge: unknown, nodeId: string,): BezierEndpoint | null {
  if (typeof edge !== "object" || edge === null || Array.isArray(edge)) {
    return null;
  }

  const edgeProperties = edge as Record<string, unknown>;

  const toNodeId = extractEndpointNodeId(edgeProperties.to);

  if (toNodeId === nodeId) {
    return "to";
  }

  const fromNodeId = extractEndpointNodeId(
    edgeProperties.from,
  );

  if (fromNodeId === nodeId) {
    return "from";
  }

  return null;
}

function extractEndpointNodeId(endpoint: unknown,): string | null {
  if (typeof endpoint !== "object" || endpoint === null || Array.isArray(endpoint)) {
    return null;
  }

  const endpointProperties =
    endpoint as Record<string, unknown>;

  const node = endpointProperties.node;

  if (typeof node !== "object" || node === null || Array.isArray(node)) {
    return null;
  }

  const nodeProperties = node as Record<string, unknown>;
  const nodeId = nodeProperties.id;

  if (typeof nodeId !== "string") {
    return null;
  }

  return nodeId;
}
