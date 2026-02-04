import * as assert from "node:assert";

import {
  barcodeGenerateHandler,
  loremGenerateHandler,
  nanoidGenerateHandler,
  passwordGenerateHandler,
  qrcodeGenerateHandler,
  ulidGenerateHandler,
  uuidGenerateHandler,
} from "../tools/generators/generators";

suite("Generator Tools", () => {
  suite("uuidGenerateHandler", () => {
    test("generates v4 UUIDs", async () => {
      const result = await uuidGenerateHandler("", { version: "4" });
      assert.strictEqual(result.success, true);
      const uuids = (result.output ?? "").split("\n");
      assert.strictEqual(uuids.length, 1);
      assert.ok(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(uuids[0]),
      );
    });

    test("generates v1 UUIDs", async () => {
      const result = await uuidGenerateHandler("", { version: "1" });
      assert.strictEqual(result.success, true);
      const uuids = (result.output ?? "").split("\n");
      assert.strictEqual(uuids.length, 1);
      assert.ok(
        /^[0-9a-f]{8}-[0-9a-f]{4}-1[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(uuids[0]),
      );
    });

    test("generates multiple UUIDs", async () => {
      const result = await uuidGenerateHandler("", { count: 5, version: "4" });
      assert.strictEqual(result.success, true);
      const uuids = (result.output ?? "").split("\n");
      assert.strictEqual(uuids.length, 5);
      for (const uuid of uuids) {
        assert.ok(
          /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(uuid),
        );
      }
    });

    test("generates unique UUIDs", async () => {
      const result = await uuidGenerateHandler("", { count: 100, version: "4" });
      assert.strictEqual(result.success, true);
      const uuids = (result.output ?? "").split("\n");
      const unique = new Set(uuids);
      assert.strictEqual(unique.size, 100);
    });
  });

  suite("ulidGenerateHandler", () => {
    test("generates ULID", async () => {
      const result = await ulidGenerateHandler("");
      assert.strictEqual(result.success, true);
      const ulids = (result.output ?? "").split("\n");
      assert.strictEqual(ulids.length, 1);
      assert.ok(/^[0-9A-HJKMNP-TV-Z]{26}$/.test(ulids[0]));
    });

    test("generates multiple ULIDs", async () => {
      const result = await ulidGenerateHandler("", { count: 5 });
      assert.strictEqual(result.success, true);
      const ulids = (result.output ?? "").split("\n");
      assert.strictEqual(ulids.length, 5);
    });

    test("generates unique ULIDs", async () => {
      const result = await ulidGenerateHandler("", { count: 100 });
      assert.strictEqual(result.success, true);
      const ulids = (result.output ?? "").split("\n");
      const unique = new Set(ulids);
      assert.strictEqual(unique.size, 100);
    });
  });

  suite("nanoidGenerateHandler", () => {
    test("generates NanoID with default length", async () => {
      const result = await nanoidGenerateHandler("");
      assert.strictEqual(result.success, true);
      const ids = (result.output ?? "").split("\n");
      assert.strictEqual(ids.length, 1);
      assert.strictEqual(ids[0].length, 21);
    });

    test("generates NanoID with custom length", async () => {
      const result = await nanoidGenerateHandler("", { length: 10 });
      assert.strictEqual(result.success, true);
      const ids = (result.output ?? "").split("\n");
      assert.strictEqual(ids[0].length, 10);
    });

    test("generates multiple NanoIDs", async () => {
      const result = await nanoidGenerateHandler("", { count: 5, length: 10 });
      assert.strictEqual(result.success, true);
      const ids = (result.output ?? "").split("\n");
      assert.strictEqual(ids.length, 5);
      for (const id of ids) {
        assert.strictEqual(id.length, 10);
      }
    });

    test("generates unique NanoIDs", async () => {
      const result = await nanoidGenerateHandler("", { count: 100, length: 21 });
      assert.strictEqual(result.success, true);
      const ids = (result.output ?? "").split("\n");
      const unique = new Set(ids);
      assert.strictEqual(unique.size, 100);
    });

    test("generates NanoID with custom alphabet", async () => {
      const result = await nanoidGenerateHandler("", { alphabet: "ABC", length: 10 });
      assert.strictEqual(result.success, true);
      const id = result.output ?? "";
      assert.strictEqual(id.length, 10);
      assert.ok(/^[ABC]+$/.test(id));
    });
  });

  suite("passwordGenerateHandler", () => {
    test("generates password with default settings", async () => {
      const result = await passwordGenerateHandler("");
      assert.strictEqual(result.success, true);
      const passwords = (result.output ?? "").split("\n");
      assert.strictEqual(passwords.length, 1);
      assert.strictEqual(passwords[0].length, 16);
    });

    test("generates password with custom length", async () => {
      const result = await passwordGenerateHandler("", { length: 32 });
      assert.strictEqual(result.success, true);
      const passwords = (result.output ?? "").split("\n");
      assert.strictEqual(passwords[0].length, 32);
    });

    test("generates multiple passwords", async () => {
      const result = await passwordGenerateHandler("", { count: 5, length: 16 });
      assert.strictEqual(result.success, true);
      const passwords = (result.output ?? "").split("\n");
      assert.strictEqual(passwords.length, 5);
    });

    test("generates unique passwords", async () => {
      const result = await passwordGenerateHandler("", { count: 50, length: 16 });
      assert.strictEqual(result.success, true);
      const passwords = (result.output ?? "").split("\n");
      const unique = new Set(passwords);
      assert.strictEqual(unique.size, 50);
    });

    test("generates password without numbers", async () => {
      const result = await passwordGenerateHandler("", { length: 20, numbers: false });
      assert.strictEqual(result.success, true);
      const password = result.output ?? "";
      assert.ok(!/\d/.test(password));
    });

    test("generates password without symbols", async () => {
      const result = await passwordGenerateHandler("", { length: 20, symbols: false });
      assert.strictEqual(result.success, true);
      const password = result.output ?? "";
      assert.ok(!/[!@#$%^&*(),.?":{}|<>]/.test(password));
    });

    test("generates password with excluded characters", async () => {
      const result = await passwordGenerateHandler("", { exclude: "01lI", length: 20 });
      assert.strictEqual(result.success, true);
      const password = result.output ?? "";
      assert.ok(!password.includes("0"));
      assert.ok(!password.includes("1"));
      assert.ok(!password.includes("l"));
      assert.ok(!password.includes("I"));
    });

    test("generates password without uppercase", async () => {
      const result = await passwordGenerateHandler("", { length: 20, uppercase: false });
      assert.strictEqual(result.success, true);
      const password = result.output ?? "";
      assert.ok(!/[A-Z]/.test(password));
    });

    test("generates password without lowercase", async () => {
      const result = await passwordGenerateHandler("", { length: 20, lowercase: false });
      assert.strictEqual(result.success, true);
      const password = result.output ?? "";
      assert.ok(!/[a-z]/.test(password));
    });

    test("generates password with excludeSimilar option disabled", async () => {
      const result = await passwordGenerateHandler("", { excludeSimilar: false, length: 20 });
      assert.strictEqual(result.success, true);
      assert.ok(result.output);
    });
  });

  suite("loremGenerateHandler", () => {
    test("generates words", async () => {
      const result = await loremGenerateHandler("", { count: 10, type: "words" });
      assert.strictEqual(result.success, true);
      const words = (result.output ?? "").split(" ");
      assert.ok(words.length <= 10);
    });

    test("generates sentences", async () => {
      const result = await loremGenerateHandler("", { count: 3, type: "sentences" });
      assert.strictEqual(result.success, true);
      const sentences = (result.output ?? "").split(". ");
      assert.ok(sentences.length >= 2);
    });

    test("generates paragraphs", async () => {
      const result = await loremGenerateHandler("", { count: 3, type: "paragraphs" });
      assert.strictEqual(result.success, true);
      assert.ok((result.output ?? "").length > 100);
    });

    test("generates lorem with count of 1", async () => {
      const result = await loremGenerateHandler("", { count: 1, type: "sentences" });
      assert.strictEqual(result.success, true);
      assert.ok(result.output);
    });
  });

  suite("qrcodeGenerateHandler", () => {
    test("generates QR code from text", async () => {
      const result = await qrcodeGenerateHandler("Hello World");
      assert.strictEqual(result.success, true);
      assert.ok(result.output?.startsWith("data:image/png;base64,"));
      assert.strictEqual(result.metadata?.format, "PNG (Data URL)");
      assert.strictEqual(result.metadata?.size, 300);
    });

    test("returns error for empty input", async () => {
      const result = await qrcodeGenerateHandler("");
      assert.strictEqual(result.success, false);
      assert.strictEqual(result.error, "Input text is required");
    });

    test("generates QR code with custom size", async () => {
      const result = await qrcodeGenerateHandler("Test", { size: 500 });
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.metadata?.size, 500);
    });

    test("generates QR code with custom colors", async () => {
      const result = await qrcodeGenerateHandler("Test", {
        colorDark: "#FF0000",
        colorLight: "#00FF00",
      });
      assert.strictEqual(result.success, true);
      assert.ok(result.output?.startsWith("data:image/png;base64,"));
    });
  });

  suite("barcodeGenerateHandler", () => {
    test("generates barcode from text", async () => {
      const result = await barcodeGenerateHandler("123456");
      assert.strictEqual(result.success, true);
      assert.ok(result.output?.startsWith("data:image/png;base64,"));
      assert.strictEqual(result.metadata?.format, "code128");
    });

    test("returns error for empty input", async () => {
      const result = await barcodeGenerateHandler("");
      assert.strictEqual(result.success, false);
      assert.strictEqual(result.error, "Input text is required");
    });

    test("generates barcode with custom format", async () => {
      const result = await barcodeGenerateHandler("123456789012", { format: "ean13" });
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.metadata?.format, "ean13");
    });

    test("generates barcode with custom height", async () => {
      const result = await barcodeGenerateHandler("1234", { height: 20 });
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.metadata?.height, 20);
    });

    test("generates barcode with custom scale", async () => {
      const result = await barcodeGenerateHandler("1234", { scale: 5 });
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.metadata?.scale, 5);
    });

    test("generates barcode with center text alignment", async () => {
      const result = await barcodeGenerateHandler("1234", { textAlign: "center" });
      assert.strictEqual(result.success, true);
      assert.ok(result.output?.startsWith("data:image/png;base64,"));
    });

    test("generates barcode with includeText disabled", async () => {
      const result = await barcodeGenerateHandler("1234", { includeText: false });
      assert.strictEqual(result.success, true);
      assert.ok(result.output?.startsWith("data:image/png;base64,"));
    });
  });
});
