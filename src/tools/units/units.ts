import type { ToolResult, UnitsOptions } from "../../types/index";

const DATA_UNITS: Record<string, number> = {
  B: 1,
  EB: 1_152_921_504_606_847_000,
  GB: 1_073_741_824,
  KB: 1024,
  MB: 1_048_576,
  PB: 1_125_899_906_842_624,
  TB: 1_099_511_627_776,
};

const TIME_UNITS: Record<string, number> = {
  d: 86_400_000,
  h: 3_600_000,
  m: 60_000,
  ms: 1,
  s: 1000,
  w: 604_800_000,
  y: 31_536_000_000,
};

const TRANSFER_UNITS: Record<string, number> = {
  "GB/s": 1_073_741_824,
  "MB/s": 1_048_576,
  bps: 1,
  gbps: 1_000_000_000,
  "kB/s": 1024,
  kbps: 1000,
  mbps: 1_000_000,
};

const LENGTH_UNITS: Record<string, number> = {
  cm: 0.01,
  ft: 0.3048,
  in: 0.0254,
  km: 1000,
  m: 1,
  mi: 1609.344,
  mm: 0.001,
  yd: 0.9144,
};

const WEIGHT_UNITS: Record<string, number> = {
  g: 1,
  kg: 1000,
  lb: 453.592_37,
  mg: 0.001,
  oz: 28.349_523_125,
  t: 1_000_000,
};

const convertWithFactors = (
  value: number,
  from: string,
  to: string,
  units: Record<string, number>,
): number => {
  const fromFactor = units[from] || 1;
  const toFactor = units[to] || 1;
  return (value * fromFactor) / toFactor;
};

const convertTemperature = (value: number, from: string, to: string): number => {
  if (from === to) {
    return value;
  }
  if (from === "C" && to === "F") {
    return (value * 9) / 5 + 32;
  }
  if (from === "C" && to === "K") {
    return value + 273.15;
  }
  if (from === "F" && to === "C") {
    return ((value - 32) * 5) / 9;
  }
  if (from === "F" && to === "K") {
    return ((value - 32) * 5) / 9 + 273.15;
  }
  if (from === "K" && to === "C") {
    return value - 273.15;
  }
  if (from === "K" && to === "F") {
    return ((value - 273.15) * 9) / 5 + 32;
  }
  return value;
};

const createMetadata = (
  categoryLabel: string,
  value: number,
  result: number,
  from: string,
  to: string,
): Record<string, unknown> => ({
  category: categoryLabel,
  convertedValue: result,
  from,
  originalValue: value,
  to,
});

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
    let metadata: Record<string, unknown>;

    switch (category) {
      case "bytes": {
        result = convertWithFactors(value, from, to, DATA_UNITS);
        metadata = createMetadata("Data", value, result, from, to);
        break;
      }

      case "time": {
        result = convertWithFactors(value, from, to, TIME_UNITS);
        metadata = createMetadata("Time", value, result, from, to);
        break;
      }

      case "transfer": {
        result = convertWithFactors(value, from, to, TRANSFER_UNITS);
        metadata = createMetadata("Transfer Rate", value, result, from, to);
        break;
      }

      case "temperature": {
        result = convertTemperature(value, from, to);
        metadata = createMetadata("Temperature", value, result, from, to);
        break;
      }

      case "length": {
        result = convertWithFactors(value, from, to, LENGTH_UNITS);
        metadata = createMetadata("Length", value, result, from, to);
        break;
      }

      case "weight": {
        result = convertWithFactors(value, from, to, WEIGHT_UNITS);
        metadata = createMetadata("Weight", value, result, from, to);
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
