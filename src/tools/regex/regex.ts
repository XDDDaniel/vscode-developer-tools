import type { RegexOptions, ToolResult } from "../../types/index";

export const regexTestHandler = async (
  input: string,
  options?: RegexOptions,
): Promise<ToolResult> => {
  try {
    const pattern = options?.pattern || "";
    const text = options?.text || input;
    const flags = options?.flags || "";
    const isGlobal = flags === "g" || flags === "gi" || flags === "gm";

    if (!pattern) {
      return {
        error: "Regex pattern is required",
        metadata: { flags, pattern: "" },
        output: "No pattern provided",
        success: true,
      };
    }

    let regex: RegExp;
    try {
      regex = new RegExp(pattern, flags);
    } catch {
      return { error: "Invalid regex pattern", success: false };
    }

    const matches = text.match(regex);

    if (matches) {
      const matchCount = matches.length;

      if (isGlobal) {
        const matchDetails = matches.map((match: string, index: number) => {
          const matchIndex = text.indexOf(match);
          return {
            index,
            length: match.length,
            match,
            position: matchIndex,
          };
        });

        return {
          metadata: {
            flags,
            matchCount,
            pattern,
          },
          output: JSON.stringify(matchDetails, undefined, 2),
          success: true,
        };
      }

      const [firstMatch] = matches;
      if (typeof firstMatch === "string") {
        return {
          metadata: {
            flags,
            matchCount: 1,
            pattern,
          },
          output: `Match: ${firstMatch}`,
          success: true,
        };
      }

      return {
        metadata: {
          flags,
          matchCount,
          pattern,
        },
        output: `Match: ${JSON.stringify(firstMatch)}`,
        success: true,
      };
    } else {
      return {
        metadata: {
          flags,
          matchCount: 0,
          pattern,
        },
        output: "No matches found",
        success: true,
      };
    }
  } catch (error: unknown) {
    return {
      error: error instanceof Error ? error.message : "Regex test failed",
      success: false,
    };
  }
};
