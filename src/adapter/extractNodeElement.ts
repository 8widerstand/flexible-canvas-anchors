
export function extractNodeElement(node: unknown): HTMLElement | null {
  if (typeof node !== "object" || node === null || Array.isArray(node)) {
    return null;
  }
  const nodeProperties = node as Record<string, unknown>;
  const nodeElement = nodeProperties.nodeEl;

  if (
    typeof nodeElement !== "object" ||
    nodeElement === null ||
    !("instanceOf" in nodeElement) ||
    typeof nodeElement.instanceOf !== "function"
  ) {
    return null;
  }

  const elementCandidate = nodeElement as HTMLElement;

  if (!elementCandidate.instanceOf(HTMLElement)) {
    return null;
  }

  return elementCandidate;
}
