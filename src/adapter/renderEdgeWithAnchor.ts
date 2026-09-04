import { calculateAnchorOffset } from "../geometry/calculateAnchorOffset";
import { calculateAnchorPoint } from "../geometry/calculateAnchorPoint";
import { createCubicBezierPath } from "../geometry/createCubicBezierPath";
import { translateBezierEndpoint } from "../geometry/translateBezierEndpoint";
import type {AnchorPosition, CubicBezier, Point }from "../geometry/types";
import type { CanvasEdgeRuntime } from "../interface/canvasEdgeRuntime";
import type { NodeAnchor } from "../model/nodeAnchor";
import { extractEdgeBezier } from "./extractEdgeBezier";
import { extractNodeBounds } from "./extractNodeBounds";
import { findEdgeEndpointForNode } from "./findEdgeEndpointForNode";
import { isCanvasEdgeRuntime } from "./isCanvasEdgeRuntime";
import { createTranslatedLineEndTransform } from "./createTranslatedLineEndTransform";

export function renderEdgeWithAnchor(edge: unknown, anchor: NodeAnchor): boolean {
  if (!isCanvasEdgeRuntime(edge)) {
    return false;
  }

  const endpoint = findEdgeEndpointForNode(edge, anchor.nodeId,);

  if (endpoint === null) {
    return false;
  }

  const runtimeEndpoint = endpoint === "from" ? edge.from : edge.to;

  if (runtimeEndpoint.side !== anchor.position.side) {
    return false;
  }

  const endpointBounds = extractNodeBounds(
    runtimeEndpoint.node,
  );

  const fromBounds = extractNodeBounds(edge.from.node);
  const toBounds = extractNodeBounds(edge.to.node);
  const bezier = extractEdgeBezier(edge);

  if (endpointBounds === null || fromBounds === null || toBounds === null || bezier === null) {
    return false;
  }

  const currentAnchor: AnchorPosition = {
    side: runtimeEndpoint.side,
    ratio: 0.5,
  };

  const offset = calculateAnchorOffset(endpointBounds, currentAnchor, anchor.position,);

  const translatedBezier = translateBezierEndpoint(bezier, endpoint, offset,);

  const fromAnchor: AnchorPosition = endpoint === "from"
      ? anchor.position
      : {
        side: edge.from.side,
        ratio: 0.5,
      };

  const toAnchor: AnchorPosition =
    endpoint === "to"
      ? anchor.position
      : {
        side: edge.to.side,
        ratio: 0.5,
      };

  const fromBoundary = calculateAnchorPoint(fromBounds, fromAnchor,);

  const toBoundary = calculateAnchorPoint(toBounds, toAnchor,);

  const pathData = createEdgePath(edge, translatedBezier, fromBoundary, toBoundary);

  edge.path.interaction.setAttribute("d", pathData);
  edge.path.display.setAttribute("d", pathData);

  const lineEnd = endpoint === "from" ? edge.fromLineEnd : edge.toLineEnd;

  const selectedBoundary = endpoint === "from" ? fromBoundary : toBoundary;

  if (lineEnd !== null) {
    lineEnd.el.style.transform = createTranslatedLineEndTransform(lineEnd.el.style.transform, selectedBoundary);
  }

  return true;
}

function createEdgePath(edge: CanvasEdgeRuntime, bezier: CubicBezier, fromBoundary: Point, toBoundary: Point): string {
  const pathParts: string[] = [];

  if (edge.fromLineEnd === null) {
    pathParts.push(createStraightPath(fromBoundary, bezier.from),);
  }

  pathParts.push(createCubicBezierPath(bezier));

  if (edge.toLineEnd === null) {
    pathParts.push(createStraightPath(bezier.to, toBoundary),);
  }

  return pathParts.join(" ");
}

function createStraightPath(from: Point, to: Point,): string {
  return `M ${from.x} ${from.y} L ${to.x} ${to.y}`;
}
