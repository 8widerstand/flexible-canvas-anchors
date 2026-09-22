import type { AnchorSide } from "../geometry/types";
import type { NodeAnchor } from "../model/nodeAnchor";
import { extractEdgeAnchorMetadata } from "./extractEdgeAnchorMetadata";
import type { PersistedEdgeAnchor } from "../interface/persistedEdgeAnchor";

export function extractPersistedNodeAnchors(edgeData: unknown): NodeAnchor[] {
  if (!isRecord(edgeData)) {
    return [];
  }
  const metadata = extractEdgeAnchorMetadata(edgeData);

  if (metadata === null) {
    return [];
  }

  const anchors: NodeAnchor[] = [];

  const fromAnchor = createNodeAnchor(
    edgeData.fromNode,
    edgeData.fromSide,
    metadata.from,
  );

  if (fromAnchor !== null) {
    anchors.push(fromAnchor);
  }

  const toAnchor = createNodeAnchor(
    edgeData.toNode,
    edgeData.toSide,
    metadata.to,
  );

  if (toAnchor !== null) {
    anchors.push(toAnchor);
  }

  return anchors;
}

function createNodeAnchor(nodeId: unknown, side: unknown, persistedAnchor: PersistedEdgeAnchor | undefined,): NodeAnchor | null {
  if (persistedAnchor === undefined || typeof nodeId !== "string" || !isAnchorSide(side)) {
    return null;
  }

  return {
    nodeId,
    position: {
      side,
      ratio: persistedAnchor.ratio,
    },
  };
}

function isAnchorSide(value: unknown): value is AnchorSide {
  return value === "top" ||
    value === "right" ||
    value === "bottom" ||
    value === "left";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" &&
    value !== null &&
    !Array.isArray(value);
}
