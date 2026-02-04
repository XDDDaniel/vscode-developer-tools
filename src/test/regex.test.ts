import * as assert from "node:assert";

import { regexTestHandler } from "../tools/regex/regex";

suite("Regex Tools", () => {
  test("matches email pattern", async () => {
    const result = await regexTestHandler("test@example.com", {
      flags: "",
      pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
    });
    assert.strictEqual(result.success, true);
    assert.ok(result.output?.includes("Match"));
  });

  test("matches phone number pattern", async () => {
    const result = await regexTestHandler("123-456-7890", {
      flags: "",
      pattern: "^\\d{3}-\\d{3}-\\d{4}$",
    });
    assert.strictEqual(result.success, true);
    assert.ok(result.output?.includes("Match"));
  });

  test("finds all matches with global flag", async () => {
    const result = await regexTestHandler("test123 and test456", {
      flags: "g",
      pattern: "test\\d+",
    });
    assert.strictEqual(result.success, true);
    assert.ok(result.output?.includes("test123"));
    assert.ok(result.output?.includes("test456"));
  });

  test("case insensitive match", async () => {
    const result = await regexTestHandler("HELLO world", {
      flags: "i",
      pattern: "hello",
    });
    assert.strictEqual(result.success, true);
    assert.ok(result.output?.includes("Match"));
  });

  test("no match found", async () => {
    const result = await regexTestHandler("no match here", {
      flags: "",
      pattern: "\\d+",
    });
    assert.strictEqual(result.success, true);
    assert.ok(result.output?.includes("No match"));
  });

  test("matches digits", async () => {
    const result = await regexTestHandler("abc123def456", {
      flags: "g",
      pattern: "\\d+",
    });
    assert.strictEqual(result.success, true);
    assert.ok(result.output?.includes("123"));
    assert.ok(result.output?.includes("456"));
  });

  test("matches word boundaries", async () => {
    const result = await regexTestHandler("test testing tested", {
      flags: "g",
      pattern: "\\btest\\b",
    });
    assert.strictEqual(result.success, true);
    const matches = (result.output?.match(/test/g) || []).length;
    assert.strictEqual(matches, 1);
  });

  test("matches groups", async () => {
    const result = await regexTestHandler("John Doe", {
      flags: "",
      pattern: "^(\\w+)\\s+(\\w+)$",
    });
    assert.strictEqual(result.success, true);
    assert.ok(result.output?.includes("Match"));
    assert.ok(result.output?.includes("John"));
    assert.ok(result.output?.includes("Doe"));
  });

  test("handles invalid regex pattern", async () => {
    const result = await regexTestHandler("test", {
      flags: "",
      pattern: "[invalid(",
    });
    assert.strictEqual(result.success, false);
    assert.ok(result.error);
  });

  test("handles empty text input", async () => {
    const result = await regexTestHandler("", {
      flags: "g",
      pattern: "\\w+",
    });
    assert.strictEqual(result.success, true);
    assert.ok(result.output?.includes("No match"));
  });

  test("handles empty pattern", async () => {
    const result = await regexTestHandler("test text", {
      flags: "",
      pattern: "",
    });
    assert.strictEqual(result.success, true);
  });

  test("matches multiple lines", async () => {
    const result = await regexTestHandler("line1\nline2\nline3", {
      flags: "gm",
      pattern: "^line\\d+$",
    });
    assert.strictEqual(result.success, true);
    assert.ok(result.output?.includes("line1"));
    assert.ok(result.output?.includes("line2"));
    assert.ok(result.output?.includes("line3"));
  });

  test("matches URL pattern", async () => {
    const result = await regexTestHandler("https://example.com", {
      flags: "",
      pattern: "^https?://[\\w\\-]+(\\.[\\w\\-]+)+[/#?]?.*$",
    });
    assert.strictEqual(result.success, true);
    assert.ok(result.output?.includes("Match"));
  });

  test("extracts numbers from text", async () => {
    const result = await regexTestHandler("The price is $19.99 and $29.99", {
      flags: "g",
      pattern: "\\$\\d+\\.\\d{2}",
    });
    assert.strictEqual(result.success, true);
    assert.ok(result.output?.includes("$19.99"));
    assert.ok(result.output?.includes("$29.99"));
  });

  test("matches date format", async () => {
    const result = await regexTestHandler("2024-01-15", {
      flags: "",
      pattern: "^\\d{4}-\\d{2}-\\d{2}$",
    });
    assert.strictEqual(result.success, true);
    assert.ok(result.output?.includes("Match"));
  });

  test("handles regex with capturing groups non-global", async () => {
    const result = await regexTestHandler("John Doe", {
      flags: "",
      pattern: "(\\w+) (\\w+)",
    });
    assert.strictEqual(result.success, true);
    assert.ok(result.output);
  });

  test("handles global flag with case insensitive", async () => {
    const result = await regexTestHandler("Test test TEST", {
      flags: "gi",
      pattern: "test",
    });
    assert.strictEqual(result.success, true);
    assert.ok(result.output?.includes("Test"));
  });

  test("handles pattern that matches empty string", async () => {
    const result = await regexTestHandler("test", {
      flags: "g",
      pattern: ".*",
    });
    assert.strictEqual(result.success, true);
    assert.ok(result.output);
  });

  test("handles very long input with global flag", async () => {
    const input = "test ".repeat(1000);
    const result = await regexTestHandler(input, {
      flags: "g",
      pattern: "test",
    });
    assert.strictEqual(result.success, true);
    assert.ok(result.output?.includes("test"));
  });

  test("handles regex with named capture groups", async () => {
    const result = await regexTestHandler("John Doe", {
      flags: "",
      pattern: "(?<first>\\w+) (?<last>\\w+)",
    });
    assert.strictEqual(result.success, true);
    assert.ok(result.output);
  });

  test("handles regex match with null result", async () => {
    const result = await regexTestHandler("hello", {
      flags: "",
      pattern: "xyz",
    });
    assert.strictEqual(result.success, true);
    assert.ok(result.output?.includes("No match"));
  });
});
