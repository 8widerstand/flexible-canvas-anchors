import type {CanvasEdgeEndpointRuntime, CanvasEdgeRuntime,} from "../interface/canvasEdgeRuntime";
import type { AnchorSide } from "../geometry/types";

export function isCanvasEdgeRuntime(value: unknown,): value is CanvasEdgeRuntime {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id === "string" &&
    isEdgeEndpoint(value.from) &&
    isEdgeEndpoint(value.to) &&
    isEdgePath(value.path) &&
    "bezier" in value &&
    isLineEnd(value.fromLineEnd) &&
    isLineEnd(value.toLineEnd) &&
    typeof value.updatePath === "function"
  );
}

function isEdgeEndpoint(value: unknown): value is CanvasEdgeEndpointRuntime {
  return (isRecord(value) && "node" in value && isAnchorSide(value.side));
}

function isEdgePath(value: unknown): boolean {
  if (!isRecord(value)) {
    return false;
  }

  return (
    hasSetAttribute(value.interaction) &&
    hasSetAttribute(value.display)
  );
}

function hasSetAttribute(value: unknown): boolean {
  return (isRecord(value) && typeof value.setAttribute === "function");
}

function isLineEnd(value: unknown): boolean {
  if (value === null) {
    return true;
  }

  if (!isRecord(value)) {
    return false;
  }

  const element = value.el;

  if (!isRecord(element)) {
    return false;
  }

  const style = element.style;

  return (isRecord(style) && typeof style.transform === "string"
  );
}

function isAnchorSide(value: unknown,): value is AnchorSide {
  return (value === "top" || value === "right" || value === "bottom" || value === "left");
}

function isRecord(value: unknown) : value is Record<string, unknown> {
  return (typeof value === "object" && value !== null && !Array.isArray(value));
}
