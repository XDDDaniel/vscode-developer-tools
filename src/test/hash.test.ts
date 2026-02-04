import * as assert from "node:assert";

import { hashGeneratorHandler } from "../tools/hash/hash";

suite("Hash Tools", () => {
  test("generates MD5 hash", async () => {
    const result = await hashGeneratorHandler("Hello World", { algorithm: "md5" });
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.output?.length, 32);
    assert.strictEqual(result.metadata?.algorithm, "MD5");
  });

  test("generates SHA1 hash", async () => {
    const result = await hashGeneratorHandler("Hello World", { algorithm: "sha1" });
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.output?.length, 40);
    assert.strictEqual(result.metadata?.algorithm, "SHA1");
  });

  test("generates SHA256 hash", async () => {
    const result = await hashGeneratorHandler("Hello World", { algorithm: "sha256" });
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.output?.length, 64);
    assert.strictEqual(result.metadata?.algorithm, "SHA256");
  });

  test("generates SHA512 hash", async () => {
    const result = await hashGeneratorHandler("Hello World", { algorithm: "sha512" });
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.output?.length, 128);
    assert.strictEqual(result.metadata?.algorithm, "SHA512");
  });

  test("generates hash in base64 format", async () => {
    const result = await hashGeneratorHandler("Hello World", {
      algorithm: "sha256",
      outputFormat: "base64",
    });
    assert.strictEqual(result.success, true);
    assert.ok(result.output);
    assert.ok(!result.output?.match(/^[0-9a-f]+$/));
    assert.strictEqual(result.metadata?.algorithm, "SHA256 (Base64)");
  });

  test("generates uppercase hash", async () => {
    const result = await hashGeneratorHandler("Hello World", {
      algorithm: "sha256",
      case: "upper",
    });
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.output, result.output?.toUpperCase());
    assert.strictEqual(result.metadata?.case, "upper");
  });

  test("generates HMAC with secret", async () => {
    const result = await hashGeneratorHandler("Hello World", {
      algorithm: "sha256",
      secret: "my-secret",
    });
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.metadata?.algorithm, "HMAC-SHA256");
    assert.strictEqual(result.metadata?.hmac, true);
  });

  test("produces consistent hashes for same input", async () => {
    const result1 = await hashGeneratorHandler("Hello World", { algorithm: "sha256" });
    const result2 = await hashGeneratorHandler("Hello World", { algorithm: "sha256" });
    assert.strictEqual(result1.output, result2.output);
  });

  test("produces different hashes for different inputs", async () => {
    const result1 = await hashGeneratorHandler("Hello World", { algorithm: "sha256" });
    const result2 = await hashGeneratorHandler("Hello World!", { algorithm: "sha256" });
    assert.notStrictEqual(result1.output, result2.output);
  });

  test("uses default sha256 when no algorithm specified", async () => {
    const result = await hashGeneratorHandler("Hello World");
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.output?.length, 64);
    assert.strictEqual(result.metadata?.algorithm, "SHA256");
  });

  test("uses default sha256 for hmac when unknown algorithm specified", async () => {
    const result = await hashGeneratorHandler("Hello World", {
      algorithm: "sha256",
      secret: "secret",
    });
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.metadata?.algorithm, "HMAC-SHA256");
  });

  test("generates HMAC with MD5", async () => {
    const result = await hashGeneratorHandler("Hello World", {
      algorithm: "md5",
      secret: "my-secret",
    });
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.metadata?.algorithm, "HMAC-MD5");
  });

  test("generates HMAC with SHA1", async () => {
    const result = await hashGeneratorHandler("Hello World", {
      algorithm: "sha1",
      secret: "my-secret",
    });
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.metadata?.algorithm, "HMAC-SHA1");
  });

  test("generates HMAC with SHA512", async () => {
    const result = await hashGeneratorHandler("Hello World", {
      algorithm: "sha512",
      secret: "my-secret",
    });
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.metadata?.algorithm, "HMAC-SHA512");
  });

  test("generates lowercase hash by default", async () => {
    const result = await hashGeneratorHandler("Hello World", {
      algorithm: "sha256",
      case: "lower",
    });
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.metadata?.case, "lower");
    assert.strictEqual(result.output, result.output?.toLowerCase());
  });

  test("generates hash with all output format options", async () => {
    const hexResult = await hashGeneratorHandler("Hello", {
      algorithm: "sha256",
      outputFormat: "hex",
    });
    assert.strictEqual(hexResult.success, true);
    assert.ok(/^[0-9a-f]+$/.test(hexResult.output ?? ""));

    const base64Result = await hashGeneratorHandler("Hello", {
      algorithm: "sha256",
      outputFormat: "base64",
    });
    assert.strictEqual(base64Result.success, true);
    assert.ok(/^[A-Za-z0-9+/=]+$/.test(base64Result.output ?? ""));
  });

  test("generates HMAC with uppercase algorithm name variants", async () => {
    const result = await hashGeneratorHandler("Hello World", {
      algorithm: "sha256",
      secret: "secret",
    });
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.metadata?.algorithm, "HMAC-SHA256");
  });

  test("generates hash with empty input", async () => {
    const result = await hashGeneratorHandler("", { algorithm: "sha256" });
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.output?.length, 64);
  });

  test("generates HMAC with very short secret", async () => {
    const result = await hashGeneratorHandler("Hello World", {
      algorithm: "sha256",
      secret: "a",
    });
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.metadata?.hmac, true);
  });

  test("generates hash with very long input", async () => {
    const longInput = "a".repeat(1000);
    const result = await hashGeneratorHandler(longInput, { algorithm: "sha256" });
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.output?.length, 64);
  });

  test("generates hash with special characters", async () => {
    const result = await hashGeneratorHandler("Hello!@#$%^&*() World", { algorithm: "sha256" });
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.output?.length, 64);
  });

  test("uses unknown hash algorithm with default fallback", async () => {
    const result = await hashGeneratorHandler("Hello World", {
      algorithm: "unknown" as "sha256",
    });
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.output?.length, 64);
  });

  test("uses unknown HMAC algorithm with default fallback", async () => {
    const result = await hashGeneratorHandler("Hello World", {
      algorithm: "unknown" as "sha256",
      secret: "secret",
    });
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.metadata?.algorithm, "HMAC-UNKNOWN");
  });
});
