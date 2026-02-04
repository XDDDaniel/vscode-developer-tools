import { v4 as uuidv4, v1 as uuidv1 } from "uuid";
import { ulid } from "ulid";
import { customAlphabet } from "nanoid";
import { loremIpsum } from "lorem-ipsum";
import QRCode, { type QRCodeToDataURLOptions } from "qrcode";
import BwipJs, { type RenderOptions } from "bwip-js";
import type { GeneratorOptions, ToolResult } from "../../types/index";
import { generatePassword as genPassword } from "../../utils/shared";

export const uuidGenerateHandler = async (
  input: string,
  options?: GeneratorOptions,
): Promise<ToolResult> => {
  try {
    const version = options?.version || "4";
    const count = options?.count || 1;

    const uuids = Array.from({ length: count }, () => (version === "1" ? uuidv1() : uuidv4()));

    return {
      metadata: {
        count,
        format: "standard",
        version: `v${version}`,
      },
      output: uuids.join("\n"),
      success: true,
    };
  } catch (error: unknown) {
    return {
      error: error instanceof Error ? error.message : "An error occurred",
      success: false,
    };
  }
};

export const ulidGenerateHandler = async (
  input: string,
  options?: GeneratorOptions,
): Promise<ToolResult> => {
  try {
    const count = options?.count || 1;

    const ulids = Array.from({ length: count }, () => ulid());

    return {
      metadata: {
        count,
        sortable: true,
      },
      output: ulids.join("\n"),
      success: true,
    };
  } catch (error: unknown) {
    return {
      error: error instanceof Error ? error.message : "An error occurred",
      success: false,
    };
  }
};

export const nanoidGenerateHandler = async (
  input: string,
  options?: GeneratorOptions,
): Promise<ToolResult> => {
  try {
    const length = options?.length || 21;
    const alphabet =
      options?.alphabet || "_-0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const count = options?.count || 1;

    const customNanoid = customAlphabet(alphabet, length);
    const ids = Array.from({ length: count }, () => customNanoid());

    return {
      metadata: {
        alphabetSize: alphabet.length,
        count,
        length,
      },
      output: ids.join("\n"),
      success: true,
    };
  } catch (error: unknown) {
    return {
      error: error instanceof Error ? error.message : "An error occurred",
      success: false,
    };
  }
};

export const passwordGenerateHandler = async (
  input: string,
  options?: GeneratorOptions,
): Promise<ToolResult> => {
  try {
    const length = options?.length || 16;
    const count = options?.count || 1;

    const passwordOptions = {
      exclude: options?.exclude || "",
      excludeSimilar: options?.excludeSimilar !== false,
      lowercase: options?.lowercase !== false,
      numbers: options?.numbers !== false,
      symbols: options?.symbols !== false,
      uppercase: options?.uppercase !== false,
    };

    const passwords = Array.from({ length: count }, () => genPassword(length, passwordOptions));

    return {
      metadata: {
        count,
        length,
        lowercase: options?.lowercase !== false,
        numbers: options?.numbers !== false,
        symbols: options?.symbols !== false,
        uppercase: options?.uppercase !== false,
      },
      output: passwords.join("\n"),
      success: true,
    };
  } catch (error: unknown) {
    return {
      error: error instanceof Error ? error.message : "An error occurred",
      success: false,
    };
  }
};

export const loremGenerateHandler = async (
  input: string,
  options?: GeneratorOptions,
): Promise<ToolResult> => {
  try {
    const count = options?.count || 1;
    let units: "paragraphs" | "sentences" | "words";
    if (options?.type === "paragraphs") {
      units = "paragraphs";
    } else if (options?.type === "sentences") {
      units = "sentences";
    } else {
      units = "words";
    }

    const result = loremIpsum({ count, units });

    return {
      metadata: {
        count,
        type: options?.type || "words",
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

export const qrcodeGenerateHandler = async (
  input: string,
  options?: GeneratorOptions,
): Promise<ToolResult> => {
  try {
    if (!input) {
      return { error: "Input text is required", success: false };
    }

    const qrOptions: QRCodeToDataURLOptions = {
      color: {
        dark: options?.colorDark || "#000000",
        light: options?.colorLight || "#ffffff",
      },
      errorCorrectionLevel: options?.errorCorrection || "M",
      margin: options?.margin || 2,
      width: options?.size || 300,
    };

    const dataUrl = await QRCode.toDataURL(input, qrOptions);

    return {
      metadata: {
        errorCorrection: options?.errorCorrection || "M",
        format: "PNG (Data URL)",
        size: options?.size || 300,
      },
      output: dataUrl,
      success: true,
    };
  } catch (error: unknown) {
    return {
      error: error instanceof Error ? error.message : "An error occurred",
      success: false,
    };
  }
};

export const barcodeGenerateHandler = async (
  input: string,
  options?: GeneratorOptions,
): Promise<ToolResult> => {
  try {
    if (!input) {
      return { error: "Input text is required", success: false };
    }

    const barcodeOptions: RenderOptions = {
      bcid: options?.format || "code128",
      height: options?.height || 10,
      includetext: options?.includeText !== false,
      scale: options?.scale || 3,
      text: input,
      textxalign: options?.textAlign || "center",
    };

    const barcodeBuffer = await BwipJs.toBuffer(barcodeOptions);

    const dataUrl = `data:image/png;base64,${barcodeBuffer.toString("base64")}`;

    return {
      metadata: {
        format: options?.format || "code128",
        height: options?.height || 10,
        scale: options?.scale || 3,
      },
      output: dataUrl,
      success: true,
    };
  } catch (error: unknown) {
    return {
      error: error instanceof Error ? error.message : "An error occurred",
      success: false,
    };
  }
};
