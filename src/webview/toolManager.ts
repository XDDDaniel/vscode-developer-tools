import type { BaseToolOptions, ToolMetadata, ToolResult } from "../types/index";

interface ToolRegistration {
  handler: (input: string, options?: BaseToolOptions) => Promise<ToolResult>;
  metadata: ToolMetadata;
}

const tools: Record<string, ToolRegistration> = {};

export const registerTool = (
  id: string,
  handler: (input: string, options?: BaseToolOptions) => Promise<ToolResult>,
  metadata?: Partial<ToolMetadata>,
) => {
  tools[id] = {
    handler,
    metadata: {
      category: metadata?.category || "Other",
      hasInput: metadata?.hasInput ?? true,
      id,
      name: metadata?.name || id,
      options: metadata?.options,
      placeholder: metadata?.placeholder,
    },
  };
};

export const executeTool = async (
  toolId: string,
  input: string,
  options?: BaseToolOptions,
): Promise<ToolResult> => {
  const tool = tools[toolId];
  if (!tool) {
    return {
      error: `Tool "${toolId}" not found`,
      success: false,
    };
  }

  try {
    return await tool.handler(input, options);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      error: errorMessage,
      success: false,
    };
  }
};

export const getAllToolMetadata = (): ToolMetadata[] => Object.values(tools).map((t) => t.metadata);
