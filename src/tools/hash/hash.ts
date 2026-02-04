import crypto from "crypto-js";
import type { ToolResult, HashAlgorithm, HashGeneratorOptions } from "../../types/index";

const hashInput = (input: string, algorithm: HashAlgorithm): string => {
  let hash: unknown;
  if (algorithm === "md5") {
    hash = crypto.MD5(input);
  } else if (algorithm === "sha1") {
    hash = crypto.SHA1(input);
  } else if (algorithm === "sha256") {
    hash = crypto.SHA256(input);
  } else if (algorithm === "sha512") {
    hash = crypto.SHA512(input);
  } else {
    hash = crypto.SHA256(input);
  }

  return (hash as { toString: () => string }).toString();
};

const hashWithHmac = (input: string, algorithm: string, secret: string): string => {
  let hash: unknown;
  if (algorithm === "MD5") {
    hash = crypto.HmacMD5(input, secret);
  } else if (algorithm === "SHA1") {
    hash = crypto.HmacSHA1(input, secret);
  } else if (algorithm === "SHA256") {
    hash = crypto.HmacSHA256(input, secret);
  } else if (algorithm === "SHA512") {
    hash = crypto.HmacSHA512(input, secret);
  } else {
    hash = crypto.HmacSHA256(input, secret);
  }

  return (hash as { toString: () => string }).toString();
};

export const hashGeneratorHandler = async (
  input: string,
  options?: HashGeneratorOptions,
): Promise<ToolResult> => {
  try {
    const algorithm = (options?.algorithm || "sha256") as HashAlgorithm;
    const outputFormat = options?.outputFormat || "hex";
    const toUpper = options?.case === "upper";
    const secret = options?.secret;

    let hashResult: string;
    let algorithmName: string;
    let isHmac = false;

    if (secret) {
      hashResult = hashWithHmac(input, algorithm.toUpperCase(), secret);
      isHmac = true;
      algorithmName = `HMAC-${algorithm.toUpperCase()}`;
    } else {
      hashResult = hashInput(input, algorithm);
      algorithmName = algorithm.toUpperCase();
    }

    let finalResult: string;
    if (outputFormat === "base64") {
      const wordArray = crypto.enc.Hex.parse(hashResult);
      finalResult = crypto.enc.Base64.stringify(wordArray);
      algorithmName += " (Base64)";
    } else {
      finalResult = hashResult;
    }

    if (toUpper) {
      finalResult = finalResult.toUpperCase();
    }

    return {
      metadata: {
        algorithm: algorithmName,
        case: toUpper ? "upper" : "lower",
        hmac: isHmac,
        outputFormat,
      },
      output: finalResult,
      success: true,
    };
  } catch (error: unknown) {
    return {
      error: error instanceof Error ? error.message : "An error occurred",
      success: false,
    };
  }
};
