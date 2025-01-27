/* eslint-disable @typescript-eslint/no-unused-vars */
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) MNovus. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { ipcRenderer, contextBridge } from "electron";
import { MainContext, makeContentList, path_join } from "./shared/functions";

const validateName = (name: string): string | null => {
  const invalidChars = /[\/:*?"<>|]/g;
  return null;
};

const handleNameInput = (name: string) => {
  const error = validateName(name.trim());
  if (error) {
    console.error(error);
    return false;
  }
  return true;
};

ipcRenderer.on("command-create-file", (event, data) => {
  const new_file_item = document.createElement("div");
  new_file_item.className = "content-item new-file-item";
  new_file_item.innerHTML = `
        <div>
            <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="none"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g fill="#d2d4d3"> <path d="M1.75 3a.75.75 0 000 1.5h12.5a.75.75 0 000-1.5H1.75zM1.75 6a.75.75 0 000 1.5h9.5a.75.75 0 000-1.5h-9.5zM1 9.75A.75.75 0 011.75 9h12.5a.75.75 0 010 1.5H1.75A.75.75 0 011 9.75zM1.75 12a.75.75 0 000 1.5h9.5a.75.75 0 000-1.5h-9.5z"></path> </g> </g></svg>
        </div>
        <div class="file-name" contenteditable="true"></div>
    `;
  setTimeout(() => {
    (new_file_item.querySelector(".file-name") as HTMLElement).focus();
  }, 0);

  (new_file_item.querySelector(".file-name") as HTMLElement).onkeyup = (e) => {
    try {
      if (e.key.toLowerCase() === "enter") {
        const targetEditableEl = e.currentTarget as HTMLElement;
        const value = targetEditableEl.innerText.trim();

        if (handleNameInput(value)) {
          renderer.create_file({
            path: path_join([data.path, value]),
            fileName: value,
            rootPath: data.rootPath,
          });
          new_file_item?.remove();
        }
      }
    } catch (error) {
      console.error("Error handling file name input:", error);
    }
  };

  (new_file_item.querySelector(".file-name") as HTMLElement).onblur = (e) => {
    const targetEditableEl = e.currentTarget as HTMLElement;
    const value = targetEditableEl.innerText.trim();

    if (handleNameInput(value)) {
      renderer.create_file({
        path: path_join([data.path, value]),
        fileName: value,
        rootPath: data.rootPath,
      });
      new_file_item.remove();
    }
  };

  const targetEl = document
    .querySelector(`#list-wrapper-${data.path.replace(/\/|\\|\./g, "-")}`)
    .querySelector(".content-list");
  targetEl.prepend(new_file_item);
});

ipcRenderer.on("command-create-folder", (event, data) => {
  const new_folder_item = document.createElement("div");
  new_folder_item.className = "content-item";
  new_folder_item.innerHTML = `
      <div>
          <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="none">
            <path fill="#FFD700" d="M2 4a1 1 0 011-1h4l1 1h5a1 1 0 011 1v7a1 1 0 01-1 1H3a1 1 0 01-1-1V4z"/>
          </svg>
      </div>
      <div class="content-item" contenteditable="true"></div>
  `;
  setTimeout(() => {
    (new_folder_item.querySelector(".content-item") as HTMLElement).focus();
  }, 0);

  (new_folder_item.querySelector(".content-item") as HTMLElement).onkeyup = (
    e
  ) => {
    try {
      if (e.key.toLowerCase() === "enter") {
        const targetEditableEl = e.currentTarget as HTMLElement;
        const value = targetEditableEl.innerText.trim();

        if (handleNameInput(value)) {
          renderer.create_folder({
            path: path_join([data.path, value]),
            fileName: value,
            rootPath: data.rootPath,
          });
          new_folder_item?.remove();
        }
      }
    } catch (error) {
      console.error("Error handling folder name input:", error);
    }
  };

  (new_folder_item.querySelector(".content-item") as HTMLElement).onblur = (
    e
  ) => {
    const targetEditableEl = e.currentTarget as HTMLElement;
    const value = targetEditableEl.innerText.trim();

    if (handleNameInput(value)) {
      renderer.create_folder({
        path: path_join([data.path, value]),
        fileName: value,
        rootPath: data.rootPath,
      });
      new_folder_item.remove();
    }
  };

  const targetEl = document
    .querySelector(`#list-wrapper-${data.path.replace(/\/|\\|\./g, "-")}`)
    .querySelector(".content-list");
  targetEl.prepend(new_folder_item);
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
};

contextBridge.exposeInMainWorld("electron", renderer);

export type ERenderer = typeof renderer;
