import {describe, expect, it} from "vitest";
import { createEdgeDataWithAnchorMetadata } from "./createEdgeDataWithAnchorMetadata";

describe("createEdgeDataWithAnchorMetadata", () => {
  it('adds target anchor metadata without losing native edge data', () => {
    const edgeData = {
      id: "edge-1",
      fromNode: "source-node",
      fromSide: "right",
      toNode: "target-node",
      toSide: "bottom",
    };

    const updatedEdgeData = createEdgeDataWithAnchorMetadata(
      edgeData,
      "to",
      0.8
    );

    expect(updatedEdgeData).toEqual({
      id: "edge-1",
      fromNode: "source-node",
      fromSide: "right",
      toNode: "target-node",
      toSide: "bottom",
      flexibleCanvasAnchors: {
        version: 1,
        to: {
          ratio: 0.8,
        }
      },
    });

  });

  it("preserves the source anchor when adding a target anchor", () => {
    const edgeData = {
      id: "edge-1",
      flexibleCanvasAnchors: {
        version: 1,
        from: {
          ratio: 0.2,
        },
      },
    };

    const updatedEdgeData = createEdgeDataWithAnchorMetadata(
      edgeData,
      "to",
      0.8,
    );

    expect(updatedEdgeData).toEqual({
      id: "edge-1",
      flexibleCanvasAnchors: {
        version: 1,
        from: {
          ratio: 0.2,
        },
        to: {
          ratio: 0.8,
        },
      },
    });
  });
})
