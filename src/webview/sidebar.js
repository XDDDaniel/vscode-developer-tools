const vscode = acquireVsCodeApi();
const toolSelect = document.getElementById("toolSelect");
const input = document.getElementById("input");
const output = document.getElementById("output");
const executeBtn = document.getElementById("execute");
const clearBtn = document.getElementById("clear");
const copyBtn = document.getElementById("copy");

let currentTool = "base64";
let toolsMetadata = {};

const sendReadyMessage = () => {
  vscode.postMessage({ type: "ui:ready" });
};

const createOptionElement = (option) => {
  const wrapper = document.createElement("div");
  wrapper.className = "option-wrapper";

  const label = document.createElement("label");
  label.textContent = option.label;
  label.htmlFor = `option-${option.id}`;
  wrapper.appendChild(label);

  let inputElement;

  switch (option.type) {
    case "select": {
      inputElement = document.createElement("select");
      inputElement.id = `option-${option.id}`;
      inputElement.name = option.id;
      if (option.options) {
        for (const opt of option.options) {
          const optionEl = document.createElement("option");
          optionEl.value = opt.value;
          optionEl.textContent = opt.label;
          if (opt.value === option.defaultValue) {
            optionEl.selected = true;
          }
          inputElement.appendChild(optionEl);
        }
      }
      break;
    }

    case "checkbox": {
      inputElement = document.createElement("input");
      inputElement.type = "checkbox";
      inputElement.id = `option-${option.id}`;
      inputElement.name = option.id;
      if (option.defaultValue) {
        inputElement.checked = true;
      }
      break;
    }

    case "number": {
      inputElement = document.createElement("input");
      inputElement.type = "number";
      inputElement.id = `option-${option.id}`;
      inputElement.name = option.id;
      inputElement.value = option.defaultValue || 0;
      if (option.min !== undefined) {
        inputElement.min = option.min;
      }
      if (option.max !== undefined) {
        inputElement.max = option.max;
      }
      break;
    }

    case "color": {
      inputElement = document.createElement("input");
      inputElement.type = "color";
      inputElement.id = `option-${option.id}`;
      inputElement.name = option.id;
      inputElement.value = option.defaultValue || "#3498db";
      break;
    }

    case "textarea": {
      inputElement = document.createElement("textarea");
      inputElement.id = `option-${option.id}`;
      inputElement.name = option.id;
      inputElement.placeholder = option.placeholder || "";
      inputElement.rows = option.rows || 4;
      break;
    }

    case "text":
    default: {
      inputElement = document.createElement("input");
      inputElement.type = "text";
      inputElement.id = `option-${option.id}`;
      inputElement.name = option.id;
      inputElement.value = option.defaultValue || "";
      if (option.placeholder) {
        inputElement.placeholder = option.placeholder;
      }
      break;
    }
  }

  wrapper.appendChild(inputElement);
  return wrapper;
};

const updateToolUI = (toolId) => {
  const tool = toolsMetadata[toolId];
  if (!tool) {
    console.warn("Tool not found:", toolId);
    return;
  }

  if (tool.hasInput) {
    input.style.display = "block";
    input.placeholder = tool.placeholder || "Enter text...";
    document.getElementById("input-label").style.display = "block";
  } else {
    input.style.display = "none";
    input.value = "";
    document.getElementById("input-label").style.display = "none";
  }

  const optionsContainer = document.getElementById("options-container");

  if (optionsContainer) {
    optionsContainer.innerHTML = "";
  }

  if (tool.options && tool.options.length > 0) {
    if (!optionsContainer) {
      const container = document.createElement("div");
      container.id = "options-container";
      container.className = "options-container";
      input.parentElement.insertBefore(container, input.nextSibling);
    }
    const actualOptionsContainer = document.getElementById("options-container");
    for (const option of tool.options) {
      actualOptionsContainer.appendChild(createOptionElement(option));
    }
  }

  output.innerHTML = "";

  if (toolId === "json:schema") {
    const outputSection = document.querySelector(".output-section");
    if (outputSection) {
      outputSection.style.display = "none";
    }
  } else {
    const outputSection = document.querySelector(".output-section");
    if (outputSection) {
      outputSection.style.display = "flex";
    }
  }
};

const getToolOptions = () => {
  const tool = toolsMetadata[currentTool];
  if (!tool || !tool.options) {
    return {};
  }

  const options = {};
  const optionsContainer = document.getElementById("options-container");
  if (!optionsContainer) {
    return options;
  }

  for (const option of tool.options) {
    const element = optionsContainer.querySelector(`[name="${option.id}"]`);
    if (element) {
      if (option.type === "checkbox") {
        options[option.id] = element.checked;
      } else if (option.type === "number") {
        options[option.id] = Number.parseInt(element.value, 10) || 0;
      } else {
        options[option.id] = element.value;
      }
    }
  }

  return options;
};

toolSelect.addEventListener("change", () => {
  currentTool = toolSelect.value;
  updateToolUI(currentTool);
});

executeBtn.addEventListener("click", () => {
  const inputValue = input.value;
  const options = getToolOptions();
  vscode.postMessage({
    data: { input: inputValue, options },
    tool: currentTool,
    type: "tool:execute",
  });
});

clearBtn.addEventListener("click", () => {
  hideError();
  input.value = "";
  output.innerHTML = "Result will appear here...";
  output.classList.add("empty");

  const optionsContainer = document.getElementById("options-container");
  if (optionsContainer) {
    const inputs = optionsContainer.querySelectorAll("input, textarea, select");
    for (const element of inputs) {
      if (element.type === "color") {
        element.value = "#3498db";
      } else if (element.tagName === "SELECT") {
        const firstOption = element.querySelector("option");
        if (firstOption) {
          element.value = firstOption.value;
        }
      } else {
        element.value = "";
      }
    }
  }
});

copyBtn.addEventListener("click", () => {
  if (output && output.textContent && !output.classList.contains("empty")) {
    const textToCopy = output.textContent.trim();
    navigator.clipboard.writeText(textToCopy).then(() => {
      copyBtn.textContent = "Copied!";
      setTimeout(() => {
        copyBtn.textContent = "Copy";
      }, 1500);
    });
  }
});

output.addEventListener("click", () => {
  if (output.textContent && output.textContent.trim() && !output.classList.contains("empty")) {
    navigator.clipboard.writeText(output.textContent.trim()).then(() => {
      output.style.background = "var(--vscode-textBlockQuote-background)";
      setTimeout(() => {
        output.style.background = "var(--vscode-textCodeBlock-background)";
      }, 200);
    });
  }
});

window.addEventListener("message", (event) => {
  const message = event.data;
  if (message.type === "tool:result") {
    output.classList.remove("empty");
    if (message.result.success) {
      if (message.result.metadata?.message) {
        showSuccess(message.result.metadata.message);
        output.innerHTML = "";
        hideError();
      } else {
        output.innerHTML = `<pre class="success">${escapeHtml(message.result.output || "")}</pre>`;
        hideError();
        hideSuccess();
      }
    } else {
      showError(message.result.error || "An error occurred");
      output.innerHTML = "";
      hideSuccess();
    }
  } else if (message.type === "tools:metadata") {
    toolsMetadata = {};
    for (const tool of message.tools) {
      toolsMetadata[tool.id] = tool;
    }
    updateToolUI(currentTool);
  }
});

sendReadyMessage();

const escapeHtml = (text) => {
  const map = {
    '"': "&quot;",
    "&": "&amp;",
    "'": "&#039;",
    "<": "&lt;",
    ">": "&gt;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
};

let errorTimer;
let successTimer;

const showError = (message) => {
  const errorNotification = document.getElementById("error-notification");
  const errorMessage = errorNotification.querySelector(".error-message");

  errorMessage.textContent = message;
  errorNotification.classList.remove("hidden");

  if (errorTimer) {
    clearTimeout(errorTimer);
  }

  errorTimer = setTimeout(() => {
    errorNotification.classList.add("hidden");
    errorTimer = undefined;
  }, 10_000);
};

const hideError = () => {
  const errorNotification = document.getElementById("error-notification");
  errorNotification.classList.add("hidden");
  if (errorTimer) {
    clearTimeout(errorTimer);
    errorTimer = undefined;
  }
};

const showSuccess = (message) => {
  const successNotification = document.getElementById("success-notification");
  const successMessage = successNotification.querySelector(".success-message");

  successMessage.textContent = message;
  successNotification.classList.remove("hidden");

  if (successTimer) {
    clearTimeout(successTimer);
  }

  successTimer = setTimeout(() => {
    successNotification.classList.add("hidden");
    successTimer = undefined;
  }, 10_000);
};

const hideSuccess = () => {
  const successNotification = document.getElementById("success-notification");
  successNotification.classList.add("hidden");
  if (successTimer) {
    clearTimeout(successTimer);
    successTimer = undefined;
  }
};

document.querySelector(".error-close-btn").addEventListener("click", hideError);
document.querySelector(".success-close-btn").addEventListener("click", hideSuccess);
