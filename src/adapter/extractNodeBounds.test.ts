import {describe, expect, it} from "vitest";
import {extractNodeBounds} from "./extractNodeBounds";

describe("extractNodeBounds", () => {

  it('extracts the bounds from a valid Canvas node ', () => {
    const runtimeNode = {
      id: "source-node",
      text: "# Source",
      x: -200,
      y: -400,
      width: 127,
      height: 500,
    };
    const bounds = extractNodeBounds(runtimeNode);
    expect(bounds).toEqual({
      x: -200,
      y: -400,
      width: 127,
      height: 500,
    });
  });

  it.each([null, undefined, "not a node", 42, []])("returns null for the invalid node value %s", (value) => {
    const bounds = extractNodeBounds(value);
    expect(bounds).toBeNull();
  })

  it.each([
    {},
    {x: 10, y: 20, width: "100", height: 200},
    {x: Number.NaN, y: 20, width: 100, height: 200},
    {x: 10, y: 20, width: 100, height: Number.POSITIVE_INFINITY},
    {x: 10, y: 20, width: 0, height: 200},
    {x: 10, y: 20, width: 100, height: -1},
  ])("returns null for a node with invalid bounds", (runtimeNode) => {
    const bounds = extractNodeBounds(runtimeNode);

    expect(bounds).toBeNull();
  });

})
