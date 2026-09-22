import {CanvasPersistenceRuntime} from "../interface/canvasPersistenceRuntime";
import {CanvasEdgeDataRuntime} from "../interface/canvasEdgeDataRuntime";
import {BezierEndpoint} from "../geometry/types";
import {createEdgeDataWithAnchorMetadata} from "./createEdgeDataWithAnchorMetadata";


export function persistEdgeAnchorMetadata(
  canvas: CanvasPersistenceRuntime,
  edge: CanvasEdgeDataRuntime,
  endpoint: BezierEndpoint,
  ratio: number,
) : boolean {
  const updatedEdgeData = createEdgeDataWithAnchorMetadata(
    edge.getData(),
    endpoint,
    ratio
  )
  if (updatedEdgeData === null) return false;

  edge.setData(updatedEdgeData);
  canvas.requestSave();
  return true;
}
