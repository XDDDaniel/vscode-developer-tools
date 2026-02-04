import base32 from "hi-base32";
import jwt from "jsonwebtoken";
import type { EncodingOptions, ToolResult } from "../../types/index";

export const base64Handler = async (
  input: string,
  options?: EncodingOptions,
): Promise<ToolResult> => {
  try {
    const mode = options?.mode || "encode";
    const type = options?.type || "standard";

    if (mode === "decode") {
      const cleanInput = type === "mime" ? input.replace(/\s/g, "") : input;
      const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
      if (!base64Regex.test(cleanInput)) {
        return {
          error: "Invalid base64 input",
          metadata: {
            inputLength: input.length,
            mode,
            outputLength: 0,
            type,
          },
          success: false,
        };
      }
      let result: string;
      if (type === "url") {
        result = Buffer.from(cleanInput, "base64url").toString("utf8");
      } else {
        result = Buffer.from(cleanInput, "base64").toString("utf8");
      }

      return {
        metadata: {
          inputLength: input.length,
          mode,
          outputLength: result.length,
          type,
        },
        output: result,
        success: true,
      };
    } else {
      let result: string;
      if (type === "url") {
        result = Buffer.from(input).toString("base64url");
      } else {
        const encoded = Buffer.from(input).toString("base64");
        result = type === "mime" ? encoded.match(/.{1,76}/g)?.join("\n") || encoded : encoded;
      }

      return {
        metadata: {
          inputLength: input.length,
          mode,
          outputLength: result.length,
          type,
        },
        output: result,
        success: true,
      };
    }
  } catch (error: unknown) {
    return {
      error: error instanceof Error ? error.message : "Invalid base64 input",
      success: false,
    };
  }
};

export const base32Handler = async (
  input: string,
  options?: EncodingOptions,
): Promise<ToolResult> => {
  try {
    const mode = options?.mode || "encode";

    if (mode === "decode") {
      const result = base32.decode(input.replace(/\s/g, ""));

      return {
        metadata: {
          inputLength: input.length,
          mode,
          outputLength: result.length,
        },
        output: result,
        success: true,
      };
    } else {
      const result = base32.encode(input);

      return {
        metadata: {
          inputLength: input.length,
          mode,
          outputLength: result.length,
        },
        output: result,
        success: true,
      };
    }
  } catch (error: unknown) {
    return {
      error: error instanceof Error ? error.message : "Invalid base32 input",
      success: false,
    };
  }
};

export const urlHandler = async (input: string, options?: EncodingOptions): Promise<ToolResult> => {
  try {
    const mode = options?.mode || "encode";

    if (mode === "decode") {
      const result = decodeURIComponent(input);

      return {
        metadata: {
          inputLength: input.length,
          mode,
          outputLength: result.length,
        },
        output: result,
        success: true,
      };
    } else {
      const result = encodeURIComponent(input);

      return {
        metadata: {
          inputLength: input.length,
          mode,
          outputLength: result.length,
        },
        output: result,
        success: true,
      };
    }
  } catch (error: unknown) {
    return {
      error: error instanceof Error ? error.message : "Invalid URL input",
      success: false,
    };
  }
};

export const jwtHandler = async (input: string, options?: EncodingOptions): Promise<ToolResult> => {
  try {
    const mode = options?.mode || "decode";

    if (mode === "decode") {
      if (!input) {
        return { error: "Input is required", success: false };
      }

      const parts = input.split(".");
      if (parts.length !== 3) {
        return { error: "Invalid JWT token format", success: false };
      }

      const header = JSON.parse(Buffer.from(parts[0], "base64url").toString("utf8"));
      const payload = JSON.parse(Buffer.from(parts[1], "base64url").toString("utf8"));

      return {
        metadata: {
          algorithm: header.alg,
          expiresAt: payload.exp ? new Date(payload.exp * 1000).toISOString() : "N/A",
          issuer: payload.iss || "N/A",
          mode,
          subject: payload.sub || "N/A",
          type: header.typ,
        },
        output: JSON.stringify({ header, payload }, undefined, 2),
        success: true,
      };
    } else {
      const payload = JSON.parse(input);
      const header = options?.header ? JSON.parse(options.header) : { alg: "HS256", typ: "JWT" };
      const secret = options?.secret || "secret";

      const token = jwt.sign(payload, secret, {
        algorithm: "HS256",
        header,
      });

      return {
        metadata: {
          algorithm: "HS256",
          mode,
          secret: "***",
        },
        output: token,
        success: true,
      };
    }
  } catch (error: unknown) {
    return {
      error: error instanceof Error ? error.message : "Invalid JWT input",
      success: false,
    };
  }
};
