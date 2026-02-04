export const escapeHtml = (text: string): string => {
  const map: Record<string, string> = {
    '"': "&quot;",
    "&": "&amp;",
    "'": "&#039;",
    "<": "&lt;",
    ">": "&gt;",
  };
  return text.replace(/[&<>"']/g, (c) => map[c]);
};

export const base64Encode = (
  text: string,
  format: "standard" | "url" | "mime" = "standard",
): string => {
  let encoded = Buffer.from(text, "utf8").toString("base64");
  if (format === "url") {
    encoded = encoded.replace(/\+/g, "-").replace(/\//g, "_").replace(/[=]/g, "");
  } else if (format === "mime") {
    encoded = encoded.match(/.{1,76}/g)?.join("\n") ?? encoded;
  }
  return encoded;
};

export const base64Decode = (
  text: string,
  format: "standard" | "url" | "mime" = "standard",
): string => {
  let decoded = text;
  if (format === "url") {
    decoded = decoded.replace(/-/g, "+").replace(/_/g, "/");
  } else if (format === "mime") {
    decoded = decoded.replace(/\s/g, "");
  }
  return Buffer.from(decoded, "base64").toString("utf8");
};

export const hexEncode = (text: string): string => Buffer.from(text, "utf8").toString("hex");

export const hexDecode = (hex: string): string => {
  const cleaned = hex.replace(/\s/g, "");
  return Buffer.from(cleaned, "hex").toString("utf8");
};

export const formatBytes = (bytes: number, decimals = 2): string => {
  if (bytes === 0) {
    return "0 Bytes";
  }
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Number.parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
};

interface PasswordOptions {
  exclude?: string;
  excludeSimilar?: boolean;
  lowercase?: boolean;
  numbers?: boolean;
  symbols?: boolean;
  uppercase?: boolean;
}

export const generatePassword = (length = 16, options: Partial<PasswordOptions> = {}): string => {
  const defaults: PasswordOptions = {
    excludeSimilar: true,
    lowercase: true,
    numbers: true,
    symbols: true,
    uppercase: true,
  };
  const opts = { ...defaults, ...options };

  const charset = [
    opts.uppercase ? "ABCDEFGHJKLMNPQRSTUVWXYZ" : "",
    opts.lowercase ? "abcdefghjkmnpqrstuvwxyz" : "",
    opts.numbers ? "23456789" : "",
    opts.symbols ? "!@#$%^&*()-_=+[]{}|;:,.<>?" : "",
  ]
    .filter(Boolean)
    .join("");

  const charsetFiltered = opts.excludeSimilar
    ? [...charset].filter((c) => !"il1Lo0O".includes(c)).join("")
    : charset;

  const charsetFinal = opts.exclude
    ? [...charsetFiltered].filter((c) => !opts.exclude?.includes(c)).join("")
    : charsetFiltered;

  const finalCharset =
    charsetFinal || "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  const array = new Uint32Array(length);
  crypto.getRandomValues(array);

  return Array.from({ length }, (_, i) => finalCharset[array[i] % finalCharset.length]).join("");
};
