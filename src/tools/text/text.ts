import type { TextOptions, ToolResult } from "../../types/index";
import yaml from "js-yaml";

export const textCaseHandler = async (
  input: string,
  options?: TextOptions,
): Promise<ToolResult> => {
  try {
    const type = options?.type || "upper";
    let result: string;

    switch (type) {
      case "upper": {
        result = input.toUpperCase();
        break;
      }
      case "lower": {
        result = input.toLowerCase();
        break;
      }
      case "title": {
        result = input.replace(
          /\w\S*/g,
          (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(),
        );
        break;
      }
      case "sentence": {
        result = input.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
        break;
      }
      case "camel": {
        result = input.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
        break;
      }
      case "snake": {
        result = input
          .replace(/([a-z])([A-Z])/g, "$1_$2")
          .replace(/[\s-]+/g, "_")
          .toLowerCase();
        break;
      }
      case "kebab": {
        result = input
          .replace(/([a-z])([A-Z])/g, "$1-$2")
          .replace(/[\s_]+/g, "-")
          .toLowerCase();
        break;
      }
      case "reverse": {
        result = [...input].toReversed().join("");
        break;
      }
      default: {
        result = input;
      }
    }

    return {
      metadata: {
        inputLength: input.length,
        outputLength: result.length,
        transformation: type,
      },
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

export const textSortHandler = async (
  input: string,
  options?: TextOptions,
): Promise<ToolResult> => {
  try {
    const order = options?.order || "asc";
    const mode = options?.mode || "line";

    const lines = input.split("\n");

    let sorted: string[];
    switch (mode) {
      case "line": {
        sorted = lines.toSorted((a, b) => {
          if (order === "asc") {
            return a.localeCompare(b);
          } else {
            return b.localeCompare(a);
          }
        });
        break;
      }
      case "numeric": {
        sorted = lines.toSorted((a, b) => {
          const numA = Number.parseFloat(a) || 0;
          const numB = Number.parseFloat(b) || 0;
          return order === "asc" ? numA - numB : numB - numA;
        });
        break;
      }
      case "length": {
        sorted = lines.toSorted((a, b) => {
          if (order === "asc") {
            return a.length - b.length;
          } else {
            return b.length - a.length;
          }
        });
        break;
      }
      case "shuffle": {
        sorted = lines.toSorted(() => Math.random() - 0.5);
        break;
      }
      default: {
        sorted = lines;
      }
    }

    return {
      metadata: {
        lineCount: sorted.length,
        mode,
        order,
      },
      output: sorted.join("\n"),
      success: true,
    };
  } catch (error: unknown) {
    return {
      error: error instanceof Error ? error.message : "An error occurred",
      success: false,
    };
  }
};

export const textFilterHandler = async (
  input: string,
  options?: TextOptions,
): Promise<ToolResult> => {
  try {
    const lines = input.split("\n");

    const filtered = lines
      .filter((line) => !options?.removeEmpty || line.trim() !== "")
      .filter((line) => {
        if (!options?.pattern) {
          return true;
        }
        const regex = new RegExp(options.pattern, options.caseSensitive ? "" : "i");
        return options.match === "exclude" ? !regex.test(line) : regex.test(line);
      })
      .filter((line, index, arr) => !options?.unique || arr.indexOf(line) === index)
      .filter((line) => options?.minLength === undefined || line.length >= options.minLength)
      .filter((line) => options?.maxLength === undefined || line.length <= options.maxLength);

    return {
      metadata: {
        filteredLines: filtered.length,
        originalLines: lines.length,
        removedLines: lines.length - filtered.length,
      },
      output: filtered.join("\n"),
      success: true,
    };
  } catch (error: unknown) {
    return {
      error: error instanceof Error ? error.message : "An error occurred",
      success: false,
    };
  }
};

export const textEscapeHandler = async (
  input: string,
  options?: TextOptions,
): Promise<ToolResult> => {
  try {
    const type = options?.type || "html";
    let result: string;

    switch (type) {
      case "html": {
        const htmlMap: Record<string, string> = {
          '"': "&quot;",
          "&": "&amp;",
          "'": "&#039;",
          "<": "&lt;",
          ">": "&gt;",
        };
        result = input.replace(/[&<>"']/g, (m) => htmlMap[m]);
        break;
      }
      case "xml": {
        const xmlMap: Record<string, string> = {
          '"': "&quot;",
          "&": "&amp;",
          "'": "&apos;",
          "<": "&lt;",
          ">": "&gt;",
        };
        result = input.replace(/[&<>"']/g, (m) => xmlMap[m]);
        break;
      }
      case "json": {
        result = JSON.stringify(input);
        break;
      }
      case "csv": {
        result = input
          .replace(/"/g, '""')
          .replace(/,/g, String.raw`\,`)
          .replace(/\n/g, String.raw`\n`);
        break;
      }
      case "java": {
        result = input
          .replace(/\\/g, String.raw`\\`)
          .replace(/"/g, String.raw`\"`)
          .replace(/'/g, String.raw`\'`)
          .replace(/\n/g, String.raw`\n`)
          .replace(/\r/g, String.raw`\r`)
          .replace(/\t/g, String.raw`\t`);
        break;
      }
      default: {
        result = input;
      }
    }

    return {
      metadata: {
        escapeType: type,
      },
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

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const jsonToCsv = (obj: unknown): string => {
  const arr = Array.isArray(obj) ? obj : [obj];
  if (arr.length === 0) {
    return "";
  }

  const [firstItem] = arr;
  if (!isRecord(firstItem)) {
    throw new Error("Cannot convert to CSV: data must be an array of objects");
  }

  const headers = Object.keys(firstItem);
  const csvRows = [headers.join(",")];

  for (const row of arr) {
    if (!isRecord(row)) {
      throw new Error("Cannot convert to CSV: all array items must be objects");
    }
    const values = headers.map((header) => {
      const value = row[header];
      let cell = value === null || value === undefined ? "" : String(value);
      if (cell.includes(",") || cell.includes('"') || cell.includes("\n")) {
        cell = `"${cell.replace(/"/g, '""')}"`;
      }
      return cell;
    });
    csvRows.push(values.join(","));
  }
  return csvRows.join("\n");
};

const jsonToJsonl = (obj: unknown): string => {
  const arr = Array.isArray(obj) ? obj : [obj];
  return arr.map((item) => JSON.stringify(item)).join("\n");
};

const jsonlToJson = (jsonl: string): unknown[] => {
  const lines = jsonl.trim().split("\n");
  if (lines.length === 0) {
    return [];
  }
  return lines.filter((line) => line.trim()).map((line) => JSON.parse(line));
};

const toXml = (value: unknown, key: string): string => {
  if (value === null || value === undefined) {
    return `<${key}/>`;
  }
  if (typeof value !== "object") {
    return `<${key}>${String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</${key}>`;
  }
  if (Array.isArray(value)) {
    return value.map((item) => toXml(item, key)).join("");
  }

  if (!isRecord(value)) {
    return `<${key}/>`;
  }

  const entries = Object.entries(value);
  if (entries.length === 0) {
    return `<${key}/>`;
  }
  const children = entries.map(([k, v]) => toXml(v, k)).join("");
  return `<${key}>${children}</${key}>`;
};

const jsonToXml = (obj: unknown, rootName = "root"): string => toXml(obj, rootName);

const parseText = (text: string): unknown => {
  const trimmed = text.trim();
  if (trimmed === "") {
    return "";
  }
  if (trimmed === "true") {
    return true;
  }
  if (trimmed === "false") {
    return false;
  }
  if (/^-?\d+$/.test(trimmed)) {
    return Number.parseInt(trimmed, 10);
  }
  if (/^-?\d+\.\d+$/.test(trimmed)) {
    return Number.parseFloat(trimmed);
  }
  return trimmed;
};

const xmlToJson = (xml: string): unknown => {
  const stack: Record<string, unknown>[] = [{}];
  const regex = /<([^/!?][^>]*)>([^<]*)<\/[^>]+>|<([^/!?][^>]*)\/>/g;
  let match;
  while ((match = regex.exec(xml)) !== null) {
    const [_full, opening, text, selfClosing] = match;
    if (selfClosing) {
      const [name] = selfClosing.split(/\s+/);
      const current = stack[stack.length - 1];
      if (name in current) {
        const existingValue = current[name];
        if (!Array.isArray(existingValue)) {
          current[name] = [existingValue];
        }
        (current[name] as unknown[]).push("");
      } else {
        current[name] = "";
      }
    } else if (opening) {
      const [name] = opening.split(/\s+/);
      const current = stack[stack.length - 1];
      const newObj: Record<string, unknown> = {};
      if (name in current) {
        const existingValue = current[name];
        if (!Array.isArray(existingValue)) {
          current[name] = [existingValue];
        }
        (current[name] as unknown[]).push(newObj);
      } else {
        current[name] = newObj;
      }
      stack.push(newObj);
      if (text.trim()) {
        const parsed = parseText(text);
        for (const key in newObj) {
          if (Object.hasOwn(newObj, key)) {
            newObj[key] = parsed;
          }
        }
      }
      stack.pop();
    }
  }
  return stack[0];
};

const parseCsvRow = (row: string): string[] => {
  const values: string[] = [];
  let currentValue = "";
  let inQuotes = false;
  let j = 0;

  while (j < row.length) {
    const char = row[j];
    if (char === '"') {
      if (inQuotes && row[j + 1] === '"') {
        currentValue += '"';
        j += 2;
      } else {
        inQuotes = !inQuotes;
        j += 1;
      }
    } else if (char === "," && !inQuotes) {
      values.push(currentValue);
      currentValue = "";
      j += 1;
    } else {
      currentValue += char;
      j += 1;
    }
  }
  values.push(currentValue);
  return values;
};

const csvToJson = (csv: string): unknown => {
  const lines = csv.trim().split("\n");
  if (lines.length < 2) {
    throw new Error("CSV must have at least a header and one data row");
  }
  const headers = lines[0]
    .split(",")
    .map((h) => h.trim().replace(/^"|"$/g, "").replace(/""/g, '"'));

  return lines.slice(1).map((line) => {
    const values = parseCsvRow(line);
    return Object.fromEntries(
      headers.map((header, index) => [
        header,
        values[index] ? values[index].replace(/^"|"$/g, "").replace(/""/g, '"') : "",
      ]),
    ) as Record<string, string>;
  });
};

export const textFormatHandler = async (
  input: string,
  options?: TextOptions,
): Promise<ToolResult> => {
  try {
    const from = options?.from || "json";
    const to = options?.to || "yaml";

    let parsed: unknown;
    let result: string;

    switch (from) {
      case "json": {
        parsed = JSON.parse(input);
        break;
      }
      case "yaml": {
        parsed = yaml.load(input);
        break;
      }
      case "csv": {
        parsed = csvToJson(input);
        break;
      }
      case "jsonl": {
        parsed = jsonlToJson(input);
        break;
      }
      case "xml": {
        parsed = xmlToJson(input);
        break;
      }
      default: {
        parsed = input;
      }
    }

    switch (to) {
      case "json": {
        result = JSON.stringify(parsed, undefined, 2);
        break;
      }
      case "yaml": {
        result = yaml.dump(parsed, { indent: 2, lineWidth: -1 });
        break;
      }
      case "csv": {
        result = jsonToCsv(parsed);
        break;
      }
      case "jsonl": {
        result = jsonToJsonl(parsed);
        break;
      }
      case "xml": {
        result = jsonToXml(parsed);
        break;
      }
      default: {
        result = String(parsed);
      }
    }

    return {
      metadata: {
        from,
        to,
      },
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
