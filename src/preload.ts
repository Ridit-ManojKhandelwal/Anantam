/*---------------------------------------------------------------------------------------------
 *  Copyright (c) MNovus. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { ipcRenderer, contextBridge } from "electron";
import { path_join } from "./shared/functions";
import { store } from "./shared/store";
import { set_folder_structure } from "./shared/rdx-slice";

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
      if (e.key.toLowerCase() == "enter") {
        const targetEditableEl = e.currentTarget as HTMLElement;
        const value = targetEditableEl.innerText;

        if (value != "") {
          renderer.create_file({
            path: path_join([data.path, value]),
            fileName: value.trim(),
            rootPath: data.rootPath,
          });
        }
        new_file_item?.remove();
      }
    } catch (error) {
      console.log(error);
    }
  };

  (new_file_item.querySelector(".file-name") as HTMLElement).onblur = (e) => {
    const targetEditableEl = e.currentTarget as HTMLElement;
    const value = targetEditableEl.innerText;

    if (value != "") {
      renderer.create_file({
        path: path_join([data.path, value]),
        fileName: value,
        rootPath: data.rootPath,
      });
    }
    new_file_item.remove();
  };

  function sanitizeSelector(selector: string): string {
    return selector.replace(/([^\w-])/g, "\\$1"); // Only escape invalid characters like spaces, colons, etc.
  }

  const selector = sanitizeSelector(
    `#list-wrapper-${data.path.replace(/\/|\\|\./g, "-")}`
  );

  const targetEl = document.querySelector(selector);
  if (targetEl) {
    const contentList = targetEl.querySelector(".content-list");
    if (contentList) {
      contentList.prepend(new_file_item);
    }
  }
});

ipcRenderer.on("command-update-folder-structure", (event, data) => {
  console;
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
  clear_folder: () => {
    /** Added after the tutorial for clearing the folder, for testing */
    ipcRenderer.send("clear-folder");
  },
  get_file_content: async (path: string) => {
    const file_content = await ipcRenderer.invoke("get-file-content", path);
    return file_content;
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
  create_project_anantam_config_file: (data: {
    path: string;
    interpreter_path: string;
  }) => {
    ipcRenderer.send("create-project-anantam-config-file", data);
  },
  create_project_anantam_file: (data: { path: string; content: string }) => {
    ipcRenderer.send("create-project-anantam-file", data);
  },
  create_folder: (data: { path: string }) => {
    ipcRenderer.send("create-folder", data);
  },
  set_folder: (folder: string) => {
    ipcRenderer.send("set-folder", folder);
  },
  reload_window: (folder: string) => {
    ipcRenderer.send("refresh-window", folder);
  },
};

contextBridge.exposeInMainWorld("electron", renderer);

export type ERenderer = typeof renderer;
