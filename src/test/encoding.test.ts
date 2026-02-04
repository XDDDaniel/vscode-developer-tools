import * as assert from "node:assert";

import { base32Handler, base64Handler, jwtHandler, urlHandler } from "../tools/encoding/encoding";

suite("Encoding Tools", () => {
  suite("base64Handler", () => {
    test("encodes string to base64", async () => {
      const result = await base64Handler("Hello World");
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.output, "SGVsbG8gV29ybGQ=");
      assert.strictEqual(result.metadata?.inputLength, 11);
      assert.strictEqual(result.metadata?.outputLength, 16);
    });

    test("decodes base64 to string", async () => {
      const result = await base64Handler("SGVsbG8gV29ybGQ=", { mode: "decode" });
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.output, "Hello World");
      assert.strictEqual(result.metadata?.mode, "decode");
    });

    test("encodes to base64url", async () => {
      const result = await base64Handler("Hello World", { type: "url" });
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.output, "SGVsbG8gV29ybGQ");
    });

    test("decodes base64url", async () => {
      const result = await base64Handler("SGVsbG8gV29ybGQ", { mode: "decode", type: "url" });
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.output, "Hello World");
    });

    test("encodes to base64 mime format", async () => {
      const longText = "a".repeat(100);
      const result = await base64Handler(longText, { type: "mime" });
      assert.strictEqual(result.success, true);
      assert.ok(result.output?.includes("\n"));
    });

    test("handles invalid base64 input", async () => {
      const result = await base64Handler("Invalid@Base64!", { mode: "decode" });
      assert.strictEqual(result.success, false);
      assert.ok(result.error);
    });

    test("handles base64 decode with short input", async () => {
      const result = await base64Handler("AA==", { mode: "decode" });
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.output, "\x00");
    });

    test("handles base64 decode with newlines in mime format", async () => {
      const mimeEncoded = "SGVsbG8g\nV29ybGQ=";
      const result = await base64Handler(mimeEncoded, { mode: "decode", type: "mime" });
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.output, "Hello World");
    });
  });

  suite("base32Handler", () => {
    test("encodes string to base32", async () => {
      const result = await base32Handler("Hello");
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.output, "JBSWY3DP");
    });

    test("decodes base32 to string", async () => {
      const result = await base32Handler("JBSWY3DP", { mode: "decode" });
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.output, "Hello");
    });

    test("handles invalid base32 input", async () => {
      const result = await base32Handler("!!!Invalid!!!", { mode: "decode" });
      assert.strictEqual(result.success, false);
      assert.ok(result.error);
    });
  });

  suite("urlHandler", () => {
    test("encodes string for URL", async () => {
      const result = await urlHandler("Hello World! How are you?");
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.output, "Hello%20World!%20How%20are%20you%3F");
    });

    test("decodes URL encoded string", async () => {
      const result = await urlHandler("Hello%20World!%20How%20are%20you%3F", { mode: "decode" });
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.output, "Hello World! How are you?");
    });

    test("encodes special characters", async () => {
      const result = await urlHandler("a&b=c+d");
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.output, "a%26b%3Dc%2Bd");
    });

    test("decodes special characters", async () => {
      const result = await urlHandler("a%26b%3Dc%2Bd", { mode: "decode" });
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.output, "a&b=c+d");
    });

    test("encodes and decodes emoji characters", async () => {
      const result = await urlHandler("Hello 🌍 World");
      assert.strictEqual(result.success, true);
      assert.ok(result.output?.includes("%F0%9F%8C%8D"));
    });

    test("decodes emoji URL encoding", async () => {
      const result = await urlHandler("Hello%20%F0%9F%8C%8D%20World", { mode: "decode" });
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.output, "Hello 🌍 World");
    });
  });

  suite("jwtHandler", () => {
    test("decodes valid JWT token", async () => {
      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
      const result = await jwtHandler(token);
      assert.strictEqual(result.success, true);
      const parsed = JSON.parse(result.output ?? "");
      assert.strictEqual(parsed.header.alg, "HS256");
      assert.strictEqual(parsed.payload.sub, "1234567890");
      assert.strictEqual(parsed.payload.name, "John Doe");
    });

    test("encodes JWT token", async () => {
      const payload = JSON.stringify({ name: "Test User", sub: "1234567890" });
      const result = await jwtHandler(payload, { mode: "encode", secret: "test-secret" });
      assert.strictEqual(result.success, true);
      assert.ok(result.output?.includes("."));
    });

    test("handles invalid JWT format", async () => {
      const result = await jwtHandler("invalid.jwt.token");
      assert.strictEqual(result.success, false);
      assert.ok(result.error);
    });

    test("handles empty input", async () => {
      const result = await jwtHandler("");
      assert.strictEqual(result.success, false);
      assert.strictEqual(result.error, "Input is required");
    });

    test("handles malformed JSON in JWT payload", async () => {
      const result = await jwtHandler("{invalid json}", { mode: "encode" });
      assert.strictEqual(result.success, false);
      assert.ok(result.error);
    });

    test("handles JWT encode with custom header", async () => {
      const payload = JSON.stringify({ sub: "1234567890" });
      const result = await jwtHandler(payload, {
        header: '{"alg": "HS384"}',
        mode: "encode",
        secret: "test-secret",
      });
      assert.strictEqual(result.success, true);
      assert.ok(result.output);
    });

    test("handles JWT with malformed base64url in token", async () => {
      const result = await jwtHandler("!!!invalid!!!.payload.signature", { mode: "decode" });
      assert.strictEqual(result.success, false);
    });
  });
});
