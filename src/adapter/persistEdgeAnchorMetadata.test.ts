import { describe, expect, it } from "vitest";
import { persistEdgeAnchorMetadata } from "./persistEdgeAnchorMetadata";

describe("persistEdgeAnchorMetadata", () => {
  it("writes target metadata and requests a Canvas save", () => {
    let writtenEdgeData: unknown = null;
    let isSaveRequested = false;

    const edge = {
      getData: () => ({
        id: "edge-1",
        fromNode: "source-node",
        toNode: "target-node",
      }),
      setData: (edgeData: unknown) => {
        writtenEdgeData = edgeData;
      },
    };

    const canvas = {
      requestSave: () => {
        isSaveRequested = true;
      },
    };

    const isPersisted = persistEdgeAnchorMetadata(
      canvas,
      edge,
      "to",
      0.8,
    );

    expect({
      isPersisted,
      writtenEdgeData,
      isSaveRequested,
    }).toEqual({
      isPersisted: true,
      writtenEdgeData: {
        id: "edge-1",
        fromNode: "source-node",
        toNode: "target-node",
        flexibleCanvasAnchors: {
          version: 1,
          to: {
            ratio: 0.8,
          },
        },
      },
      isSaveRequested: true,
    });
  });
});
