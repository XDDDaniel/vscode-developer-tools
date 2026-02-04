import * as assert from "node:assert";

import { colorPickerHandler } from "../tools/color/color";

suite("Color Tools", () => {
  test("converts HEX to RGB", async () => {
    const result = await colorPickerHandler("#ff0000");
    assert.strictEqual(result.success, true);
    assert.ok(result.output?.includes("rgb(255, 0, 0)"));
    assert.ok(result.output?.toLowerCase().includes("#ff0000"));
  });

  test("converts HEX to HSL", async () => {
    const result = await colorPickerHandler("#ff0000");
    assert.strictEqual(result.success, true);
    assert.ok(result.output?.toLowerCase().includes("hsl"));
  });

  test("converts RGB to HEX", async () => {
    const result = await colorPickerHandler("rgb(255, 0, 0)");
    assert.strictEqual(result.success, true);
    assert.ok(result.output?.toLowerCase().includes("#ff0000"));
  });

  test("converts RGB to HSL", async () => {
    const result = await colorPickerHandler("rgb(0, 128, 255)");
    assert.strictEqual(result.success, true);
    assert.ok(result.output?.toLowerCase().includes("hsl"));
  });

  test("converts HSL to HEX", async () => {
    const result = await colorPickerHandler("hsl(0, 100%, 50%)");
    assert.strictEqual(result.success, true);
    assert.ok(result.output?.toLowerCase().includes("#ff0000"));
  });

  test("converts HSL to RGB", async () => {
    const result = await colorPickerHandler("hsl(0, 100%, 50%)");
    assert.strictEqual(result.success, true);
    assert.ok(result.output?.toLowerCase().includes("rgb(255, 0, 0)"));
  });

  test("handles short HEX format", async () => {
    const result = await colorPickerHandler("#f00");
    assert.strictEqual(result.success, true);
    assert.ok(result.output?.toLowerCase().includes("rgb(255, 0, 0)"));
  });

  test("handles color name", async () => {
    const result = await colorPickerHandler("red");
    assert.strictEqual(result.success, true);
    assert.ok(result.output?.toLowerCase().includes("#ff0000"));
    assert.ok(result.output?.toLowerCase().includes("rgb"));
  });

  test("handles invalid color", async () => {
    const result = await colorPickerHandler("notacolor");
    assert.strictEqual(result.success, false);
    assert.ok(result.error);
  });

  test("handles empty input", async () => {
    const result = await colorPickerHandler("");
    assert.strictEqual(result.success, false);
    assert.ok(result.error);
  });

  test("includes multiple format conversions", async () => {
    const result = await colorPickerHandler("#00ff00");
    assert.strictEqual(result.success, true);
    assert.ok(result.output?.toLowerCase().includes("#00ff00"));
    assert.ok(result.output?.toLowerCase().includes("rgb"));
    assert.ok(result.output?.toLowerCase().includes("hsl"));
  });

  test("handles color with alpha less than 1", async () => {
    const result = await colorPickerHandler("rgba(255, 0, 0, 0.5)");
    assert.strictEqual(result.success, true);
    assert.ok(result.output?.includes("rgba"));
  });

  test("handles color with alpha equal to 1", async () => {
    const result = await colorPickerHandler("rgba(255, 0, 0, 1)");
    assert.strictEqual(result.success, true);
    assert.ok(result.output?.includes('"rgb"'));
  });

  test("uses options color when provided", async () => {
    const result = await colorPickerHandler("not-used", { color: "#00ff00" });
    assert.strictEqual(result.success, true);
    assert.ok(result.output?.toLowerCase().includes("#00ff00"));
  });

  test("handles error with non-Error object", async () => {
    const result = await colorPickerHandler("notacolor");
    assert.strictEqual(result.success, false);
    assert.ok(result.error);
  });
});
