import * as assert from "node:assert";

import { jsonPathHandler, jsonSchemaHandler } from "../tools/json/json";

suite("JSON Tools", () => {
  suite("jsonPathHandler", () => {
    test("extracts value using simple path", async () => {
      const result = await jsonPathHandler('{"user":{"name":"John","age":30}}', {
        path: "$.user.name",
      });
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.output, "John");
    });

    test("extracts nested object", async () => {
      const result = await jsonPathHandler('{"user":{"name":"John","age":30}}', { path: "$.user" });
      assert.strictEqual(result.success, true);
      const parsed = JSON.parse(result.output ?? "");
      assert.strictEqual(parsed.name, "John");
      assert.strictEqual(parsed.age, 30);
    });

    test("extracts array elements", async () => {
      const result = await jsonPathHandler('{"items":["apple","banana","cherry"]}', {
        path: "$.items[0]",
      });
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.output, "apple");
    });

    test("extracts all array elements", async () => {
      const result = await jsonPathHandler('{"items":["apple","banana","cherry"]}', {
        path: "$.items[*]",
      });
      assert.strictEqual(result.success, true);
      const parsed = JSON.parse(result.output ?? "");
      assert.strictEqual(parsed.length, 3);
      assert.strictEqual(parsed[0], "apple");
      assert.strictEqual(parsed[1], "banana");
      assert.strictEqual(parsed[2], "cherry");
    });

    test("extracts multiple array elements", async () => {
      const result = await jsonPathHandler('{"items":["apple","banana","cherry","date"]}', {
        path: "$.items[0,2]",
      });
      assert.strictEqual(result.success, true);
      const parsed = JSON.parse(result.output ?? "");
      assert.strictEqual(parsed.length, 2);
      assert.strictEqual(parsed[0], "apple");
      assert.strictEqual(parsed[1], "cherry");
    });

    test("extracts using slice notation", async () => {
      const result = await jsonPathHandler('{"items":["a","b","c","d","e"]}', {
        path: "$.items[1:3]",
      });
      assert.strictEqual(result.success, true);
      const parsed = JSON.parse(result.output ?? "");
      assert.strictEqual(parsed.length, 2);
      assert.strictEqual(parsed[0], "b");
      assert.strictEqual(parsed[1], "c");
    });

    test("filters array elements", async () => {
      const result = await jsonPathHandler('{"items":[1,2,3,4,5]}', { path: "$.items[?(@ > 2)]" });
      assert.strictEqual(result.success, true);
      const parsed = JSON.parse(result.output ?? "");
      assert.strictEqual(parsed.length, 3);
      assert.strictEqual(parsed[0], 3);
      assert.strictEqual(parsed[1], 4);
      assert.strictEqual(parsed[2], 5);
    });

    test("handles invalid JSON", async () => {
      const result = await jsonPathHandler("invalid json", { path: "$.test" });
      assert.strictEqual(result.success, false);
      assert.ok(result.error);
    });

    test("handles invalid path", async () => {
      const result = await jsonPathHandler('{"key":"value"}', { path: "$.nonexistent" });
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.output, "");
    });

    test("extracts number value", async () => {
      const result = await jsonPathHandler('{"count":42}', { path: "$.count" });
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.output, "42");
    });

    test("extracts boolean value", async () => {
      const result = await jsonPathHandler('{"active":true}', { path: "$.active" });
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.output, "true");
    });

    test("extracts object value", async () => {
      const result = await jsonPathHandler('{"user":{"name":"John"}}', { path: "$.user" });
      assert.strictEqual(result.success, true);
      const parsed = JSON.parse(result.output ?? "");
      assert.deepStrictEqual(parsed, { name: "John" });
    });

    test("returns empty array as empty string", async () => {
      const result = await jsonPathHandler('{"items":[]}', { path: "$.items[0]" });
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.output, "");
    });

    test("uses default path when not provided", async () => {
      const result = await jsonPathHandler('{"name":"John"}');
      assert.strictEqual(result.success, true);
      assert.ok(result.output?.includes("John"));
    });

    test("handles empty JSON input", async () => {
      const result = await jsonPathHandler("");
      assert.strictEqual(result.success, false);
      assert.ok(result.error);
    });

    test("extracts null value", async () => {
      const result = await jsonPathHandler('{"value":null}', { path: "$.value" });
      assert.strictEqual(result.success, true);
      assert.ok(result.output?.includes("null"));
    });

    test("extracts deeply nested path", async () => {
      const result = await jsonPathHandler('{"a":{"b":{"c":{"d":"deep"}}}}', { path: "$.a.b.c.d" });
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.output, "deep");
    });

    test("handles array result with single object", async () => {
      const result = await jsonPathHandler('{"items":[{"id":1}]}', { path: "$.items[0]" });
      assert.strictEqual(result.success, true);
      const parsed = JSON.parse(result.output ?? "");
      assert.deepStrictEqual(parsed, { id: 1 });
    });

    test("handles array result with single string value", async () => {
      const result = await jsonPathHandler('{"items":["test"]}', { path: "$.items[0]" });
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.output, "test");
    });

    test("handles array result with single number value", async () => {
      const result = await jsonPathHandler('{"items":[42]}', { path: "$.items[0]" });
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.output, "42");
    });

    test("handles array result with single boolean value", async () => {
      const result = await jsonPathHandler('{"items":[true]}', { path: "$.items[0]" });
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.output, "true");
    });
  });

  suite("jsonSchemaHandler", () => {
    test("validates valid JSON against schema", async () => {
      const json = '{"name":"John","age":30,"email":"john@example.com"}';
      const schema = JSON.stringify({
        properties: {
          age: { type: "number" },
          email: { type: "string" },
          name: { type: "string" },
        },
        required: ["name", "age"],
        type: "object",
      });
      const result = await jsonSchemaHandler(json, { schema });
      assert.strictEqual(result.success, true);
      assert.ok(result.output?.includes("Valid JSON"));
    });

    test("validates invalid JSON against schema", async () => {
      const json = '{"name":"John","age":"not a number"}';
      const schema = JSON.stringify({
        properties: {
          age: { type: "number" },
          name: { type: "string" },
        },
        required: ["name", "age"],
        type: "object",
      });
      const result = await jsonSchemaHandler(json, { schema });
      assert.strictEqual(result.success, false);
      assert.ok(result.error?.includes("Invalid JSON"));
      assert.ok(result.error?.includes("age"));
    });

    test("validates missing required fields", async () => {
      const json = '{"name":"John"}';
      const schema = JSON.stringify({
        properties: {
          age: { type: "number" },
          name: { type: "string" },
        },
        required: ["name", "age"],
        type: "object",
      });
      const result = await jsonSchemaHandler(json, { schema });
      assert.strictEqual(result.success, false);
      assert.ok(result.error?.includes("Invalid JSON"));
      assert.ok(result.error?.includes("age"));
    });

    test("validates array type", async () => {
      const json = '{"items":[1,2,3]}';
      const schema = JSON.stringify({
        properties: {
          items: { type: "array" },
        },
        type: "object",
      });
      const result = await jsonSchemaHandler(json, { schema });
      assert.strictEqual(result.success, true);
      assert.ok(result.output?.includes("Valid JSON"));
    });

    test("handles invalid schema", async () => {
      const json = '{"name":"John"}';
      const schema = "invalid schema";
      const result = await jsonSchemaHandler(json, { schema });
      assert.strictEqual(result.success, false);
      assert.ok(result.error);
    });

    test("handles invalid JSON input", async () => {
      const json = "not valid json";
      const schema = JSON.stringify({ type: "object" });
      const result = await jsonSchemaHandler(json, { schema });
      assert.strictEqual(result.success, false);
      assert.ok(result.error);
    });

    test("handles schema without provided schema", async () => {
      const json = '{"name":"John","age":30}';
      const result = await jsonSchemaHandler(json);
      assert.strictEqual(result.success, true);
      assert.ok(result.output?.includes("name"));
      const msg = result.metadata?.message as string | undefined;
      assert.ok(msg?.includes("Provide a schema"));
    });

    test("handles schema compilation error", async () => {
      const json = '{"name":"John"}';
      const schema = JSON.stringify({
        properties: {
          name: { type: "notavalidtype" },
        },
        type: "object",
      });
      const result = await jsonSchemaHandler(json, { schema });
      assert.strictEqual(result.success, false);
      assert.ok(result.error?.includes("Invalid schema"));
    });

    test("validates against schema with multiple errors", async () => {
      const json = '{"name":123,"age":"not a number","active":"yes"}';
      const schema = JSON.stringify({
        properties: {
          active: { type: "boolean" },
          age: { type: "number" },
          name: { type: "string" },
        },
        required: ["name", "age", "active"],
        type: "object",
      });
      const result = await jsonSchemaHandler(json, { schema });
      assert.strictEqual(result.success, false);
      assert.ok(result.error);
      assert.ok(result.metadata?.errors);
    });
  });
});
