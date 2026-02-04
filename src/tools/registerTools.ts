import { registerTool } from "../webview/toolManager";

import { base32Handler, base64Handler, jwtHandler, urlHandler } from "./encoding/encoding";
import { codeFormatHandler, dataFormatHandler, sqlFormatHandler } from "./format/format";
import {
  barcodeGenerateHandler,
  loremGenerateHandler,
  nanoidGenerateHandler,
  passwordGenerateHandler,
  qrcodeGenerateHandler,
  ulidGenerateHandler,
  uuidGenerateHandler,
} from "./generators/generators";
import { hashGeneratorHandler } from "./hash/hash";
import { jsonPathHandler, jsonSchemaHandler } from "./json/json";
import {
  textCaseHandler,
  textEscapeHandler,
  textFilterHandler,
  textFormatHandler,
  textSortHandler,
} from "./text/text";
import { regexTestHandler } from "./regex/regex";
import { certificateAnalyzeHandler } from "./certificate/certificate";
import { colorPickerHandler } from "./color/color";
import { datetimeConverterHandler } from "./datetime/datetime";
import { unitsConvertHandler } from "./units/units";

registerTool("base64", base64Handler, {
  category: "Encoding",
  hasInput: true,
  name: "Base64",
  options: [
    {
      defaultValue: "encode",
      id: "mode",
      label: "Mode",
      options: [
        { label: "Encode", value: "encode" },
        { label: "Decode", value: "decode" },
      ],
      type: "select",
    },
    {
      defaultValue: "standard",
      id: "type",
      label: "Encoding Type",
      options: [
        { label: "Standard", value: "standard" },
        { label: "URL-Safe", value: "url" },
        { label: "MIME", value: "mime" },
      ],
      type: "select",
    },
  ],
  placeholder: "Enter text...",
});

registerTool("base32", base32Handler, {
  category: "Encoding",
  hasInput: true,
  name: "Base32",
  options: [
    {
      defaultValue: "encode",
      id: "mode",
      label: "Mode",
      options: [
        { label: "Encode", value: "encode" },
        { label: "Decode", value: "decode" },
      ],
      type: "select",
    },
  ],
  placeholder: "Enter text...",
});

registerTool("url", urlHandler, {
  category: "Encoding",
  hasInput: true,
  name: "URL",
  options: [
    {
      defaultValue: "encode",
      id: "mode",
      label: "Mode",
      options: [
        { label: "Encode", value: "encode" },
        { label: "Decode", value: "decode" },
      ],
      type: "select",
    },
  ],
  placeholder: "Enter text...",
});

registerTool("jwt", jwtHandler, {
  category: "Encoding",
  hasInput: true,
  name: "JWT",
  options: [
    {
      defaultValue: "decode",
      id: "mode",
      label: "Mode",
      options: [
        { label: "Encode", value: "encode" },
        { label: "Decode", value: "decode" },
      ],
      type: "select",
    },
    {
      defaultValue: "secret",
      id: "secret",
      label: "Secret Key",
      type: "text",
    },
    {
      defaultValue: "",
      id: "header",
      label: "Custom Header (JSON)",
      type: "text",
    },
  ],
  placeholder: "Enter text...",
});

registerTool("text:case", textCaseHandler, {
  category: "Text",
  hasInput: true,
  name: "Case Transform",
  options: [
    {
      defaultValue: "upper",
      id: "type",
      label: "Case Type",
      options: [
        { label: "UPPERCASE", value: "upper" },
        { label: "lowercase", value: "lower" },
        { label: "Title Case", value: "title" },
        { label: "Sentence case", value: "sentence" },
        { label: "camelCase", value: "camel" },
        { label: "snake_case", value: "snake" },
        { label: "kebab-case", value: "kebab" },
        { label: "esreveR", value: "reverse" },
      ],
      type: "select",
    },
  ],
  placeholder: "Enter text to transform...",
});

registerTool("text:sort", textSortHandler, {
  category: "Text",
  hasInput: true,
  name: "Text Sort",
  options: [
    {
      defaultValue: "asc",
      id: "order",
      label: "Sort Order",
      options: [
        { label: "Ascending", value: "asc" },
        { label: "Descending", value: "desc" },
      ],
      type: "select",
    },
    {
      defaultValue: "line",
      id: "mode",
      label: "Sort Mode",
      options: [
        { label: "Alphabetical", value: "line" },
        { label: "Numeric", value: "numeric" },
        { label: "By Length", value: "length" },
        { label: "Random Shuffle", value: "shuffle" },
      ],
      type: "select",
    },
  ],
  placeholder: "Enter text to sort (one per line)...",
});

registerTool("text:filter", textFilterHandler, {
  category: "Text",
  hasInput: true,
  name: "Text Filter",
  options: [
    {
      defaultValue: true,
      id: "removeEmpty",
      label: "Remove Empty Lines",
      type: "checkbox",
    },
    {
      defaultValue: false,
      id: "unique",
      label: "Remove Duplicates",
      type: "checkbox",
    },
    {
      defaultValue: "",
      id: "pattern",
      label: "Regex Pattern",
      type: "text",
    },
    {
      defaultValue: false,
      id: "caseSensitive",
      label: "Case Sensitive",
      type: "checkbox",
    },
    {
      defaultValue: 0,
      id: "minLength",
      label: "Min Length",
      type: "number",
    },
    {
      defaultValue: 0,
      id: "maxLength",
      label: "Max Length",
      type: "number",
    },
  ],
  placeholder: "Enter text to filter (one per line)...",
});

registerTool("text:escape", textEscapeHandler, {
  category: "Text",
  hasInput: true,
  name: "Text Escape",
  options: [
    {
      defaultValue: "html",
      id: "type",
      label: "Escape Type",
      options: [
        { label: "HTML", value: "html" },
        { label: "XML", value: "xml" },
        { label: "JSON String", value: "json" },
        { label: "CSV", value: "csv" },
        { label: "Java String", value: "java" },
      ],
      type: "select",
    },
  ],
  placeholder: "Enter text to escape...",
});

registerTool("text:format", textFormatHandler, {
  category: "Format",
  hasInput: true,
  name: "Format Converter",
  options: [
    {
      defaultValue: "json",
      id: "from",
      label: "From Format",
      options: [
        { label: "JSON", value: "json" },
        { label: "YAML", value: "yaml" },
        { label: "CSV", value: "csv" },
        { label: "JSONL", value: "jsonl" },
        { label: "XML", value: "xml" },
      ],
      type: "select",
    },
    {
      defaultValue: "yaml",
      id: "to",
      label: "To Format",
      options: [
        { label: "JSON", value: "json" },
        { label: "YAML", value: "yaml" },
        { label: "CSV", value: "csv" },
        { label: "JSONL", value: "jsonl" },
        { label: "XML", value: "xml" },
      ],
      type: "select",
    },
  ],
  placeholder: "Enter text to convert...",
});

registerTool("uuid:generate", uuidGenerateHandler, {
  category: "Generators",
  hasInput: false,
  name: "UUID Generator",
  options: [
    {
      defaultValue: "4",
      id: "version",
      label: "Version",
      options: [
        { label: "UUID v1", value: "1" },
        { label: "UUID v4", value: "4" },
      ],
      type: "select",
    },
    {
      defaultValue: 1,
      id: "count",
      label: "Count",
      max: 100,
      min: 1,
      type: "number",
    },
  ],
  placeholder: "Click Execute to generate UUID",
});

registerTool("ulid:generate", ulidGenerateHandler, {
  category: "Generators",
  hasInput: false,
  name: "ULID Generator",
  options: [
    {
      defaultValue: 1,
      id: "count",
      label: "Count",
      max: 100,
      min: 1,
      type: "number",
    },
  ],
  placeholder: "Click Execute to generate ULID",
});

registerTool("nanoid:generate", nanoidGenerateHandler, {
  category: "Generators",
  hasInput: false,
  name: "NanoID Generator",
  options: [
    {
      defaultValue: 21,
      id: "length",
      label: "Length",
      max: 100,
      min: 1,
      type: "number",
    },
    {
      defaultValue: 1,
      id: "count",
      label: "Count",
      max: 100,
      min: 1,
      type: "number",
    },
    {
      defaultValue: "",
      id: "alphabet",
      label: "Custom Alphabet",
      type: "text",
    },
  ],
  placeholder: "Click Execute to generate NanoID",
});

registerTool("password:generate", passwordGenerateHandler, {
  category: "Generators",
  hasInput: false,
  name: "Password Generator",
  options: [
    {
      defaultValue: 16,
      id: "length",
      label: "Length",
      max: 128,
      min: 4,
      type: "number",
    },
    {
      defaultValue: 1,
      id: "count",
      label: "Count",
      max: 100,
      min: 1,
      type: "number",
    },
    {
      defaultValue: true,
      id: "uppercase",
      label: "Include Uppercase",
      type: "checkbox",
    },
    {
      defaultValue: true,
      id: "lowercase",
      label: "Include Lowercase",
      type: "checkbox",
    },
    {
      defaultValue: true,
      id: "numbers",
      label: "Include Numbers",
      type: "checkbox",
    },
    {
      defaultValue: true,
      id: "symbols",
      label: "Include Symbols",
      type: "checkbox",
    },
    {
      defaultValue: true,
      id: "excludeSimilar",
      label: "Exclude Similar (i, l, 1, L, o, 0, O)",
      type: "checkbox",
    },
    {
      defaultValue: "",
      id: "exclude",
      label: "Exclude Characters",
      type: "text",
    },
  ],
  placeholder: "Click Execute to generate password",
});

registerTool("lorem:generate", loremGenerateHandler, {
  category: "Generators",
  hasInput: false,
  name: "Lorem Ipsum",
  options: [
    {
      defaultValue: "words",
      id: "type",
      label: "Output Type",
      options: [
        { label: "Words", value: "words" },
        { label: "Sentences", value: "sentences" },
        { label: "Paragraphs", value: "paragraphs" },
      ],
      type: "select",
    },
    {
      defaultValue: 1,
      id: "count",
      label: "Count",
      max: 100,
      min: 1,
      type: "number",
    },
  ],
  placeholder: "Click Execute to generate text",
});

registerTool("qrcode:generate", qrcodeGenerateHandler, {
  category: "Generators",
  hasInput: true,
  name: "QR Code Generator",
  options: [
    {
      defaultValue: 300,
      id: "size",
      label: "Size (px)",
      max: 1000,
      min: 50,
      type: "number",
    },
    {
      defaultValue: 2,
      id: "margin",
      label: "Margin",
      max: 10,
      min: 0,
      type: "number",
    },
    {
      defaultValue: "M",
      id: "errorCorrection",
      label: "Error Correction",
      options: [
        { label: "Low (7%)", value: "L" },
        { label: "Medium (15%)", value: "M" },
        { label: "Quartile (25%)", value: "Q" },
        { label: "High (30%)", value: "H" },
      ],
      type: "select",
    },
    {
      defaultValue: "#000000",
      id: "colorDark",
      label: "Dark Color",
      type: "text",
    },
    {
      defaultValue: "#ffffff",
      id: "colorLight",
      label: "Light Color",
      type: "text",
    },
  ],
  placeholder: "Enter text or URL...",
});

registerTool("barcode:generate", barcodeGenerateHandler, {
  category: "Generators",
  hasInput: true,
  name: "Barcode Generator",
  options: [
    {
      defaultValue: "code128",
      id: "format",
      label: "Barcode Type",
      options: [
        { label: "Code 128", value: "code128" },
        { label: "Code 39", value: "code39" },
        { label: "EAN-13", value: "ean13" },
        { label: "UPC-A", value: "upca" },
        { label: "QR Code", value: "qrcode" },
      ],
      type: "select",
    },
    {
      defaultValue: 3,
      id: "scale",
      label: "Scale",
      max: 5,
      min: 1,
      type: "number",
    },
    {
      defaultValue: 10,
      id: "height",
      label: "Height",
      max: 50,
      min: 5,
      type: "number",
    },
    {
      defaultValue: true,
      id: "includeText",
      label: "Include Text",
      type: "checkbox",
    },
  ],
  placeholder: "Enter barcode text...",
});

registerTool("json:jsonpath", jsonPathHandler, {
  category: "JSON",
  hasInput: true,
  name: "JSON Path",
  options: [
    {
      defaultValue: "$",
      id: "path",
      label: "JSONPath Expression",
      type: "text",
    },
  ],
  placeholder: "Enter JSON to query...",
});

registerTool("json:schema", jsonSchemaHandler, {
  category: "JSON",
  hasInput: true,
  name: "JSON Schema Validator",
  options: [
    {
      defaultValue: "",
      id: "schema",
      label: "JSON Schema",
      placeholder: "Enter JSON Schema to validate against...",
      rows: 10,
      type: "textarea",
    },
  ],
  placeholder: "Enter JSON to validate...",
});

registerTool("hash:generator", hashGeneratorHandler, {
  category: "Hash",
  hasInput: true,
  name: "Hash Generator",
  options: [
    {
      defaultValue: "sha256",
      id: "algorithm",
      label: "Algorithm",
      options: [
        { label: "MD5", value: "md5" },
        { label: "SHA-1", value: "sha1" },
        { label: "SHA-256", value: "sha256" },
        { label: "SHA-512", value: "sha512" },
      ],
      type: "select",
    },
    {
      defaultValue: "hex",
      id: "outputFormat",
      label: "Output Format",
      options: [
        { label: "Hexadecimal", value: "hex" },
        { label: "Base64", value: "base64" },
      ],
      type: "select",
    },
    {
      defaultValue: "lower",
      id: "case",
      label: "Case",
      options: [
        { label: "Lowercase", value: "lower" },
        { label: "Uppercase", value: "upper" },
      ],
      type: "select",
    },
    {
      defaultValue: "",
      id: "secret",
      label: "HMAC Secret (optional)",
      type: "text",
    },
  ],
  placeholder: "Enter text to hash...",
});

registerTool("datetime:converter", datetimeConverterHandler, {
  category: "DateTime",
  hasInput: true,
  name: "Timestamp Converter",
  options: [
    {
      defaultValue: "ISO 8601",
      id: "format",
      label: "Display Format",
      options: [
        { label: "Unix (ms)", value: "Unix (ms)" },
        { label: "Unix (sec)", value: "Unix (sec)" },
        { label: "ISO 8601", value: "ISO 8601" },
        { label: "RFC 1123", value: "RFC 1123" },
        { label: "RFC 2822", value: "RFC 2822" },
        { label: "YYYY-MM-DD", value: "YYYY-MM-DD" },
        { label: "DD/MM/YYYY", value: "DD/MM/YYYY" },
        { label: "MM/DD/YYYY", value: "MM/DD/YYYY" },
      ],
      type: "select",
    },
  ],
  placeholder: "Enter timestamp or date (leave empty for current time)...",
});

registerTool("units:convert", unitsConvertHandler, {
  category: "Units",
  hasInput: true,
  name: "Unit Converter",
  options: [
    {
      defaultValue: "bytes",
      id: "category",
      label: "Category",
      options: [
        { label: "Data", value: "bytes" },
        { label: "Time", value: "time" },
        { label: "Transfer Rate", value: "transfer" },
        { label: "Temperature", value: "temperature" },
        { label: "Length", value: "length" },
      ],
      type: "select",
    },
    {
      defaultValue: "B",
      id: "from",
      label: "From",
      options: [
        { label: "Bytes", value: "B" },
        { label: "KB", value: "KB" },
        { label: "MB", value: "MB" },
        { label: "GB", value: "GB" },
        { label: "TB", value: "TB" },
        { label: "PB", value: "PB" },
        { label: "EB", value: "EB" },
      ],
      type: "select",
    },
    {
      defaultValue: "MB",
      id: "to",
      label: "To",
      options: [
        { label: "Bytes", value: "B" },
        { label: "KB", value: "KB" },
        { label: "MB", value: "MB" },
        { label: "GB", value: "GB" },
        { label: "TB", value: "TB" },
        { label: "PB", value: "PB" },
        { label: "EB", value: "EB" },
      ],
      type: "select",
    },
  ],
  placeholder: "Enter value to convert...",
});

registerTool("format:code", codeFormatHandler, {
  category: "Format",
  hasInput: true,
  name: "Code Formatter",
  options: [
    {
      defaultValue: "javascript",
      id: "language",
      label: "Language",
      options: [
        { label: "JavaScript", value: "javascript" },
        { label: "TypeScript", value: "typescript" },
      ],
      type: "select",
    },
    {
      defaultValue: 2,
      id: "tabWidth",
      label: "Tab Width",
      max: 8,
      min: 1,
      type: "number",
    },
    {
      defaultValue: 80,
      id: "printWidth",
      label: "Line Width",
      max: 200,
      min: 40,
      type: "number",
    },
  ],
  placeholder: "Paste code to format...",
});

registerTool("format:sql", sqlFormatHandler, {
  category: "Format",
  hasInput: true,
  name: "SQL Formatter",
  options: [
    {
      defaultValue: "sql",
      id: "language",
      label: "SQL Dialect",
      options: [
        { label: "Standard SQL", value: "sql" },
        { label: "MySQL", value: "mysql" },
        { label: "PostgreSQL", value: "postgresql" },
        { label: "SQLite", value: "sqlite" },
      ],
      type: "select",
    },
    {
      defaultValue: "standard",
      id: "indentStyle",
      label: "Indent Style",
      options: [
        { label: "Standard", value: "standard" },
        { label: "Tabular Left", value: "tabularLeft" },
        { label: "Tabular Right", value: "tabularRight" },
      ],
      type: "select",
    },
    {
      defaultValue: 2,
      id: "linesBetweenQueries",
      label: "Lines Between Queries",
      max: 5,
      min: 1,
      type: "number",
    },
    {
      defaultValue: 2,
      id: "tabWidth",
      label: "Tab Width",
      max: 8,
      min: 1,
      type: "number",
    },
  ],
  placeholder: "Paste SQL to format...",
});

registerTool("format:data", dataFormatHandler, {
  category: "Format",
  hasInput: true,
  name: "Data Formatter",
  options: [
    {
      defaultValue: "json",
      id: "language",
      label: "Format",
      options: [
        { label: "JSON", value: "json" },
        { label: "YAML", value: "yaml" },
        { label: "XML", value: "xml" },
      ],
      type: "select",
    },
    {
      defaultValue: 2,
      id: "tabWidth",
      label: "Tab Width",
      max: 8,
      min: 1,
      type: "number",
    },
  ],
  placeholder: "Paste JSON, YAML, or XML to format...",
});

registerTool("regex:test", regexTestHandler, {
  category: "Advanced",
  hasInput: false,
  name: "Regex Tester",
  options: [
    {
      defaultValue: "",
      id: "pattern",
      label: "Regex Pattern",
      placeholder: "Enter regex pattern (e.g., ^[a-z]+$)",
      type: "text",
    },
    {
      defaultValue: "",
      id: "text",
      label: "Test Text",
      placeholder: "Enter text to test against pattern...",
      rows: 6,
      type: "textarea",
    },
    {
      defaultValue: "g",
      id: "flags",
      label: "Flags",
      options: [
        { label: "Global (g)", value: "g" },
        { label: "Case Insensitive (i)", value: "i" },
        { label: "Multiline (m)", value: "m" },
        { label: "Global + Case Insensitive (gi)", value: "gi" },
        { label: "Global + Multiline (gm)", value: "gm" },
      ],
      type: "select",
    },
  ],
});

registerTool("color:picker", colorPickerHandler, {
  category: "Advanced",
  hasInput: false,
  name: "Color Picker",
  options: [
    {
      defaultValue: "#3498db",
      id: "color",
      label: "Select Color",
      type: "color",
    },
  ],
});

registerTool("certificate:analyze", certificateAnalyzeHandler, {
  category: "Advanced",
  hasInput: true,
  name: "Certificate Analyzer",
  placeholder: "Enter PEM or DER certificate...",
});
