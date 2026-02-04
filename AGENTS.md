# Developer Tools Extension - AI Agent Instructions

## Overview

This is a VS Code extension that provides a comprehensive collection of developer utilities in a sidebar webview. It includes tools for:

- **Encoding/Decoding**: Base64, URL, HTML entities, JWT, etc.
- **Generators**: UUID, Lorem Ipsum, passwords, dummy data
- **Hash & Crypto**: MD5, SHA-256/512, HMAC
- **JSON Tools**: Formatting, validation, conversion (JSON ↔ YAML ↔ XML)
- **Text Tools**: Diff, case conversion, sorting
- **Format**: Code formatting with syntax highlighting
- **Color Tools**: Conversion between RGB, HEX, HSL
- **Date/Time**: Timestamp converters, timezone tools
- **Units**: Conversion for bytes, length, weight, temperature
- **Regex**: Test and debug regular expressions
- **Certificates**: X.509 parser and decoder

## Debugging & Testing

- **Run Extension**: Press `F5` to open Extension Development Host
- **Reload Extension**: `Ctrl+R` (Cmd+R on Mac) in the Extension Development Host
- **View Logs**: Open DevTools with `Help > Toggle Developer Tools`
- **Run Tests**: `npm test` (runs extension tests in VS Code)

## Build Commands

- `npm run compile` - Build the extension with esbuild
- `npm run watch` - Watch mode (parallel esbuild + type checking)

## Linting & Formatting

- `npm run lint` - Run oxlint (fast JavaScript/TypeScript linter)
- `npm run lint:fix` - Fix oxlint issues automatically
- `npm run format` - Check formatting with oxfmt (configured in `oxformat.json`)
- `npm run format:fix` - Fix formatting with oxfmt
- `npm run knip` - Check for unused code and dependencies
- `npm run check` - Run all checks (lint, format, check-types, and knip) - **execute this before committing**

## Type Checking

- `npm run check-types` - Run TypeScript type checking (tsc --noEmit)

## Testing

- `npm test` - Run VS Code extension tests

## Project Structure

```
src/
├── extension.ts          # Extension entry point
├── webview/              # Webview UI files
│   ├── sidebar.js       # Client-side logic
│   ├── sidebar.html     # HTML template
│   ├── sidebar.css      # Styles
│   └── toolManager.ts   # Tool registration system
├── tools/               # Tool implementations
│   ├── registerTools.ts # Central tool registration file
│   ├── certificate/     # Handler functions for certificate tools
│   ├── color/           # Handler functions for color tools
│   ├── datetime/        # Handler functions for datetime tools
│   ├── encoding/        # Handler functions for encoding tools
│   ├── format/          # Handler functions for formatting tools
│   ├── generators/      # Handler functions for generator tools
│   ├── hash/            # Handler functions for hash tools
│   ├── json/            # Handler functions for JSON tools
│   ├── regex/           # Handler functions for regex tools
│   ├── text/            # Handler functions for text tools
│   └── units/           # Handler functions for unit conversion tools
├── types/               # TypeScript type definitions
└── utils/               # Shared utility functions

test/
└── extension.test.ts    # Extension tests
```

## Tool Registration

Tools are registered centrally in `src/tools/registerTools.ts`. Each tool file exports handler functions containing only business logic.

### Creating a New Tool

1. **Create handler function** in the appropriate tool directory (e.g., `src/tools/encoding/encoding.ts`):

```typescript
import type { ToolResult } from "../../types/index.js";

export const myToolHandler = async (input: string, options?: any): Promise<ToolResult> => {
  try {
    // Business logic here
    const result = processInput(input, options);
    return { success: true, output: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};
```

2. **Register the tool** in `src/tools/registerTools.ts`:

```typescript
import { myToolHandler } from "./encoding/encoding.js";

registerTool(
  "tool:id",
  myToolHandler,
  {
    name: "Tool Name",
    category: "Category",
    hasInput: true,
    placeholder: "Placeholder text...",
    options: [
      // Configuration options
    ],
  },
);
```

### Architecture Principles

- **Functional Programming**: The codebase emphasizes functional programming patterns - pure functions, immutability, and avoiding side effects in handler functions
- **Separation of Concerns**: Tool files contain only business logic (handler functions)
- **Central Registration**: All tool metadata and registrations are in `registerTools.ts`
- **Import Organization**: `extension.ts` imports only `registerTools.ts`
- **Handler Naming**: Use descriptive names like `base64Handler`, `textCaseHandler`, etc.

### Existing Tool Structure

- `encoding/encoding.ts` - exports `base64Handler`, `base32Handler`, `urlHandler`, `jwtHandler`
- `text/text.ts` - exports `textCaseHandler`, `textSortHandler`, `textFilterHandler`, `textEscapeHandler`, `textFormatHandler`
- `generators/generators.ts` - exports `uuidGenerateHandler`, `ulidGenerateHandler`, `nanoidGenerateHandler`, `passwordGenerateHandler`, `loremGenerateHandler`, `qrcodeGenerateHandler`, `barcodeGenerateHandler`
- `json/json.ts` - exports `jsonPathHandler`, `jsonSchemaHandler`
- `hash/hash.ts` - exports `md5Handler`, `sha1Handler`, `sha256Handler`, `sha512Handler`
- `datetime/datetime.ts` - exports `datetimeConverterHandler`
- `units/units.ts` - exports `unitsConvertHandler`
- `format/format.ts` - exports `codeFormatHandler`, `sqlFormatHandler`
- `regex/regex.ts` - exports `regexTestHandler`
- `color/color.ts` - exports `colorPickerHandler`
- `certificate/certificate.ts` - exports `certificateAnalyzeHandler`

## Dependencies

### Build Tools

- `esbuild` - Fast bundler for extension code
- `typescript` - Type checking and compilation
- `oxlint` - Fast Rust-based JavaScript/TypeScript linter
- `oxfmt` - Fast Rust-based code formatter (oxc project)

### Runtime Dependencies

- Utility libraries: `chroma-js`, `crypto-js`, `date-fns`, `iconv-lite`, `js-yaml`, etc.
- `prettier` - Code formatting engine (used as a feature in the Format tool)
- `highlight.js` - Syntax highlighting for code display

## Important Notes

- Always run `npm run check` after making changes - this runs lint, format check, check-types, and knip
- Run `npm run check-types` to verify TypeScript types
- Code formatting uses `oxfmt` (configured in `oxformat.json`) - NOT Prettier for source code
- The extension outputs to `dist/extension.js`
- Source files use ES modules (`.ts` with import statements)
- Webview code runs in browser context and must be bundled separately
- Source files use `.ts` extension with ES modules (import statements)
- **Function Style**: Use arrow functions only (enforced by `func-style` rule in oxlint.json)
- **Tool Registration**: When adding a new tool, export only the handler function from the tool file and register it in `registerTools.ts`
