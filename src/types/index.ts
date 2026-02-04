import type { QRCodeErrorCorrectionLevel } from "qrcode";

// Hash Algorithm Types
export type HashAlgorithm = "md5" | "sha1" | "sha256" | "sha512";

// Tool Handler Types
export interface ToolResult {
  success: boolean;
  output?: string;
  error?: string;
  metadata?: Record<string, unknown>;
}

// Common option types for tool handlers
export type BaseToolOptions = Record<string, unknown>;

export interface HashGeneratorOptions extends BaseToolOptions {
  algorithm?: HashAlgorithm;
  outputFormat?: "hex" | "base64";
  case?: "lower" | "upper";
  secret?: string;
}

export interface EncodingOptions extends BaseToolOptions {
  mode?: "encode" | "decode";
  type?: string;
  charset?: string;
  header?: string;
  secret?: string;
}

export interface GeneratorOptions extends BaseToolOptions {
  count?: number;
  version?: string;
  length?: number;
  alphabet?: string;
  exclude?: string;
  excludeSimilar?: boolean;
  lowercase?: boolean;
  numbers?: boolean;
  symbols?: boolean;
  uppercase?: boolean;
  size?: number;
  type?: string;
  colorDark?: string;
  colorLight?: string;
  errorCorrection?: QRCodeErrorCorrectionLevel;
  margin?: number;
  format?: string;
  height?: number;
  includeText?: boolean;
  scale?: number;
  textAlign?: "offleft" | "left" | "center" | "right" | "offright" | "justify";
}

export interface TextOptions extends BaseToolOptions {
  type?: string;
  order?: string;
  mode?: string;
  caseSensitive?: boolean;
  match?: string;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  removeEmpty?: boolean;
  removeWhitespace?: boolean;
  unique?: boolean;
  from?: string;
  to?: string;
  path?: string;
  schema?: string;
}

export interface FormatOptions extends BaseToolOptions {
  language?: string;
  indentStyle?: string;
  tabWidth?: number;
  printWidth?: number;
  linesBetweenQueries?: number;
}

export interface RegexOptions extends BaseToolOptions {
  pattern?: string;
  text?: string;
  flags?: string;
}

export interface UnitsOptions extends BaseToolOptions {
  category?: string;
  from?: string;
  to?: string;
  type?: string;
}

export interface DateTimeOptions extends BaseToolOptions {
  mode?: string;
  timezone?: string;
  format?: string;
}

export interface ColorOptions extends BaseToolOptions {
  color?: string;
}

export interface ToolOption {
  id: string;
  label: string;
  type: "select" | "checkbox" | "number" | "text" | "textarea" | "color";
  defaultValue?: unknown;
  options?: { label: string; value: string }[];
  min?: number;
  max?: number;
  rows?: number;
  placeholder?: string;
}

export interface ToolMetadata {
  id: string;
  name: string;
  category: string;
  hasInput: boolean;
  placeholder?: string;
  options?: ToolOption[];
}
