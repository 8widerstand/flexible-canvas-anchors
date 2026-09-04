import { describe, expect, it } from "vitest";
import { createTranslatedLineEndTransform } from "./createTranslatedLineEndTransform";

describe("createTranslatedLineEndTransform", () => {
  it("changes the translation while preserving the rotation", () => {
    const transform = createTranslatedLineEndTransform(
      "translate(460px, -220px) rotate(0deg)",
      {
        x: 568,
        y: -220,
      },
    );

    expect(transform).toBe(
      "translate(568px, -220px) rotate(0deg)",
    );
  });
});
