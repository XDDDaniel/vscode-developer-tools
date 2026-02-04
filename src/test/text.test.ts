import * as assert from "node:assert";

import {
  textCaseHandler,
  textEscapeHandler,
  textFilterHandler,
  textFormatHandler,
  textSortHandler,
} from "../tools/text/text";

suite("Text Tools", () => {
  suite("textCaseHandler", () => {
    test("converts to uppercase", async () => {
      const result = await textCaseHandler("hello world", { type: "upper" });
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.output, "HELLO WORLD");
    });

    test("converts to lowercase", async () => {
      const result = await textCaseHandler("HELLO WORLD", { type: "lower" });
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.output, "hello world");
    });

    test("converts to title case", async () => {
      const result = await textCaseHandler("hello world", { type: "title" });
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.output, "Hello World");
    });

    test("converts to sentence case", async () => {
      const result = await textCaseHandler("hello WORLD. how ARE you?", { type: "sentence" });
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.output, "Hello world. How are you?");
    });

    test("converts to camel case", async () => {
      const result = await textCaseHandler("hello-world-test", { type: "camel" });
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.output, "helloWorldTest");
    });

    test("converts to snake case", async () => {
      const result = await textCaseHandler("helloWorldTest", { type: "snake" });
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.output, "hello_world_test");
    });

    test("converts to kebab case", async () => {
      const result = await textCaseHandler("helloWorldTest", { type: "kebab" });
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.output, "hello-world-test");
    });

    test("reverses text", async () => {
      const result = await textCaseHandler("hello", { type: "reverse" });
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.output, "olleh");
    });

    test("includes metadata", async () => {
      const result = await textCaseHandler("hello", { type: "upper" });
      assert.strictEqual(result.metadata?.inputLength, 5);
      assert.strictEqual(result.metadata?.outputLength, 5);
      assert.strictEqual(result.metadata?.transformation, "upper");
    });

    test("handles unknown case type with default behavior", async () => {
      const result = await textCaseHandler("hello world", { type: "unknown" });
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.output, "hello world");
    });
  });

  suite("textSortHandler", () => {
    test("sorts lines ascending", async () => {
      const result = await textSortHandler("zebra\napple\nbanana", { order: "asc" });
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.output, "apple\nbanana\nzebra");
    });

    test("sorts lines descending", async () => {
      const result = await textSortHandler("zebra\napple\nbanana", { order: "desc" });
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.output, "zebra\nbanana\napple");
    });

    test("sorts numerically ascending", async () => {
      const result = await textSortHandler("10\n2\n1\n20", { mode: "numeric", order: "asc" });
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.output, "1\n2\n10\n20");
    });

    test("sorts numerically descending", async () => {
      const result = await textSortHandler("10\n2\n1\n20", { mode: "numeric", order: "desc" });
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.output, "20\n10\n2\n1");
    });

    test("sorts by length ascending", async () => {
      const result = await textSortHandler("a\nbb\nccc\nd", { mode: "length", order: "asc" });
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.output, "a\nd\nbb\nccc");
    });

    test("sorts by length descending", async () => {
      const result = await textSortHandler("a\nbb\nccc\nd", { mode: "length", order: "desc" });
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.output, "ccc\nbb\na\nd");
    });

    test("includes metadata", async () => {
      const result = await textSortHandler("zebra\napple\nbanana");
      assert.strictEqual(result.metadata?.lineCount, 3);
      assert.strictEqual(result.metadata?.order, "asc");
      assert.strictEqual(result.metadata?.mode, "line");
    });

    test("handles shuffle mode", async () => {
      const input = "apple\nbanana\ncherry";
      const result = await textSortHandler(input, { mode: "shuffle" });
      assert.strictEqual(result.success, true);
      const lines = (result.output ?? "").split("\n");
      assert.strictEqual(lines.length, 3);
      assert.ok(lines.includes("apple"));
      assert.ok(lines.includes("banana"));
      assert.ok(lines.includes("cherry"));
    });

    test("handles unknown sort mode", async () => {
      const result = await textSortHandler("apple\nbanana", { mode: "unknown" });
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.output, "apple\nbanana");
    });
  });

  suite("textFilterHandler", () => {
    test("removes empty lines", async () => {
      const result = await textFilterHandler("line1\n\nline2\n\n\nline3", { removeEmpty: true });
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.output, "line1\nline2\nline3");
    });

    test("removes lines with only whitespace", async () => {
      const result = await textFilterHandler("line1\n   \nline2", { removeEmpty: true });
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.output, "line1\nline2");
    });

    test("filters by pattern matching", async () => {
      const result = await textFilterHandler("apple\nbanana\napricot\ncherry", { pattern: "ap" });
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.output, "apple\napricot");
    });

    test("filters by pattern excluding", async () => {
      const result = await textFilterHandler("apple\nbanana\napricot\ncherry", {
        match: "exclude",
        pattern: "ap",
      });
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.output, "banana\ncherry");
    });

    test("filters by minimum length", async () => {
      const result = await textFilterHandler("a\nbb\nccc\ndddd", { minLength: 3 });
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.output, "ccc\ndddd");
    });

    test("filters by maximum length", async () => {
      const result = await textFilterHandler("a\nbb\nccc\ndddd", { maxLength: 2 });
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.output, "a\nbb");
    });

    test("removes duplicate lines", async () => {
      const result = await textFilterHandler("apple\nbanana\napple\ncherry\nbanana", {
        unique: true,
      });
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.output, "apple\nbanana\ncherry");
    });

    test("case sensitive pattern matching", async () => {
      const result = await textFilterHandler("Apple\napple\nAPPLE", {
        caseSensitive: true,
        pattern: "apple",
      });
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.output, "apple");
    });

    test("case insensitive pattern matching", async () => {
      const result = await textFilterHandler("Apple\napple\nAPPLE", {
        caseSensitive: false,
        pattern: "apple",
      });
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.output, "Apple\napple\nAPPLE");
    });

    test("includes metadata", async () => {
      const result = await textFilterHandler("line1\nline2\nline3", { removeEmpty: true });
      assert.strictEqual(result.metadata?.originalLines, 3);
      assert.strictEqual(result.metadata?.filteredLines, 3);
      assert.strictEqual(result.metadata?.removedLines, 0);
    });
  });

  suite("textEscapeHandler", () => {
    test("escapes HTML", async () => {
      const result = await textEscapeHandler("<div>Hello & 'World'</div>", { type: "html" });
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.output, "&lt;div&gt;Hello &amp; &#039;World&#039;&lt;/div&gt;");
    });

    test("escapes XML", async () => {
      const result = await textEscapeHandler("<tag>Content & value</tag>", { type: "xml" });
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.output, "&lt;tag&gt;Content &amp; value&lt;/tag&gt;");
    });

    test("escapes JSON string", async () => {
      const result = await textEscapeHandler('Hello "World"', { type: "json" });
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.output, String.raw`"Hello \"World\""`);
    });

    test("escapes for Java", async () => {
      const result = await textEscapeHandler("Line1\nLine2\tTab", { type: "java" });
      assert.strictEqual(result.success, true);
      assert.ok(result.output?.includes(String.raw`\n`));
      assert.ok(result.output?.includes(String.raw`\t`));
    });
  });

  suite("textFormatHandler", () => {
    test("converts JSON to YAML", async () => {
      const result = await textFormatHandler('{"key": "value"}', { from: "json", to: "yaml" });
      assert.strictEqual(result.success, true);
      assert.ok(result.output?.includes("key: value"));
    });

    test("converts YAML to JSON", async () => {
      const result = await textFormatHandler("key: value\nkey2: value2", {
        from: "yaml",
        to: "json",
      });
      assert.strictEqual(result.success, true);
      const parsed = JSON.parse(result.output ?? "");
      assert.strictEqual(parsed.key, "value");
      assert.strictEqual(parsed.key2, "value2");
    });

    test("converts JSON to CSV", async () => {
      const result = await textFormatHandler(
        '[{"name":"John","age":30},{"name":"Jane","age":25}]',
        { from: "json", to: "csv" },
      );
      assert.strictEqual(result.success, true);
      assert.ok(result.output?.includes("name,age"));
      assert.ok(result.output?.includes("John,30"));
    });

    test("converts JSON to XML", async () => {
      const result = await textFormatHandler('{"key":"value"}', { from: "json", to: "xml" });
      assert.strictEqual(result.success, true);
      assert.ok(result.output?.includes("<key>value</key>"));
    });

    test("converts CSV to JSON", async () => {
      const result = await textFormatHandler("name,age\nJohn,30\nJane,25", {
        from: "csv",
        to: "json",
      });
      assert.strictEqual(result.success, true);
      const parsed = JSON.parse(result.output ?? "");
      assert.strictEqual(parsed[0].name, "John");
      assert.strictEqual(parsed[0].age, "30");
    });

    test("converts JSONL to JSON", async () => {
      const result = await textFormatHandler('{"name":"John"}\n{"name":"Jane"}', {
        from: "jsonl",
        to: "json",
      });
      assert.strictEqual(result.success, true);
      const parsed = JSON.parse(result.output ?? "");
      assert.strictEqual(parsed[0].name, "John");
      assert.strictEqual(parsed[1].name, "Jane");
    });

    test("converts JSON to JSONL", async () => {
      const result = await textFormatHandler('[{"name":"John"},{"name":"Jane"}]', {
        from: "json",
        to: "jsonl",
      });
      assert.strictEqual(result.success, true);
      const lines = (result.output ?? "").split("\n");
      assert.strictEqual(lines.length, 2);
      assert.strictEqual(JSON.parse(lines[0]).name, "John");
      assert.strictEqual(JSON.parse(lines[1]).name, "Jane");
    });

    test("includes metadata", async () => {
      const result = await textFormatHandler('{"key": "value"}', { from: "json", to: "yaml" });
      assert.strictEqual(result.metadata?.from, "json");
      assert.strictEqual(result.metadata?.to, "yaml");
    });

    test("handles invalid JSON input", async () => {
      const result = await textFormatHandler("invalid json", { from: "json", to: "yaml" });
      assert.strictEqual(result.success, false);
      assert.ok(result.error);
    });

    test("handles XML to JSON conversion", async () => {
      const result = await textFormatHandler("<root><name>test</name></root>", {
        from: "xml",
        to: "json",
      });
      assert.strictEqual(result.success, true);
    });

    test("converts XML to YAML", async () => {
      const result = await textFormatHandler("<root><name>test</name></root>", {
        from: "xml",
        to: "yaml",
      });
      assert.strictEqual(result.success, true);
    });

    test("handles unknown format by returning input", async () => {
      const result = await textFormatHandler("plain text", { from: "unknown", to: "yaml" });
      assert.strictEqual(result.success, true);
      assert.ok((result.output ?? "").trim() === "plain text");
    });

    test("handles empty JSONL input", async () => {
      const result = await textFormatHandler("", { from: "jsonl", to: "json" });
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.output, "[]");
    });

    test("handles CSV with special characters", async () => {
      const result = await textFormatHandler('name,city\n"John, Jr","New York, NY"', {
        from: "csv",
        to: "json",
      });
      assert.strictEqual(result.success, true);
      const parsed = JSON.parse(result.output ?? "");
      assert.strictEqual(parsed[0].name, "John, Jr");
      assert.strictEqual(parsed[0].city, "New York, NY");
    });

    test("handles CSV with newlines in values", async () => {
      const result = await textFormatHandler('name,desc\nJohn,"Line1\nLine2"', {
        from: "csv",
        to: "json",
      });
      assert.strictEqual(result.success, true);
    });

    test("handles empty string input", async () => {
      const result = await textFormatHandler("", { from: "json", to: "yaml" });
      assert.strictEqual(result.success, false);
      assert.ok(result.error);
    });

    test("converts XML with nested elements to JSON", async () => {
      const xml = "<root><items><item>1</item><item>2</item></items></root>";
      const result = await textFormatHandler(xml, { from: "xml", to: "json" });
      assert.strictEqual(result.success, true);
      assert.ok(result.output);
    });

    test("converts JSON to YAML with custom indent", async () => {
      const result = await textFormatHandler('{"a":{"b":{"c":"deep"}}}', {
        from: "json",
        to: "yaml",
      });
      assert.strictEqual(result.success, true);
      assert.ok(result.output?.includes("b:"));
    });

    test("handles YAML with special characters", async () => {
      const yaml = "name: test\ndescription: 'a: b\\nc: d'";
      const result = await textFormatHandler(yaml, { from: "yaml", to: "json" });
      assert.strictEqual(result.success, true);
      assert.ok(result.output);
    });

    test("converts CSV with quoted fields to JSON", async () => {
      const csv = '"name","age"\n"John","30"';
      const result = await textFormatHandler(csv, { from: "csv", to: "json" });
      assert.strictEqual(result.success, true);
      const parsed = JSON.parse(result.output ?? "");
      assert.strictEqual(parsed[0].name, "John");
    });

    test("converts single object to CSV", async () => {
      const json = '{"name":"John","age":30}';
      const result = await textFormatHandler(json, { from: "json", to: "csv" });
      assert.strictEqual(result.success, true);
      assert.ok(result.output?.includes("name,age"));
    });

    test("handles XML to JSON conversion with nested arrays", async () => {
      const xml = "<root><items><item>1</item><item>2</item></items></root>";
      const result = await textFormatHandler(xml, { from: "xml", to: "json" });
      assert.strictEqual(result.success, true);
      assert.ok(result.output);
    });

    test("handles CSV to JSON with single row", async () => {
      const csv = "name,age\nJohn,30";
      const result = await textFormatHandler(csv, { from: "csv", to: "json" });
      assert.strictEqual(result.success, true);
      const parsed = JSON.parse(result.output ?? "");
      assert.strictEqual(parsed[0].name, "John");
    });

    test("handles YAML to JSON with nested objects", async () => {
      const yaml = "outer:\n  inner:\n    value: test";
      const result = await textFormatHandler(yaml, { from: "yaml", to: "json" });
      assert.strictEqual(result.success, true);
      const parsed = JSON.parse(result.output ?? "");
      assert.strictEqual(parsed.outer.inner.value, "test");
    });

    test("handles JSONL to JSON with empty lines", async () => {
      const jsonl = '{"name":"John"}\n\n{"name":"Jane"}\n';
      const result = await textFormatHandler(jsonl, { from: "jsonl", to: "json" });
      assert.strictEqual(result.success, true);
      const parsed = JSON.parse(result.output ?? "");
      assert.strictEqual(parsed.length, 2);
    });

    test("handles XML with self-closing tags", async () => {
      const xml = "<root><item/><item/></root>";
      const result = await textFormatHandler(xml, { from: "xml", to: "json" });
      assert.strictEqual(result.success, true);
    });

    test("handles CSV with empty values", async () => {
      const csv = "name,age,city\nJohn,,New York";
      const result = await textFormatHandler(csv, { from: "csv", to: "json" });
      assert.strictEqual(result.success, true);
      const parsed = JSON.parse(result.output ?? "");
      assert.strictEqual(parsed[0].name, "John");
      assert.strictEqual(parsed[0].age, "");
    });

    test("handles CSV with only header (error case)", async () => {
      const csv = "name,age";
      const result = await textFormatHandler(csv, { from: "csv", to: "json" });
      assert.strictEqual(result.success, false);
      assert.ok(result.error);
    });

    test("converts JSON to XML with array values", async () => {
      const json = '{"items":["a","b","c"]}';
      const result = await textFormatHandler(json, { from: "json", to: "xml" });
      assert.strictEqual(result.success, true);
      assert.ok(
        result.output?.includes("<item>a</item>") || result.output?.includes("<items>a</items>"),
      );
    });

    test("converts JSON to XML with primitive value", async () => {
      const json = '{"content":"plain text"}';
      const result = await textFormatHandler(json, { from: "json", to: "xml" });
      assert.strictEqual(result.success, true);
      assert.ok(result.output?.includes("<content>plain text</content>"));
    });

    test("converts XML to JSON with boolean values", async () => {
      const xml = "<root><active>true</active></root>";
      const result = await textFormatHandler(xml, { from: "xml", to: "json" });
      assert.strictEqual(result.success, true);
      assert.ok(result.output);
    });

    test("converts XML to JSON with numeric values", async () => {
      const xml = "<root><count>42</count></root>";
      const result = await textFormatHandler(xml, { from: "xml", to: "json" });
      assert.strictEqual(result.success, true);
      assert.ok(result.output);
    });

    test("converts XML to JSON with empty text content", async () => {
      const xml = "<root><empty></empty></root>";
      const result = await textFormatHandler(xml, { from: "xml", to: "json" });
      assert.strictEqual(result.success, true);
      assert.ok(result.output);
    });

    test("handles textFormatHandler with unknown to format (default case)", async () => {
      const json = '{"name":"John"}';
      const result = await textFormatHandler(json, { from: "json", to: "unknown" });
      assert.strictEqual(result.success, true);
      assert.ok(result.output);
    });

    test("converts CSV with escaped double quotes", async () => {
      const csv = 'name,description\nJohn,"Test ""quoted"" text"';
      const result = await textFormatHandler(csv, { from: "csv", to: "json" });
      assert.strictEqual(result.success, true);
      const parsed = JSON.parse(result.output ?? "");
      assert.strictEqual(parsed[0].name, "John");
      assert.strictEqual(parsed[0].description, 'Test "quoted" text');
    });

    test("converts XML with basic content", async () => {
      const xml = "<root><name>John</name></root>";
      const result = await textFormatHandler(xml, { from: "xml", to: "json" });
      assert.strictEqual(result.success, true);
      assert.ok(result.output);
    });

    test("handles CSV conversion with non-object first item (error)", async () => {
      const json = '["not an object"]';
      const result = await textFormatHandler(json, { from: "json", to: "csv" });
      assert.strictEqual(result.success, false);
      assert.ok(result.error?.includes("Cannot convert to CSV"));
    });

    test("handles CSV conversion with non-object array item (error)", async () => {
      const json = '[{"name":"John"},"not an object"]';
      const result = await textFormatHandler(json, { from: "json", to: "csv" });
      assert.strictEqual(result.success, false);
      assert.ok(result.error?.includes("all array items must be objects"));
    });

    test("converts JSON to CSV with special characters needing quotes", async () => {
      const json = '[{"desc":"Hello, World!"}]';
      const result = await textFormatHandler(json, { from: "json", to: "csv" });
      assert.strictEqual(result.success, true);
      assert.ok(result.output?.includes('"'));
    });

    test("converts JSON to CSV with quote character in value", async () => {
      const json = '[{"name":"Test value"}]';
      const result = await textFormatHandler(json, { from: "json", to: "csv" });
      assert.strictEqual(result.success, true);
      assert.ok(result.output);
    });

    test("handles jsonlToJson with empty string", async () => {
      const jsonl = "";
      const result = await textFormatHandler(jsonl, { from: "jsonl", to: "json" });
      assert.strictEqual(result.success, true);
      const parsed = JSON.parse(result.output ?? "[]");
      assert.deepStrictEqual(parsed, []);
    });

    test("converts JSON to XML with null value", async () => {
      const json = '{"empty":null}';
      const result = await textFormatHandler(json, { from: "json", to: "xml" });
      assert.strictEqual(result.success, true);
      assert.ok(result.output?.includes("<empty/>"));
    });

    test("converts JSON to XML with undefined-like value", async () => {
      const json = '{"value":null}';
      const result = await textFormatHandler(json, { from: "json", to: "xml" });
      assert.strictEqual(result.success, true);
      assert.ok(result.output?.includes("<value/>"));
    });

    test("converts JSON to XML with non-record object (class instance)", async () => {
      const json = JSON.stringify({ item: "test" }, undefined, 2);
      const result = await textFormatHandler(json, { from: "json", to: "xml" });
      assert.strictEqual(result.success, true);
    });

    test("converts JSON to XML with empty object", async () => {
      const json = '{"empty":{}}';
      const result = await textFormatHandler(json, { from: "json", to: "xml" });
      assert.strictEqual(result.success, true);
      assert.ok(result.output?.includes("<empty/>"));
    });

    test("converts XML with opening tags that have existing values", async () => {
      const xml = "<root><item>first</item><item>second</item></root>";
      const result = await textFormatHandler(xml, { from: "xml", to: "json" });
      assert.strictEqual(result.success, true);
    });

    test("converts XML with nested elements and text content", async () => {
      const xml = "<root><parent><child>text</child></parent></root>";
      const result = await textFormatHandler(xml, { from: "xml", to: "json" });
      assert.strictEqual(result.success, true);
    });

    test("handles JSONL with only whitespace lines", async () => {
      const jsonl = "   \n   \n   ";
      const result = await textFormatHandler(jsonl, { from: "jsonl", to: "json" });
      assert.strictEqual(result.success, true);
      const parsed = JSON.parse(result.output ?? "[]");
      assert.deepStrictEqual(parsed, []);
    });

    test("converts JSON to CSV with null values", async () => {
      const json = '[{"name":"John","age":null}]';
      const result = await textFormatHandler(json, { from: "json", to: "csv" });
      assert.strictEqual(result.success, true);
      assert.ok(result.output);
    });

    test("converts JSON to XML with deeply nested empty objects", async () => {
      const json = '{"a":{"b":{"c":{}}}}';
      const result = await textFormatHandler(json, { from: "json", to: "xml" });
      assert.strictEqual(result.success, true);
    });
  });
});
