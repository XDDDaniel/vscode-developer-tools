import type { DateTimeOptions, ToolResult } from "../../types/index";

const formatDate = (date: Date, format: string): string => {
  switch (format) {
    case "ISO 8601": {
      return date.toISOString();
    }
    case "RFC 1123": {
      return date.toUTCString();
    }
    case "RFC 2822": {
      return date.toUTCString().replace(/GMT/, "UTC");
    }
    case "YYYY-MM-DD": {
      return date.toISOString().split("T")[0];
    }
    case "DD/MM/YYYY": {
      const d = date.getDate().toString().padStart(2, "0");
      const m = (date.getMonth() + 1).toString().padStart(2, "0");
      const y = date.getFullYear();
      return `${d}/${m}/${y}`;
    }
    case "MM/DD/YYYY": {
      const d2 = date.getDate().toString().padStart(2, "0");
      const m2 = (date.getMonth() + 1).toString().padStart(2, "0");
      const y2 = date.getFullYear();
      return `${m2}/${d2}/${y2}`;
    }
    default: {
      return date.toISOString();
    }
  }
};

export const datetimeConverterHandler = async (
  input: string,
  options?: DateTimeOptions,
): Promise<ToolResult> => {
  try {
    const format = options?.format || "ISO 8601";
    let result = "";
    let metadata: Record<string, unknown> = {};

    let date: Date;

    if (!input.trim()) {
      date = new Date();
    } else {
      const trimmedInput = input.trim();
      const timestamp = Number(trimmedInput);

      if (!Number.isNaN(timestamp) && trimmedInput === timestamp.toString()) {
        const isMs = trimmedInput.length > 10;
        date = isMs ? new Date(timestamp) : new Date(timestamp * 1000);
      } else {
        date = new Date(trimmedInput);
        if (Number.isNaN(date.getTime())) {
          return { error: "Invalid date or timestamp", success: false };
        }
      }
    }

    if (format === "Unix (ms)") {
      result = date.getTime().toString();
    } else if (format === "Unix (sec)") {
      result = Math.floor(date.getTime() / 1000).toString();
    } else {
      result = formatDate(date, format);
    }

    metadata = {
      formats: {
        "DD/MM/YYYY": formatDate(date, "DD/MM/YYYY"),
        "ISO 8601": date.toISOString(),
        "MM/DD/YYYY": formatDate(date, "MM/DD/YYYY"),
        "RFC 1123": date.toUTCString(),
        "RFC 2822": date.toUTCString().replace(/GMT/, "UTC"),
        "Unix (ms)": date.getTime().toString(),
        "Unix (sec)": Math.floor(date.getTime() / 1000).toString(),
        "YYYY-MM-DD": date.toISOString().split("T")[0],
      },
      unixMs: date.getTime(),
      unixSec: Math.floor(date.getTime() / 1000),
    };

    return {
      metadata,
      output: result,
      success: true,
    };
  } catch (error: unknown) {
    return {
      error: error instanceof Error ? error.message : "An error occurred",
      success: false,
    };
  }
};
