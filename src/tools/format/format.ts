import beautify from "js-beautify";
import { format } from "sql-formatter";
import yaml from "js-yaml";
import type { FormatOptions, ToolResult } from "../../types/index";

export const codeFormatHandler = async (
  input: string,
  options?: FormatOptions,
): Promise<ToolResult> => {
  try {
    if (!input) {
      return { error: "Input code is required", success: false };
    }

    const language = options?.language || "javascript";

    let result: string;
    const beautifyOptions = {
      brace_style: "collapse" as const,
      break_chained_methods: false,
      comma_first: false,
      e4x: false,
      end_with_newline: false,
      indent_char: " ",
      indent_empty_lines: false,
      indent_inner_html: false,
      indent_scripts: "normal" as const,
      indent_size: options?.tabWidth || 2,
      jslint_happy: false,
      keep_array_indentation: false,
      max_preserve_newlines: 2,
      preserve_newlines: true,
      space_before_conditional: true,
      unescape_strings: false,
      wrap_line_length: options?.printWidth || 80,
    };

    switch (language) {
      case "javascript":
      case "typescript":
      case "json": {
        result = beautify.js(input, beautifyOptions);
        break;
      }
      case "html": {
        result = beautify.html(input, beautifyOptions);
        break;
      }
      case "css": {
        result = beautify.css(input, beautifyOptions);
        break;
      }
      default: {
        result = beautify.js(input, beautifyOptions);
      }
    }

    return {
      metadata: {
        language,
        tabWidth: options?.tabWidth || 2,
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

export const sqlFormatHandler = async (
  input: string,
  options?: FormatOptions,
): Promise<ToolResult> => {
  try {
    if (!input) {
      return { output: "", success: true };
    }

    const result = format(input, {
      indentStyle: (options?.indentStyle || "standard") as
        | "standard"
        | "tabularLeft"
        | "tabularRight",
      language: (options?.language || "sql") as
        | "sql"
        | "bigquery"
        | "db2"
        | "db2i"
        | "duckdb"
        | "hive"
        | "mariadb"
        | "mysql"
        | "tidb"
        | "n1ql"
        | "plsql"
        | "postgresql"
        | "redshift"
        | "spark"
        | "sqlite"
        | "trino"
        | "transactsql"
        | "singlestoredb"
        | "snowflake"
        | "tsql",
      linesBetweenQueries: options?.linesBetweenQueries || 2,
      tabWidth: options?.tabWidth || 2,
    });

    return {
      metadata: {
        language: options?.language || "sql",
        tabWidth: options?.tabWidth || 2,
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

export const dataFormatHandler = async (
  input: string,
  options?: FormatOptions,
): Promise<ToolResult> => {
  try {
    if (!input) {
      return { error: "Input is required", success: false };
    }

    const format = options?.language || "json";
    const indent = options?.tabWidth || 2;

    let result: string;

    switch (format) {
      case "json": {
        const parsed = JSON.parse(input);
        result = JSON.stringify(parsed, undefined, indent);
        break;
      }
      case "yaml": {
        const parsed = yaml.load(input);
        result = yaml.dump(parsed, { indent });
        break;
      }
      case "xml": {
        result = beautify.html(input, {
          indent_char: " ",
          indent_inner_html: false,
          indent_size: indent,
          unformatted: [],
          wrap_line_length: 0,
        });
        break;
      }
      default: {
        return { error: `Unsupported format: ${format}`, success: false };
      }
    }

    return {
      metadata: {
        format,
        tabWidth: indent,
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
