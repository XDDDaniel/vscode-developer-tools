import * as fs from "node:fs";
import * as path from "node:path";
import * as vscode from "vscode";
import { executeTool, getAllToolMetadata } from "./webview/toolManager";

import "./tools/registerTools";

export const activate = (context: vscode.ExtensionContext) => {
  console.log("Developer Tools extension is now active!");

  const sidebarViewProvider = new SidebarViewProvider(context.extensionUri);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider("developertools.sidebar", sidebarViewProvider),
  );
};

// Deactivate function is intentionally empty - no cleanup needed
// eslint-disable-next-line @typescript-eslint/no-empty-function
export const deactivate = () => {};

class SidebarViewProvider implements vscode.WebviewViewProvider {
  private _view?: vscode.WebviewView;

  constructor(private readonly _extensionUri: vscode.Uri) {}

  public resolveWebviewView(webviewView: vscode.WebviewView) {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    webviewView.webview.onDidReceiveMessage(async (data) => {
      switch (data.type) {
        case "ui:ready": {
          const tools = getAllToolMetadata();
          webviewView.webview.postMessage({
            tools,
            type: "tools:metadata",
          });
          break;
        }
        case "tool:execute": {
          try {
            const result = await executeTool(data.tool, data.data?.input || "", data.data?.options);
            webviewView.webview.postMessage({
              result,
              tool: data.tool,
              type: "tool:result",
            });
          } catch (error: unknown) {
            console.error("Tool execution error:", error);
            webviewView.webview.postMessage({
              result: {
                error: error instanceof Error ? error.message : "An error occurred",
                success: false,
              },
              tool: data.tool,
              type: "tool:result",
            });
          }
          break;
        }
        default: {
          console.warn(`Unknown message type: ${data.type}`);
          break;
        }
      }
    });
  }

  private _getHtmlForWebview = (webview: vscode.Webview): string => {
    const webviewPath = path.join(this._extensionUri.fsPath, "src", "webview");

    const htmlPath = path.join(webviewPath, "sidebar.html");
    const styleUri = webview.asWebviewUri(vscode.Uri.file(path.join(webviewPath, "sidebar.css")));
    const scriptUri = webview.asWebviewUri(vscode.Uri.file(path.join(webviewPath, "sidebar.js")));

    let html = fs.readFileSync(htmlPath, "utf8");

    html = html.replace(/{{cspSource}}/g, webview.cspSource);
    html = html.replace(/{{styleUri}}/g, styleUri.toString());
    html = html.replace(/{{scriptUri}}/g, scriptUri.toString());

    return html;
  };
}
