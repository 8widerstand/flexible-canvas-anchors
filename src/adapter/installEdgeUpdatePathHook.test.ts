import { describe, expect, it } from "vitest";
import { installEdgeUpdatePathHook } from "./installEdgeUpdatePathHook";

describe("installEdgeUpdatePathHook", () => {
  it("runs the custom update after every native path update", () => {
    const calls: string[] = [];

    const edge = {
      updatePath: () => {
        calls.push("native");
      },
    };

    const cleanup = installEdgeUpdatePathHook(
      edge,
      () => {
        calls.push("custom");
      },
    );

    expect(calls).toEqual([
      "native",
      "custom",
    ]);

    calls.length = 0;

    edge.updatePath();

    expect(calls).toEqual([
      "native",
      "custom",
    ]);

    calls.length = 0;

    cleanup();

    expect(calls).toEqual(["native"]);

    calls.length = 0;

    edge.updatePath();

    expect(calls).toEqual(["native"]);
  });
});
