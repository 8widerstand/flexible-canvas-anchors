interface EdgePathUpdater {
  updatePath(): void;
}

export function installEdgeUpdatePathHook(edge: EdgePathUpdater, afterNativeUpdate: () => void,): () => void {
  const nativeUpdatePath = edge.updatePath.bind(edge);

  const hookedUpdatePath = (): void => {
    nativeUpdatePath();
    afterNativeUpdate();
  };

  edge.updatePath = hookedUpdatePath;
  hookedUpdatePath();

  return (): void => {
    if (edge.updatePath !== hookedUpdatePath) {
      return;
    }

    edge.updatePath = nativeUpdatePath;
    nativeUpdatePath();
  };
}
