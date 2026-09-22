import {BezierEndpoint} from "../geometry/types";
import { extractEdgeAnchorMetadata } from "./extractEdgeAnchorMetadata";

export function createEdgeDataWithAnchorMetadata(
  edgeData: unknown, endpoint: BezierEndpoint, ratio: number) : Record<string, unknown> | null {
    if (!isRecord(edgeData)) return null;

  const existingMetadata = extractEdgeAnchorMetadata(edgeData);

    return {
      ...edgeData,
      flexibleCanvasAnchors: {
        ...(existingMetadata ?? {}),
        version: 1,
        [endpoint]: {
          ratio,
        },
      },
    }
}


function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" &&
    value !== null &&
    !Array.isArray(value);
}
