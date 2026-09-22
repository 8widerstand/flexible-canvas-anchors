export interface CanvasEdgeDataRuntime {
  getData(): unknown;
  setData(edgeData: Record<string, unknown>): void;
}
