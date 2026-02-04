import * as assert from "node:assert";

import { datetimeConverterHandler } from "../tools/datetime/datetime";

suite("Date Time Tools", () => {
  test("converts current date to ISO 8601", async () => {
    const result = await datetimeConverterHandler("");
    assert.strictEqual(result.success, true);
    assert.ok(result.output?.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/));
  });

  test("converts timestamp (ms) to ISO 8601", async () => {
    const result = await datetimeConverterHandler("1704067200000");
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.output, "2024-01-01T00:00:00.000Z");
  });

  test("converts timestamp (seconds) to ISO 8601", async () => {
    const result = await datetimeConverterHandler("1704067200");
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.output, "2024-01-01T00:00:00.000Z");
  });

  test("converts date string to ISO 8601", async () => {
    const result = await datetimeConverterHandler("2024-01-01");
    assert.strictEqual(result.success, true);
    assert.ok(result.output?.includes("2024-01-01"));
  });

  test("converts date to YYYY-MM-DD format", async () => {
    const result = await datetimeConverterHandler("1704067200000", { format: "YYYY-MM-DD" });
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.output, "2024-01-01");
  });

  test("converts date to DD/MM/YYYY format", async () => {
    const result = await datetimeConverterHandler("1704067200000", { format: "DD/MM/YYYY" });
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.output, "01/01/2024");
  });

  test("converts date to MM/DD/YYYY format", async () => {
    const result = await datetimeConverterHandler("1704067200000", { format: "MM/DD/YYYY" });
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.output, "01/01/2024");
  });

  test("converts date to RFC 1123 format", async () => {
    const result = await datetimeConverterHandler("1704067200000", { format: "RFC 1123" });
    assert.strictEqual(result.success, true);
    assert.ok(result.output?.includes("GMT"));
  });

  test("converts date to RFC 2822 format", async () => {
    const result = await datetimeConverterHandler("1704067200000", { format: "RFC 2822" });
    assert.strictEqual(result.success, true);
    assert.ok(result.output?.includes("UTC"));
  });

  test("converts date to Unix timestamp (ms)", async () => {
    const result = await datetimeConverterHandler("2024-01-01T00:00:00.000Z", {
      format: "Unix (ms)",
    });
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.output, "1704067200000");
  });

  test("converts date to Unix timestamp (sec)", async () => {
    const result = await datetimeConverterHandler("2024-01-01T00:00:00.000Z", {
      format: "Unix (sec)",
    });
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.output, "1704067200");
  });

  test("handles invalid date string", async () => {
    const result = await datetimeConverterHandler("invalid-date");
    assert.strictEqual(result.success, false);
    assert.strictEqual(result.error, "Invalid date or timestamp");
  });

  test("returns metadata with all formats", async () => {
    const result = await datetimeConverterHandler("1704067200000");
    assert.strictEqual(result.success, true);
    assert.ok(result.metadata?.formats);
    const formats = result.metadata?.formats as Record<string, string>;
    assert.ok(formats["ISO 8601"]);
    assert.ok(formats["Unix (ms)"]);
    assert.ok(formats["Unix (sec)"]);
    assert.ok(formats["YYYY-MM-DD"]);
    assert.ok(formats["DD/MM/YYYY"]);
    assert.ok(formats["MM/DD/YYYY"]);
  });

  test("uses default format when unknown format specified", async () => {
    const result = await datetimeConverterHandler("2024-01-01", { format: "unknown-format" });
    assert.strictEqual(result.success, true);
    assert.ok(result.output?.includes("2024-01-01"));
  });

  test("handles whitespace-only input", async () => {
    const result = await datetimeConverterHandler("   ");
    assert.strictEqual(result.success, true);
    assert.ok(result.output);
  });

  test("handles large timestamp in seconds", async () => {
    const result = await datetimeConverterHandler("4102444800", { format: "Unix (sec)" });
    assert.strictEqual(result.success, true);
    assert.ok(result.output);
  });

  test("handles negative year date", async () => {
    const result = await datetimeConverterHandler("1969-07-20T20:17:00.000Z");
    assert.strictEqual(result.success, true);
    assert.ok(result.output?.includes("1969"));
  });
});
