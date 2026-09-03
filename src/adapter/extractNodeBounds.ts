import {NodeBounds} from "../geometry/types";


export function extractNodeBounds(node: unknown): NodeBounds | null {
  if (typeof node !== "object" || node === null || Array.isArray(node)) {
    return null;
  }
  const nodeProperties = node as Record<string, unknown>;
  const x = nodeProperties.x;
  const y = nodeProperties.y;
  const width = nodeProperties.width;
  const height = nodeProperties.height;

  if (
    typeof x !== "number" ||
    typeof y !== "number" ||
    typeof width !== "number" ||
    typeof height !== "number" ||
    !Number.isFinite(x) ||
    !Number.isFinite(y) ||
    !Number.isFinite(width) ||
    !Number.isFinite(height) ||
    width <= 0 ||
    height <= 0
  ) {
    return null;
  }

  return {
    x,
    y,
    width,
    height,
  };
}
