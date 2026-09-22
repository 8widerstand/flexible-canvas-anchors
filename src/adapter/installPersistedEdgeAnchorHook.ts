import { extractPersistedNodeAnchors } from "./extractPersistedNodeAnchors";
import { installEdgeUpdatePathHook } from "./installEdgeUpdatePathHook";
import { isCanvasEdgeRuntime } from "./isCanvasEdgeRuntime";
import { renderEdgeWithAnchors } from "./renderEdgeWithAnchor";

export function installPersistedEdgeAnchorHook(
  edge: unknown,
): (() => void) | null {
  if (!isCanvasEdgeRuntime(edge)) {
    return null;
  }

  const anchors = extractPersistedNodeAnchors(
    edge.getData(),
  );

  if (anchors.length === 0) {
    return null;
  }

  let isRendered = false;

  const cleanup = installEdgeUpdatePathHook(
    edge,
    () => {
      isRendered = renderEdgeWithAnchors(
        edge,
        anchors,
      );
    },
  );

  if (!isRendered) {
    cleanup();
    return null;
  }

  return cleanup;
}
