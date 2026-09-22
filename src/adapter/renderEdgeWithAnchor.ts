import { calculateAnchorOffset } from "../geometry/calculateAnchorOffset";
import { calculateAnchorPoint } from "../geometry/calculateAnchorPoint";
import { createCubicBezierPath } from "../geometry/createCubicBezierPath";
import { translateBezierEndpoint } from "../geometry/translateBezierEndpoint";
import type {AnchorPosition, AnchorSide, BezierEndpoint, CubicBezier, NodeBounds, Point,} from "../geometry/types";
import type {CanvasEdgeLineEndRuntime, CanvasEdgeRuntime,} from "../interface/canvasEdgeRuntime";
import type { NodeAnchor } from "../model/nodeAnchor";
import { createTranslatedLineEndTransform } from "./createTranslatedLineEndTransform";
import { extractEdgeBezier } from "./extractEdgeBezier";
import { extractNodeBounds } from "./extractNodeBounds";
import { findEdgeEndpointForNode } from "./findEdgeEndpointForNode";
import { isCanvasEdgeRuntime } from "./isCanvasEdgeRuntime";

export function renderEdgeWithAnchor(edge: unknown, anchor: NodeAnchor,): boolean {
  return renderEdgeWithAnchors(edge, [anchor]);
}

export function renderEdgeWithAnchors(edge: unknown, anchors: readonly NodeAnchor[],): boolean {
  if (!isCanvasEdgeRuntime(edge)) {
    return false;
  }

  const anchorsByEndpoint = resolveAnchorsByEndpoint(edge, anchors);

  if (anchorsByEndpoint === null) {
    return false;
  }

  return renderResolvedAnchors(edge, anchorsByEndpoint);
}

function resolveAnchorsByEndpoint(edge: CanvasEdgeRuntime, anchors: readonly NodeAnchor[],): Map<BezierEndpoint, NodeAnchor> | null {
  const anchorsByEndpoint = new Map<BezierEndpoint, NodeAnchor>();

  for (const anchor of anchors) {
    const endpoint = findEdgeEndpointForNode(edge, anchor.nodeId,);

    if (endpoint === null || anchorsByEndpoint.has(endpoint)) {return null;}

    const runtimeEndpoint = endpoint === "from" ? edge.from : edge.to;

    if (runtimeEndpoint.side !== anchor.position.side) return null;

    anchorsByEndpoint.set(endpoint, anchor);
  }

  return anchorsByEndpoint.size === 0 ? null : anchorsByEndpoint;
}

function renderResolvedAnchors(edge: CanvasEdgeRuntime, anchorsByEndpoint: ReadonlyMap<BezierEndpoint, NodeAnchor>,): boolean {
  const fromBounds = extractNodeBounds(edge.from.node);
  const toBounds = extractNodeBounds(edge.to.node);
  const bezier = extractEdgeBezier(edge);

  if (fromBounds === null || toBounds === null || bezier === null) {
    return false;
  }

  const fromAnchor = anchorsByEndpoint.get("from") ?? null;
  const toAnchor = anchorsByEndpoint.get("to") ?? null;

  const translatedFromBezier = translateAnchoredEndpoint(bezier, "from", fromBounds, fromAnchor,);

  const translatedBezier = translateAnchoredEndpoint(translatedFromBezier, "to", toBounds, toAnchor,);

  const fromPosition = fromAnchor?.position ?? createCenteredPosition(edge.from.side);

  const toPosition = toAnchor?.position ?? createCenteredPosition(edge.to.side);

  const fromBoundary = calculateAnchorPoint(fromBounds, fromPosition,);

  const toBoundary = calculateAnchorPoint(toBounds, toPosition,);

  const pathData = createEdgePath(edge, translatedBezier, fromBoundary, toBoundary,);

  edge.path.interaction.setAttribute("d", pathData);
  edge.path.display.setAttribute("d", pathData);

  updateLineEnd(edge.fromLineEnd, fromAnchor, fromBoundary,);

  updateLineEnd(edge.toLineEnd, toAnchor, toBoundary,);

  return true;
}

function translateAnchoredEndpoint(bezier: CubicBezier, endpoint: BezierEndpoint, bounds: NodeBounds, anchor: NodeAnchor | null): CubicBezier {
  if (anchor === null) {
    return bezier;
  }

  const centeredPosition = createCenteredPosition(anchor.position.side);

  const offset = calculateAnchorOffset(bounds, centeredPosition, anchor.position,);

  return translateBezierEndpoint(bezier, endpoint, offset,);
}

function createCenteredPosition(side: AnchorSide,): AnchorPosition {
  return {
    side,
    ratio: 0.5,
  };
}

function updateLineEnd(lineEnd: CanvasEdgeLineEndRuntime | null, anchor: NodeAnchor | null, boundary: Point,): void {
  if (lineEnd === null || anchor === null) {
    return;
  }

  lineEnd.el.style.transform = createTranslatedLineEndTransform(lineEnd.el.style.transform, boundary);
}

function createEdgePath(edge: CanvasEdgeRuntime, bezier: CubicBezier, fromBoundary: Point, toBoundary: Point,): string {
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
