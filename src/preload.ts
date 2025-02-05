/* eslint-disable @typescript-eslint/no-unused-vars */
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) MNovus. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { ipcRenderer, contextBridge } from "electron";
import { MainContext, path_join } from "./shared/functions";

const validateName = (name: string): string | null => {
  const invalidChars = /[\/:*?"<>|]/g;
  return null;
};

ipcRenderer.on("show-tools", async (event, data) => {
  console.log("Data received:", data);

  event.sender.send("send-tools-data", data);
});

ipcRenderer.on("send-tools-data", (event, parsedData) => {
  console.log("Parsed Data:", parsedData);
});

ipcRenderer.on("show-code", (event, data) => {
  try {
    const output_document = document.querySelector(".output");
    const info_document = document.querySelector(".info-text");
    const done_document = document.querySelector(".done-text");

    info_document.innerHTML = `<span style="color: skyblue;">[Running]</span><span style="color: lightgreen;"> ${data.command} </span>`;
    done_document.innerHTML = `<span style="color: skyblue;">${
      data.isError ? "[Error]" : "[Done]"
    }</span><span style="color: ${data.isError ? "orange" : "lightgreen"};"> ${
      data.isError ? data.error : `Exited with code=${data.exited}`
    }</span>`;

    // If the code is about to start, clear the previous output
    if (!data.isError && data.output === "Running code...") {
      output_document.innerHTML = ""; // Clear the previous output before running
    }

    // Create a new div or pre element for the output
    const outputMessage = document.createElement("div");
    outputMessage.style.whiteSpace = "pre-wrap"; // Ensure text wraps nicely
    outputMessage.textContent = data.output; // Use textContent to prevent HTML injection

    // Append the new output message
    output_document.appendChild(outputMessage);
  } catch {
    return;
  }
});

ipcRenderer.on("command-update-folder-structure", (event, data) => {
  // Handle the data and send back updates
  // Notify renderer process that the folder has been updated
  event.sender.send("folder-updated", data.updatedData);
});

ipcRenderer.on("new-folder-opened", (event, data) => {
  window.location.reload();
});

const renderer = {
  openFolder: async () => {
    const folder = await ipcRenderer.invoke("open-folder");
    return folder;
  },
  get_folder: async () => {
    const folder = await ipcRenderer.invoke("get-folder");
    return folder;
  },
  open_set_folder: async () => {
    const folder = await ipcRenderer.invoke("open-set-folder");
    return folder;
  },
  clear_folder: () => {
    /** Added after the tutorial for clearing the folder, for testing */
    ipcRenderer.send("clear-folder");
  },
  get_file_content: async (path: string) => {
    try {
      const file_content = await ipcRenderer.invoke("get-file-content", path);
      return file_content;
    } catch {
      return "error fetching file content";
    }
  },
  save_file: (data: { path: string; content: string }) => {
    ipcRenderer.send("save-file", data);
  },
  show_contextmenu: (data: {
    path: string;
    type: "folder" | "file";
    rootPath: string;
  }) => {
    const response = ipcRenderer.send("folder-contextmenu", data);
  },
  varinfo_contextmenu: (data: { name: string; path: string }) => {
    const response = ipcRenderer.send("datavarinfotitle-contextmenu", data);
  },
  create_file: (data: { path: string; fileName: string; rootPath: string }) => {
    ipcRenderer.send("create-file", data);
  },
  openNewProjectFolder: () => ipcRenderer.invoke("open-folder-new-project"),
  create_folder: (data: {
    path: string;
    fileName: string;
    rootPath: string;
  }) => {
    ipcRenderer.send("create-folder", data);
  },
  set_folder: (folder: string) => {
    ipcRenderer.send("set-folder", folder);
  },
  reload_window: (folder: string) => {
    ipcRenderer.send("refresh-window", folder);
  },
  run_code: (data: { path: string; script: string }) => {
    ipcRenderer.invoke("run-code", data);
  },
  ipcRenderer: {
    send: (channel: any, data: any) => {
      ipcRenderer.send(channel, data);
    },
    invoke: (channel: any, data: any) => {
      ipcRenderer.invoke(channel, data);
    },
    on: (channel: any, func: any) => {
      ipcRenderer.on(channel, (event, ...args) => func(event, ...args));
    },
    removeAllListeners: (channel: any) => {
      ipcRenderer.removeAllListeners(channel);
    },
    removeListener: (channel: any, listener: any) => {
      ipcRenderer.removeListener(channel, listener);
    },
  },
  new_folder_input: (data: {
    path: string;
    type: string;
    rootPath: string;
  }) => {
    ipcRenderer.send("new-folder-input", data);
  },
  new_file_input: (data: { path: string; type: string; rootPath: string }) => {
    ipcRenderer.send("new-file-input", data);
  },
  minimize_window: () => {
    ipcRenderer.send("minimize");
  },
  maximize_window: () => {
    ipcRenderer.send("maximize");
  },
  close_window: () => {
    ipcRenderer.send("close");
  },
  set_settings: (data: { script: string }) => {
    ipcRenderer.send("set-settings", data);
  },
  get_settings: async () => {
    const settings = await ipcRenderer.invoke("get-settings");
    return settings;
  },
  set_interpreter: (data: { path: string }) => {
    ipcRenderer.send("set-interpreter", data);
  },
  get_interpreter: async () => {
    const interpreter = await ipcRenderer.invoke("get-interpreter");
    return interpreter;
  },
  selectInterpreter: async () =>
    ipcRenderer.invoke("dialog:select-interpreter"),
  get_variables: async (path: string) => {
    const vars = await ipcRenderer.invoke("get-variables", path);
    return vars;
  },
  get_data_studio_variables: async () => {
    const vars = await ipcRenderer.invoke("get-data-studio-variables");
    return vars;
  },
  set_data_studio_variables: async (vars: any[]) => {
    ipcRenderer.send("set-data-studio-variables", vars);
  },
  show_tools: () => {
    ipcRenderer.invoke("show-tools");
  },
  hide_tools: () => {
    ipcRenderer.invoke("hide-tools");
  },
  readExcelFile: ({ filePath, skipRows }: any) =>
    ipcRenderer.invoke("read-excel-file", filePath, skipRows),
};

contextBridge.exposeInMainWorld("electron", renderer);

export type ERenderer = typeof renderer;
