import type { ColorOptions, ToolResult } from "../../types/index";
import chroma from "chroma-js";

export const colorPickerHandler = async (
  input: string,
  options?: ColorOptions,
): Promise<ToolResult> => {
  try {
    const color = options?.color || input;

    if (!color) {
      return { error: "Color input is required", success: false };
    }

    const c = chroma(color);

    const rgbValues = c.rgb();
    const result = {
      brightness: Math.round(c.luminance() * 255),
      hex: c.hex(),
      hsl: c.css("hsl").replace(/(\d+)deg\s+(\d+)%\s+(\d+)%/g, "$1deg, $2%, $3%"),
      hsv: c.hsv(),
      input: color,
      lab: c.css("lab"),
      luminance: c.luminance().toFixed(3),
      name: c.name() || "N/A",
      rgb: `rgb(${rgbValues[0]}, ${rgbValues[1]}, ${rgbValues[2]})`,
      rgba:
        c.alpha() < 1
          ? `rgba(${rgbValues[0]}, ${rgbValues[1]}, ${rgbValues[2]}, ${c.alpha()})`
          : `rgb(${rgbValues[0]}, ${rgbValues[1]}, ${rgbValues[2]})`,
    };

    return {
      metadata: {
        input: color,
      },
      output: JSON.stringify(result, undefined, 2),
      success: true,
    };
  } catch (error: unknown) {
    return {
      error: error instanceof Error ? error.message : "An error occurred",
      success: false,
    };
  }
};
