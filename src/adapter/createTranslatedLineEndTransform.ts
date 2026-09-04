import type { Point } from "../geometry/types";

const ROTATION_PATTERN = /rotate\([^)]*\)/;

export function createTranslatedLineEndTransform(currentTransform: string, targetPoint: Point,): string {
  const rotation = currentTransform.match(ROTATION_PATTERN)?.[0] ?? "";

  const translation = `translate(${targetPoint.x}px, ${targetPoint.y}px)`;

  if (rotation.length === 0) {
    return translation;
  }

  return `${translation} ${rotation}`;
}
