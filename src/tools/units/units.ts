import type { ToolResult, UnitsOptions } from "../../types/index";

export const unitsConvertHandler = async (
  input: string,
  options?: UnitsOptions,
): Promise<ToolResult> => {
  try {
    const category = options?.category || "bytes";
    const from = options?.from;
    const to = options?.to;
    const value = Number.parseFloat(input);

    if (Number.isNaN(value)) {
      return { error: "Invalid input value", success: false };
    }

    if (!from || !to) {
      return { error: "From and to units are required", success: false };
    }

    let result: number;
    let metadata: Record<string, unknown> = {};

    switch (category) {
      case "bytes": {
        const dataUnits: Record<string, number> = {
          B: 1,
          EB: 1_152_921_504_606_847_000,
          GB: 1_073_741_824,
          KB: 1024,
          MB: 1_048_576,
          PB: 1_125_899_906_842_624,
          TB: 1_099_511_627_776,
        };
        const fromFactor = dataUnits[from] || 1;
        const toFactor = dataUnits[to] || 1;
        result = (value * fromFactor) / toFactor;
        metadata = {
          category: "Data",
          convertedValue: result,
          from,
          originalValue: value,
          to,
        };
        break;
      }

      case "time": {
        const timeUnits: Record<string, number> = {
          d: 86_400_000,
          h: 3_600_000,
          m: 60_000,
          ms: 1,
          s: 1000,
          w: 604_800_000,
          y: 31_536_000_000,
        };
        const timeFromFactor = timeUnits[from] || 1;
        const timeToFactor = timeUnits[to] || 1;
        result = (value * timeFromFactor) / timeToFactor;
        metadata = {
          category: "Time",
          convertedValue: result,
          from,
          originalValue: value,
          to,
        };
        break;
      }

      case "transfer": {
        const transferUnits: Record<string, number> = {
          "GB/s": 1_073_741_824,
          "MB/s": 1_048_576,
          bps: 1,
          gbps: 1_000_000_000,
          "kB/s": 1024,
          kbps: 1000,
          mbps: 1_000_000,
        };
        const transferFromFactor = transferUnits[from] || 1;
        const transferToFactor = transferUnits[to] || 1;
        result = (value * transferFromFactor) / transferToFactor;
        metadata = {
          category: "Transfer Rate",
          convertedValue: result,
          from,
          originalValue: value,
          to,
        };
        break;
      }

      case "temperature": {
        if (from === "C" && to === "F") {
          result = (value * 9) / 5 + 32;
        } else if (from === "C" && to === "K") {
          result = value + 273.15;
        } else if (from === "F" && to === "C") {
          result = ((value - 32) * 5) / 9;
        } else if (from === "F" && to === "K") {
          result = ((value - 32) * 5) / 9 + 273.15;
        } else if (from === "K" && to === "C") {
          result = value - 273.15;
        } else if (from === "K" && to === "F") {
          result = ((value - 273.15) * 9) / 5 + 32;
        } else {
          result = value;
        }
        metadata = {
          category: "Temperature",
          convertedValue: result,
          from,
          originalValue: value,
          to,
        };
        break;
      }

      case "length": {
        const lengthUnits: Record<string, number> = {
          cm: 0.01,
          ft: 0.3048,
          in: 0.0254,
          km: 1000,
          m: 1,
          mi: 1609.344,
          mm: 0.001,
          yd: 0.9144,
        };
        const lengthFromFactor = lengthUnits[from] || 1;
        const lengthToFactor = lengthUnits[to] || 1;
        result = (value * lengthFromFactor) / lengthToFactor;
        metadata = {
          category: "Length",
          convertedValue: result,
          from,
          originalValue: value,
          to,
        };
        break;
      }

      case "weight": {
        const weightUnits: Record<string, number> = {
          g: 1,
          kg: 1000,
          lb: 453.592_37,
          mg: 0.001,
          oz: 28.349_523_125,
          t: 1_000_000,
        };
        const weightFromFactor = weightUnits[from] || 1;
        const weightToFactor = weightUnits[to] || 1;
        result = (value * weightFromFactor) / weightToFactor;
        metadata = {
          category: "Weight",
          convertedValue: result,
          from,
          originalValue: value,
          to,
        };
        break;
      }

      default: {
        return { error: `Unsupported category: ${category}`, success: false };
      }
    }

    return {
      metadata,
      output: String(result),
      success: true,
    };
  } catch (error: unknown) {
    return {
      error: error instanceof Error ? error.message : "An error occurred",
      success: false,
    };
  }
};
