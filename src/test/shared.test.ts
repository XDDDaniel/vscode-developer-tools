import * as assert from "node:assert";

import {
  escapeHtml,
  base64Encode,
  base64Decode,
  hexEncode,
  hexDecode,
  formatBytes,
  generatePassword,
} from "../utils/shared";

suite("Shared Utilities", () => {
  suite("escapeHtml", () => {
    test("escapes HTML special characters", () => {
      const input = "<script>alert(\"test & 'value'\")</script>";
      const result = escapeHtml(input);
      assert.ok(result.includes("&lt;script&gt;"));
      assert.ok(result.includes("&quot;"));
      assert.ok(result.includes("&amp;"));
      assert.ok(result.includes("&#039;"));
      assert.ok(result.includes("&gt;"));
    });

    test("handles empty string", () => {
      const result = escapeHtml("");
      assert.strictEqual(result, "");
    });

    test("handles string with no special characters", () => {
      const result = escapeHtml("hello world");
      assert.strictEqual(result, "hello world");
    });
  });

  suite("base64Encode", () => {
    test("encodes string to base64 standard format", () => {
      const result = base64Encode("hello world");
      assert.strictEqual(result, "aGVsbG8gd29ybGQ=");
    });

    test("encodes string to base64url format", () => {
      const result = base64Encode("hello world", "url");
      assert.strictEqual(result, "aGVsbG8gd29ybGQ");
      assert.ok(!result.includes("+"));
      assert.ok(!result.includes("/"));
      assert.ok(!result.includes("="));
    });

    test("encodes string to base64 mime format", () => {
      const longText = "a".repeat(200);
      const result = base64Encode(longText, "mime");
      assert.ok(result.includes("\n"));
    });
  });

  suite("base64Decode", () => {
    test("decodes base64 standard format", () => {
      const result = base64Decode("aGVsbG8gd29ybGQ=");
      assert.strictEqual(result, "hello world");
    });

    test("decodes base64url format", () => {
      const result = base64Decode("aGVsbG8gd29ybGQ", "url");
      assert.strictEqual(result, "hello world");
    });

    test("decodes base64 mime format", () => {
      const result = base64Decode("aGVsbG8gd29ybGQ=", "mime");
      assert.strictEqual(result, "hello world");
    });
  });

  suite("hexEncode", () => {
    test("encodes string to hex", () => {
      const result = hexEncode("hello");
      assert.strictEqual(result, "68656c6c6f");
    });

    test("handles empty string", () => {
      const result = hexEncode("");
      assert.strictEqual(result, "");
    });
  });

  suite("hexDecode", () => {
    test("decodes hex string", () => {
      const result = hexDecode("68656c6c6f");
      assert.strictEqual(result, "hello");
    });

    test("handles hex with spaces", () => {
      const result = hexDecode("68 65 6c 6c 6f");
      assert.strictEqual(result, "hello");
    });

    test("handles empty hex string", () => {
      const result = hexDecode("");
      assert.strictEqual(result, "");
    });
  });

  suite("formatBytes", () => {
    test("formats zero bytes", () => {
      const result = formatBytes(0);
      assert.strictEqual(result, "0 Bytes");
    });

    test("formats bytes to KB", () => {
      const result = formatBytes(1024);
      assert.strictEqual(result, "1 KB");
    });

    test("formats bytes to MB", () => {
      const result = formatBytes(1_048_576);
      assert.strictEqual(result, "1 MB");
    });

    test("formats bytes to GB", () => {
      const result = formatBytes(1_073_741_824);
      assert.strictEqual(result, "1 GB");
    });

    test("formats bytes with custom decimal places", () => {
      const result = formatBytes(2048, 3);
      assert.strictEqual(result, "2 KB");
    });

    test("handles negative decimals by setting to 0", () => {
      const result = formatBytes(1024, -1);
      assert.strictEqual(result, "1 KB");
    });
  });

  suite("generatePassword", () => {
    test("generates password with default settings", () => {
      let foundNumber = false;
      let result = "";
      for (let i = 0; i < 100; i += 1) {
        result = generatePassword();
        if (/[23456789]/.test(result)) {
          foundNumber = true;
          break;
        }
      }
      assert.strictEqual(result.length, 16);
      assert.ok(/[A-Z]/.test(result));
      assert.ok(/[a-z]/.test(result));
      assert.ok(foundNumber, "At least one password should contain a number");
      assert.ok(/[!@#$%^&*()\-_=+[\]{}|;:,.<>?]/.test(result));
    });

    test("generates password with custom length", () => {
      const result = generatePassword(32);
      assert.strictEqual(result.length, 32);
    });

    test("generates password without numbers", () => {
      const result = generatePassword(16, { numbers: false });
      assert.ok(/^[a-zA-Z!@#$%^&*()\-_=+[\]{}|;:,.<>?]+$/.test(result));
    });

    test("generates password without symbols", () => {
      const result = generatePassword(16, { symbols: false });
      assert.ok(/^[a-zA-Z0-9]+$/.test(result));
    });

    test("generates password without uppercase", () => {
      const result = generatePassword(16, { uppercase: false });
      assert.ok(/^[a-z0-9!@#$%^&*()\-_=+[\]{}|;:,.<>?]+$/.test(result));
    });

    test("generates password without lowercase", () => {
      const result = generatePassword(16, { lowercase: false });
      assert.ok(/^[A-Z0-9!@#$%^&*()\-_=+[\]{}|;:,.<>?]+$/.test(result));
    });

    test("generates password with excluded characters", () => {
      const result = generatePassword(50, { exclude: "aeiou" });
      assert.ok(!/[aeiou]/.test(result));
    });

    test("generates password without excluding similar characters", () => {
      const _result = generatePassword(50, { excludeSimilar: false });
    });

    test("generates password when all options are disabled", () => {
      const result = generatePassword(16, {
        excludeSimilar: false,
        lowercase: false,
        numbers: false,
        symbols: false,
        uppercase: false,
      });
      assert.strictEqual(result.length, 16);
    });
  });
});
