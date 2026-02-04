import Ajv, { type ErrorObject } from "ajv";
import type { TextOptions, ToolResult } from "../../types/index";
import { JSONPath } from "jsonpath-plus";

export const jsonPathHandler = async (
  input: string,
  options?: TextOptions,
): Promise<ToolResult> => {
  try {
    if (!input) {
      return { error: "JSON input is required", success: false };
    }

    const json = JSON.parse(input);
    const path = options?.path || "$";

    const result = JSONPath({ json, path });

    let output: string;
    if (Array.isArray(result)) {
      if (result.length === 0) {
        output = "";
      } else if (
        result.length === 1 &&
        (typeof result[0] === "string" ||
          typeof result[0] === "number" ||
          typeof result[0] === "boolean")
      ) {
        output = String(result[0]);
      } else if (result.length === 1 && typeof result[0] === "object" && result[0] !== null) {
        output = JSON.stringify(result[0], undefined, 2);
      } else {
        output = JSON.stringify(result, undefined, 2);
      }
    } else {
      output = JSON.stringify(result, undefined, 2);
    }

    return {
      metadata: {
        matches: Array.isArray(result) ? result.length : 1,
        path,
      },
      output,
      success: true,
    };
  } catch (error: unknown) {
    return {
      error: error instanceof Error ? error.message : "Invalid JSON or JSONPath expression",
      success: false,
    };
  }
};

export const jsonSchemaHandler = async (
  input: string,
  options?: TextOptions,
): Promise<ToolResult> => {
  try {
    if (!input) {
      return { error: "JSON input is required", success: false };
    }

    const json = JSON.parse(input);
    const schemaText = options?.schema || "";

    if (!schemaText) {
      return {
        metadata: {
          message: "Provide a schema to validate the JSON",
        },
        output: JSON.stringify(json, undefined, 2),
        success: true,
      };
    }

    const schema = JSON.parse(schemaText) as Record<string, unknown>;
    const {
      $schema: _$schema,
      $id: _$id,
      id: _id,
      title: _title,
      description: _description,
      default: _default,
      examples: _examples,
      dependentRequired: _dependentRequired,
      ...cleanSchema
    } = schema;

    const ajv = new Ajv({ allErrors: true, strict: false });

    let validate;
    try {
      validate = ajv.compile(cleanSchema);
    } catch (error: unknown) {
      return {
        error: `Invalid schema: ${error instanceof Error ? error.message : String(error)}`,
        metadata: {
          schemaError: error instanceof Error ? error.message : String(error),
        },
        success: false,
      };
    }

    const valid = validate(json);

    if (valid) {
      return {
        metadata: {
          errors: 0,
          message: "Valid JSON",
          valid: true,
        },
        output: "Valid JSON",
        success: true,
      };
    } else {
      const errors: ErrorObject[] = validate.errors || [];
      const errorOutput = errors
        .map((error) => `${error.instancePath}: ${error.message}`)
        .join("\n");

      return {
        error: `Invalid JSON\n${errorOutput}`,
        metadata: {
          errors: errors.length,
          valid: false,
        },
        success: false,
      };
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorDetails =
      error instanceof Error && "errors" in error && Array.isArray(error.errors)
        ? `\n${JSON.stringify(error.errors, undefined, 2)}`
        : "";
    return {
      error: errorMessage + errorDetails,
      success: false,
    };
  }
};
