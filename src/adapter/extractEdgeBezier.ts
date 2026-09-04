import type {CubicBezier, Point,} from "../geometry/types";

export function extractEdgeBezier(edge: unknown,): CubicBezier | null {
  if (typeof edge !== "object" || edge === null || Array.isArray(edge)) {
    return null;
  }

  const edgeProperties = edge as Record<string, unknown>;
  const runtimeBezier = edgeProperties.bezier;

  if (typeof runtimeBezier !== "object" || runtimeBezier === null || Array.isArray(runtimeBezier)) {
    return null;
  }

  const bezierProperties = runtimeBezier as Record<string, unknown>;

  const from = extractPoint(bezierProperties.from);
  const fromControlPoint = extractPoint(bezierProperties.cp1);
  const toControlPoint = extractPoint(bezierProperties.cp2);
  const to = extractPoint(bezierProperties.to);

  if (from === null || fromControlPoint === null || toControlPoint === null || to === null) {
    return null;
  }

  return {
    from,
    fromControlPoint,
    toControlPoint,
    to,
  };
}

function extractPoint(value: unknown): Point | null {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return null;
  }

  const pointProperties = value as Record<string, unknown>;
  const x = pointProperties.x;
  const y = pointProperties.y;

  if (typeof x !== "number" || typeof y !== "number" || !Number.isFinite(x) || !Number.isFinite(y)) {
    return null;
  }

  return { x, y };
}
