import * as assert from "node:assert";

import { unitsConvertHandler } from "../tools/units/units";

suite("Units Tools", () => {
  suite("unitsConvertHandler - Bytes", () => {
    test("converts bytes to kilobytes", async () => {
      const result = await unitsConvertHandler("1024", { category: "bytes", from: "B", to: "KB" });
      assert.strictEqual(result.success, true);
      assert.ok(result.output?.includes("1"));
    });

    test("converts kilobytes to megabytes", async () => {
      const result = await unitsConvertHandler("1024", { category: "bytes", from: "KB", to: "MB" });
      assert.strictEqual(result.success, true);
      assert.ok(result.output?.includes("1"));
    });

    test("converts megabytes to gigabytes", async () => {
      const result = await unitsConvertHandler("1024", { category: "bytes", from: "MB", to: "GB" });
      assert.strictEqual(result.success, true);
      assert.ok(result.output?.includes("1"));
    });

    test("converts gigabytes to terabytes", async () => {
      const result = await unitsConvertHandler("1024", { category: "bytes", from: "GB", to: "TB" });
      assert.strictEqual(result.success, true);
      assert.ok(result.output?.includes("1"));
    });

    test("handles decimal values", async () => {
      const result = await unitsConvertHandler("2048", { category: "bytes", from: "B", to: "KB" });
      assert.strictEqual(result.success, true);
      assert.ok(result.output?.includes("2"));
    });
  });

  suite("unitsConvertHandler - Length", () => {
    test("converts meters to kilometers", async () => {
      const result = await unitsConvertHandler("1000", { category: "length", from: "m", to: "km" });
      assert.strictEqual(result.success, true);
      assert.ok(result.output?.includes("1"));
    });

    test("converts kilometers to meters", async () => {
      const result = await unitsConvertHandler("1", { category: "length", from: "km", to: "m" });
      assert.strictEqual(result.success, true);
      assert.ok(result.output?.includes("1000"));
    });

    test("converts centimeters to meters", async () => {
      const result = await unitsConvertHandler("100", { category: "length", from: "cm", to: "m" });
      assert.strictEqual(result.success, true);
      assert.ok(result.output?.includes("1"));
    });

    test("converts feet to meters", async () => {
      const result = await unitsConvertHandler("1", { category: "length", from: "ft", to: "m" });
      assert.strictEqual(result.success, true);
      assert.ok(result.output?.includes("0.3048"));
    });

    test("converts inches to centimeters", async () => {
      const result = await unitsConvertHandler("1", { category: "length", from: "in", to: "cm" });
      assert.strictEqual(result.success, true);
      assert.ok(result.output?.includes("2.54"));
    });
  });

  suite("unitsConvertHandler - Weight", () => {
    test("converts kilograms to grams", async () => {
      const result = await unitsConvertHandler("1", { category: "weight", from: "kg", to: "g" });
      assert.strictEqual(result.success, true);
      assert.ok(result.output?.includes("1000"));
    });

    test("converts grams to kilograms", async () => {
      const result = await unitsConvertHandler("1000", { category: "weight", from: "g", to: "kg" });
      assert.strictEqual(result.success, true);
      assert.ok(result.output?.includes("1"));
    });

    test("converts pounds to kilograms", async () => {
      const result = await unitsConvertHandler("1", { category: "weight", from: "lb", to: "kg" });
      assert.strictEqual(result.success, true);
      assert.ok(result.output?.includes("0.453"));
    });

    test("converts ounces to grams", async () => {
      const result = await unitsConvertHandler("1", { category: "weight", from: "oz", to: "g" });
      assert.strictEqual(result.success, true);
      assert.ok(result.output?.includes("28.349"));
    });
  });

  suite("unitsConvertHandler - Temperature", () => {
    test("converts celsius to fahrenheit", async () => {
      const result = await unitsConvertHandler("0", {
        category: "temperature",
        from: "C",
        to: "F",
      });
      assert.strictEqual(result.success, true);
      assert.ok(result.output?.includes("32"));
    });

    test("converts celsius to kelvin", async () => {
      const result = await unitsConvertHandler("0", {
        category: "temperature",
        from: "C",
        to: "K",
      });
      assert.strictEqual(result.success, true);
      assert.ok(result.output?.includes("273.15"));
    });

    test("converts fahrenheit to celsius", async () => {
      const result = await unitsConvertHandler("32", {
        category: "temperature",
        from: "F",
        to: "C",
      });
      assert.strictEqual(result.success, true);
      assert.ok(result.output?.includes("0"));
    });

    test("converts kelvin to celsius", async () => {
      const result = await unitsConvertHandler("273.15", {
        category: "temperature",
        from: "K",
        to: "C",
      });
      assert.strictEqual(result.success, true);
      assert.ok(result.output?.includes("0"));
    });

    test("converts fahrenheit to kelvin", async () => {
      const result = await unitsConvertHandler("32", {
        category: "temperature",
        from: "F",
        to: "K",
      });
      assert.strictEqual(result.success, true);
      assert.ok(result.output?.includes("273.15"));
    });

    test("converts kelvin to fahrenheit", async () => {
      const result = await unitsConvertHandler("273.15", {
        category: "temperature",
        from: "K",
        to: "F",
      });
      assert.strictEqual(result.success, true);
      assert.ok(result.output?.includes("32"));
    });

    test("handles same temperature unit conversion", async () => {
      const result = await unitsConvertHandler("100", {
        category: "temperature",
        from: "C",
        to: "C",
      });
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.output, "100");
    });

    test("handles temperature conversion with fahrenheit to fahrenheit", async () => {
      const result = await unitsConvertHandler("212", {
        category: "temperature",
        from: "F",
        to: "F",
      });
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.output, "212");
    });

    test("handles temperature conversion with kelvin to kelvin", async () => {
      const result = await unitsConvertHandler("300", {
        category: "temperature",
        from: "K",
        to: "K",
      });
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.output, "300");
    });
  });

  suite("unitsConvertHandler - Time", () => {
    test("converts milliseconds to seconds", async () => {
      const result = await unitsConvertHandler("1000", { category: "time", from: "ms", to: "s" });
      assert.strictEqual(result.success, true);
      assert.ok(result.output?.includes("1"));
    });

    test("converts seconds to minutes", async () => {
      const result = await unitsConvertHandler("60", { category: "time", from: "s", to: "m" });
      assert.strictEqual(result.success, true);
      assert.ok(result.output?.includes("1"));
    });

    test("converts minutes to hours", async () => {
      const result = await unitsConvertHandler("60", { category: "time", from: "m", to: "h" });
      assert.strictEqual(result.success, true);
      assert.ok(result.output?.includes("1"));
    });

    test("converts hours to days", async () => {
      const result = await unitsConvertHandler("24", { category: "time", from: "h", to: "d" });
      assert.strictEqual(result.success, true);
      assert.ok(result.output?.includes("1"));
    });

    test("converts days to weeks", async () => {
      const result = await unitsConvertHandler("7", { category: "time", from: "d", to: "w" });
      assert.strictEqual(result.success, true);
      assert.ok(result.output?.includes("1"));
    });

    test("converts weeks to years", async () => {
      const result = await unitsConvertHandler("52", { category: "time", from: "w", to: "y" });
      assert.strictEqual(result.success, true);
      assert.ok(result.output?.includes("0.99"));
    });
  });

  suite("unitsConvertHandler - Transfer Rate", () => {
    test("converts bps to kbps", async () => {
      const result = await unitsConvertHandler("1000", {
        category: "transfer",
        from: "bps",
        to: "kbps",
      });
      assert.strictEqual(result.success, true);
      assert.ok(result.output?.includes("1"));
    });

    test("converts kbps to mbps", async () => {
      const result = await unitsConvertHandler("1000", {
        category: "transfer",
        from: "kbps",
        to: "mbps",
      });
      assert.strictEqual(result.success, true);
      assert.ok(result.output?.includes("1"));
    });

    test("converts mbps to gbps", async () => {
      const result = await unitsConvertHandler("1000", {
        category: "transfer",
        from: "mbps",
        to: "gbps",
      });
      assert.strictEqual(result.success, true);
      assert.ok(result.output?.includes("1"));
    });

    test("converts bytes/s to KB/s", async () => {
      const result = await unitsConvertHandler("1024", {
        category: "transfer",
        from: "B/s",
        to: "kB/s",
      });
      assert.strictEqual(result.success, true);
      assert.ok(result.output?.includes("1"));
    });

    test("converts KB/s to MB/s", async () => {
      const result = await unitsConvertHandler("1024", {
        category: "transfer",
        from: "kB/s",
        to: "MB/s",
      });
      assert.strictEqual(result.success, true);
      assert.ok(result.output?.includes("1"));
    });
  });

  test("handles missing from unit", async () => {
    const result = await unitsConvertHandler("1", { category: "bytes", from: "", to: "KB" });
    assert.strictEqual(result.success, false);
    assert.ok(result.error);
  });

  test("handles missing to unit", async () => {
    const result = await unitsConvertHandler("1", { category: "bytes", from: "B", to: "" });
    assert.strictEqual(result.success, false);
    assert.ok(result.error);
  });

  test("handles invalid numeric input", async () => {
    const result = await unitsConvertHandler("not a number", {
      category: "bytes",
      from: "B",
      to: "KB",
    });
    assert.strictEqual(result.success, false);
    assert.ok(result.error);
  });

  test("handles unsupported category", async () => {
    const result = await unitsConvertHandler("1", { category: "unsupported", from: "x", to: "y" });
    assert.strictEqual(result.success, false);
    assert.ok(result.error);
  });

  test("handles length conversion with miles to meters", async () => {
    const result = await unitsConvertHandler("1", { category: "length", from: "mi", to: "m" });
    assert.strictEqual(result.success, true);
    assert.ok(result.output?.includes("1609.344"));
  });

  test("handles weight conversion with tons", async () => {
    const result = await unitsConvertHandler("1", { category: "weight", from: "t", to: "g" });
    assert.strictEqual(result.success, true);
    assert.ok(result.output?.includes("1000000"));
  });
});
