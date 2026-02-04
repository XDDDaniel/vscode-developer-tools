import * as assert from "node:assert";

import { codeFormatHandler, sqlFormatHandler, dataFormatHandler } from "../tools/format/format";

suite("Format Tools", () => {
  suite("codeFormatHandler", () => {
    test("formats JavaScript code", async () => {
      const code = "const x=1;const y=2;";
      const result = await codeFormatHandler(code, { language: "javascript" });
      assert.strictEqual(result.success, true);
      assert.ok(result.output?.includes("const x = 1"));
      assert.ok(result.output?.includes("const y = 2"));
    });

    test("formats JSON code", async () => {
      const code = '{"key":"value","number":123}';
      const result = await codeFormatHandler(code, { language: "json" });
      assert.strictEqual(result.success, true);
      const parsed = JSON.parse(result.output ?? "");
      assert.strictEqual(parsed.key, "value");
      assert.strictEqual(parsed.number, 123);
    });

    test("formats HTML code", async () => {
      const code = "<div><p>Hello</p></div>";
      const result = await codeFormatHandler(code, { language: "html" });
      assert.strictEqual(result.success, true);
      assert.ok(result.output?.includes("<div>"));
      assert.ok(result.output?.includes("<p>"));
    });

    test("formats CSS code", async () => {
      const code = ".class{color:red;margin:10px}";
      const result = await codeFormatHandler(code, { language: "css" });
      assert.strictEqual(result.success, true);
      assert.ok(result.output?.includes("color: red"));
      assert.ok(result.output?.includes("margin: 10px"));
    });

    test("handles invalid code", async () => {
      const code = "invalid javascript {{{";
      const result = await codeFormatHandler(code, { language: "javascript" });
      assert.ok(result.success);
      assert.ok(result.output);
    });

    test("handles empty input", async () => {
      const result = await codeFormatHandler("");
      assert.strictEqual(result.success, false);
      assert.ok(result.error);
    });

    test("uses default language when not specified", async () => {
      const code = "const x = 1;";
      const result = await codeFormatHandler(code);
      assert.strictEqual(result.success, true);
      assert.ok(result.output?.includes("const x = 1"));
    });

    test("handles unknown language with default behavior", async () => {
      const code = "some code here";
      const result = await codeFormatHandler(code, { language: "unknown" });
      assert.strictEqual(result.success, true);
      assert.ok(result.output);
    });

    test("formats with custom tab width", async () => {
      const code = "const x={a:1,b:2};";
      const result = await codeFormatHandler(code, { language: "javascript", tabWidth: 4 });
      assert.strictEqual(result.success, true);
      assert.ok(result.output?.includes("    "));
    });
  });

  suite("sqlFormatHandler", () => {
    test("formats SQL query", async () => {
      const sql = "SELECT*FROM users WHERE id=1 AND name='test'";
      const result = await sqlFormatHandler(sql, { language: "sql" });
      assert.strictEqual(result.success, true);
      assert.ok(result.output?.toUpperCase().includes("SELECT"));
      assert.ok(result.output?.toUpperCase().includes("FROM"));
      assert.ok(result.output?.toUpperCase().includes("WHERE"));
    });

    test("handles complex SQL query", async () => {
      const sql = "SELECT id,name,age FROM users WHERE age>18 ORDER BY name LIMIT 10";
      const result = await sqlFormatHandler(sql, { language: "sql" });
      assert.strictEqual(result.success, true);
      assert.ok(result.output?.toUpperCase().includes("SELECT"));
      assert.ok(result.output?.toUpperCase().includes("ORDER BY"));
      assert.ok(result.output?.toUpperCase().includes("LIMIT"));
    });

    test("handles empty SQL", async () => {
      const result = await sqlFormatHandler("", { language: "sql" });
      assert.strictEqual(result.success, true);
    });

    test("handles invalid SQL", async () => {
      const result = await sqlFormatHandler("INVALID SQL QUERY {{{", { language: "sql" });
      assert.strictEqual(result.success, false);
      assert.ok(result.error);
    });

    test("formats SQL with custom indent style", async () => {
      const sql = "SELECT id FROM users";
      const result = await sqlFormatHandler(sql, { indentStyle: "tabularLeft" });
      assert.strictEqual(result.success, true);
      assert.ok(result.output);
    });

    test("formats SQL with custom lines between queries", async () => {
      const sql = "SELECT id FROM users; SELECT name FROM users";
      const result = await sqlFormatHandler(sql, { linesBetweenQueries: 4 });
      assert.strictEqual(result.success, true);
      assert.ok(result.output);
    });

    test("formats SQL for different dialects", async () => {
      const sql = "SELECT * FROM users";
      const result = await sqlFormatHandler(sql, { language: "postgresql" });
      assert.strictEqual(result.success, true);
      assert.ok(result.output);
    });
  });

  suite("dataFormatHandler", () => {
    test("converts JSON to YAML", async () => {
      const input = '{"name": "test", "value": 123}';
      const result = await dataFormatHandler(input, { language: "yaml" });
      assert.strictEqual(result.success, true);
      assert.ok(result.output?.includes("name: test"));
      assert.ok(result.output?.includes("value: 123"));
    });

    test("converts JSON to YAML", async () => {
      const input = '{"name": "test", "value": 123}';
      const result = await dataFormatHandler(input, { language: "yaml" });
      assert.strictEqual(result.success, true);
      assert.ok(result.output?.includes("name:"));
    });

    test("converts JSON to XML", async () => {
      const input = '{"name": "test"}';
      const result = await dataFormatHandler(input, { language: "xml" });
      assert.strictEqual(result.success, true);
      assert.ok(result.output && result.output.length > 0);
    });

    test("handles empty input", async () => {
      const result = await dataFormatHandler("", { language: "json" });
      assert.strictEqual(result.success, false);
      assert.ok(result.error);
    });

    test("handles invalid JSON input", async () => {
      const result = await dataFormatHandler("invalid json", { language: "json" });
      assert.strictEqual(result.success, false);
      assert.ok(result.error);
    });

    test("handles unsupported format", async () => {
      const input = '{"name": "test"}';
      const result = await dataFormatHandler(input, { language: "unsupported" });
      assert.strictEqual(result.success, false);
      assert.ok(result.error);
    });

    test("formats JSON with custom indent", async () => {
      const input = '{"name":"test"}';
      const result = await dataFormatHandler(input, { language: "json", tabWidth: 4 });
      assert.strictEqual(result.success, true);
      assert.ok(result.output?.includes("    "));
    });

    test("converts YAML to JSON", async () => {
      const input = "name: test\nvalue: 123";
      const result = await dataFormatHandler(input, { language: "yaml" });
      assert.strictEqual(result.success, true);
      assert.ok(result.output?.includes("name:"));
    });

    test("converts JSON to XML format", async () => {
      const input = '{"name":"test"}';
      const result = await dataFormatHandler(input, { language: "xml" });
      assert.strictEqual(result.success, true);
      assert.ok(result.output && result.output.length > 0);
    });

    test("handles nested objects in XML conversion", async () => {
      const input = "<root><child><name>test</name></child></root>";
      const result = await dataFormatHandler(input, { language: "xml" });
      assert.strictEqual(result.success, true);
      assert.ok(result.output);
    });
  });
});
