import { describe, expect, it } from "vitest";
import {extractEdgeAnchorMetadata} from "./extractEdgeAnchorMetadata";

describe("extractEdgeAnchorMetadata", () => {
  it("returns valid anchor metadata from persisted edge data", () => {
    const edgeData = {
      flexibleCanvasAnchors: {
        version: 1,
        to: {
          ratio: 0.8,
        },
      },
    };

    const metadata = extractEdgeAnchorMetadata(edgeData);

    expect(metadata).toEqual({
      version: 1,
      to: {
        ratio: 0.8,
      },
    });

  });

  it("returns valid source anchor metadata from persisted edge data", () => {
    const edgeData = {
      flexibleCanvasAnchors: {
        version: 1,
        from: {
          ratio: 0.2,
        },
      },
    };

    const metadata = extractEdgeAnchorMetadata(edgeData);

    expect(metadata).toEqual({
      version: 1,
      from: {
        ratio: 0.2,
      },
    });
  });

  it("rejects an anchor ratio greater than one", () => {
    const edgeData = {
      flexibleCanvasAnchors: {
        version: 1,
        to: {
          ratio: 1.2,
        },
      },
    };

    const metadata = extractEdgeAnchorMetadata(edgeData);

    expect(metadata).toBeNull();
  });

  it("rejects an anchor ratio less than zero", () => {
    const edgeData = {
      flexibleCanvasAnchors: {
        version: 1,
        from: {
          ratio: -0.1,
        },
      },
    };

    const metadata = extractEdgeAnchorMetadata(edgeData);

    expect(metadata).toBeNull();
  });

  it("rejects a non-finite anchor ratio", () => {
    const edgeData = {
      flexibleCanvasAnchors: {
        version: 1,
        to: {
          ratio: Number.NaN,
        },
      },
    };

    const metadata = extractEdgeAnchorMetadata(edgeData);

    expect(metadata).toBeNull();
  });
});
