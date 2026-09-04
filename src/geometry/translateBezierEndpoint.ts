import type {BezierEndpoint, CubicBezier, Point} from "./types";

export function translateBezierEndpoint(
  bezier: CubicBezier,
  endpoint: BezierEndpoint,
  offset: Point,
): CubicBezier {
  if (endpoint === "from") {
    return {
      ...bezier,
      from: translatePoint(bezier.from, offset),
      fromControlPoint: translatePoint(
        bezier.fromControlPoint,
        offset,
      ),
    };
  }

  return {
    ...bezier,
    toControlPoint: translatePoint(
      bezier.toControlPoint,
      offset,
    ),
    to: translatePoint(bezier.to, offset),
  };
}

function translatePoint(point: Point, offset: Point): Point {
  return {
    x: point.x + offset.x,
    y: point.y + offset.y,
  };
}
