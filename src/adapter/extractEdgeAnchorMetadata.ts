import type { PersistedEdgeAnchor } from "../interface/persistedEdgeAnchor";
import {EdgeAnchorMetadata} from "../interface/edgeAnchorMetadata";

export function extractEdgeAnchorMetadata(edgeData: unknown): EdgeAnchorMetadata | null {
  if (!isRecord(edgeData)) return null;

  const metadata = edgeData.flexibleCanvasAnchors;

  if (!isRecord(metadata) || metadata.version !== 1) return null;

  const fromAnchor = extractPersistedEdgeAnchor(metadata.from);
  const toAnchor = extractPersistedEdgeAnchor(metadata.to);

  if (fromAnchor === null && toAnchor === null) {
    return null;
  }

  return {
    version: 1,
    ...(fromAnchor === null ? {} : { from: fromAnchor }),
    ...(toAnchor === null ? {} : { to: toAnchor }),
  };
}

function extractPersistedEdgeAnchor(value: unknown,): PersistedEdgeAnchor | null {
  if (!isRecord(value)) return null;

  const ratio = value.ratio;

  if (typeof ratio !== "number" || !Number.isFinite(ratio) || ratio > 1 || ratio < 0) return null;

  return { ratio };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" &&
    value !== null &&
    !Array.isArray(value);
}
