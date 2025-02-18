/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) MNovus. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// Import
import {
  app,
  BrowserWindow,
  ipcMain,
  dialog,
  Menu,
  MenuItem,
  autoUpdater,
} from "electron";

// FileSytem
import fs from "fs";

// Store for local storage
import Store from "electron-store";

import os from "os";

// For Terminal
import * as pty from "node-pty";

import path from "path";

import {
  setupTitlebar,
  attachTitlebarToWindow,
} from "custom-electron-titlebar/main";
import { spawn } from "child_process";

import axois from "axios";

const GEMINI_API_KEY = "AIzaSyBKAm1L-44z6F7KDUNd0yYGSouMzb72S3M";

// setup the titlebar main process
setupTitlebar();

// This allows TypeScript to pick up the magic constants that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const TOOLS_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

const SELECTED_FOLDER_STORE_NAME = "selected-folder";
const SETTINGS_STORE_NAME = "settings-store";
const INTERPRETER_STORE_NAME = "interpreter-store";
const DATASTUDIO_VARIABLES_STORE_NAME = " datastudio-variables-store";
const store = new Store();

interface Variable {
  name: string;
  type: string;
  value: string | number | boolean | null;
}

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

let mainWindow: BrowserWindow;
let splashWindow: BrowserWindow;
let toolsWindow: BrowserWindow;
let dataStudio: BrowserWindow;
let ptyProcess: pty.IPty;
let cwd;

const template = [
  {
    label: "File",
    submenu: [
      { label: "New Text File" },
      {
        label: "New File",
        accelerator: "Ctrl+N",
        click: () => {
          mainWindow.webContents.send("new-file-tab");
        },
      },
      { label: "New Window" },
      { type: "separator" },
      {
        label: "Open...",
        accelerator: "Ctrl+O",
        click: async () => {
          // Open the file dialog
          const result = await dialog.showOpenDialog(mainWindow, {
            properties: ["openFile"],
          });

          // Check if the user selected a file
          if (!result.canceled && result.filePaths.length > 0) {
            const filePath = result.filePaths[0];
            const fileName = filePath.split("/").pop(); // Extract file name

            // Send file name and full file path to the renderer process
            mainWindow.webContents.send("new-file-opened", {
              fileName,
              filePath,
            });
          }
        },
      },
      {
        label: "Open Folder...",
        click: async () => {
          const folder = await dialog.showOpenDialog(mainWindow, {
            properties: ["openDirectory"],
          });
          let structure = undefined;
          if (!folder.canceled) {
            console.log("folder", folder.filePaths[0]);
            const items = get_files(folder.filePaths[0]);
            structure = {
              id: 1,
              name: folder.filePaths[0],
              root: folder.filePaths[0],
              isFolder: true,
              items,
            };

            // @ts-ignore
            store.set(SELECTED_FOLDER_STORE_NAME, structure);
            mainWindow.webContents.send("new-folder-opened");
          }
        },
      },
      { label: "Open Workspace From File..." },
      { label: "Open Recent", submenu: [{ label: "Recent File" }] },
      { type: "separator" },
      { label: "Add Folder to Workspace" },
      { label: "Save Workspace As" },
      { label: "Duplicate Workspace" },
      { type: "separator" },
      {
        label: "Save",
        click: () => {
          mainWindow.webContents.send("save-current-file");
        },
        accelator: "Ctrl + S",
      },
      { label: "Save As..." },
      { label: "Save All" },
      { type: "separator" },
      { type: "separator" },
      { label: "Autosave", type: "checkbox", checked: true },
      { type: "separator" },
      { label: "Close Editor", role: "quit" },
      { label: "Close Folder", role: "quit" },
      { role: "quit" },
    ],
  },
  {
    label: "Edit",
    submenu: [
      { role: "undo" },
      { role: "redo" },
      { type: "separator" },
      { role: "cut" },
      { role: "copy" },
      { role: "paste" },
      { role: "delete" },
      { type: "separator" },
      { role: "selectAll" },
    ],
  },
  {
    label: "Selection",
    submenu: [
      { role: "selectAll" },
      { label: "Expand Selection" },
      { label: "Shrink Selection" },
      { type: "separator" },
      { label: "Copy Line Up" },
      { label: "Copy Line Down" },
      { label: "Move Line Up" },
      { label: "Move Line Down" },
      { label: "Duplicate Selection" },
      { type: "separator" },
      { label: "Add Cursor Above" },
      { label: "Add Cursor Below" },
      { label: "Add Cursor to Line Ends" },
      { label: "Add Next Occurrence" },
      { label: "Add Previous Occurrence" },
      { label: "Select All Occurrence" },
      { type: "separator" },
      { label: "Column Selection Mode" },
    ],
  },
  {
    label: "View",
    submenu: [
      { label: "Command Palette" },
      { label: "Open View" },
      { type: "separator" },
      {
        label: "Appearance",
        submenu: [
          { label: "Full Screen" },
          { label: "Zen Mode" },
          { label: "Center Layout" },
        ],
      },
      {
        label: "Editor Layout",
        submenu: [
          { label: "Split Up" },
          { label: "Split Down" },
          { label: "Split Left" },
          { label: "Split Right" },
          { type: "separator" },
          { label: "Split In Group" },
          { type: "separator" },
          { label: "Move Editor into New Window" },
          { label: "Copy Editor into New Window" },
          { type: "separator" },
          { label: "Single" },
          { label: "Two Columns" },
          { label: "Three Columns" },
          { label: "Two Rows" },
          { label: "Grid (2x2)" },
          { label: "Two Rows Right" },
          { label: "Two Columns Bottom" },
        ],
      },
      { type: "separator" },
      { label: "Explorer" },
      { label: "Search" },
      { label: "Source Control" },
      {
        label: "Run",
        click: () => {
          mainWindow.webContents.send("run-current-file");
        },
        accelator: "F5",
      },
      { label: "Extensions" },
      { type: "separator" },
      { label: "Problems" },
      { label: "Output" },
      { label: "Debug Console" },
      { label: "Terminal" },
      { type: "separator" },
      { label: "Word Wrap" },
    ],
  },
  {
    label: "Go",
    submenu: [
      { label: "Back" },
      { label: "Forward", enabled: false },
      { label: "Last Edit Location" },
      {
        label: "Switch Editor",
        submenu: [
          { label: "Next Editor" },
          { label: "Previous Editor" },
          { type: "separator" },
          { label: "Next Used Editor" },
          { label: "Previous Used Editor" },
          { type: "separator" },
          { label: "Next Editor in Group" },
          { label: "Previous Editor in Group" },
        ],
      },
      {
        label: "Switch Group",
        submenu: [
          { label: "Group 1" },
          { label: "Group 2" },
          { label: "Group 3", enabled: false },
          { label: "Group 4", enabled: false },
          { type: "separator" },
          { label: "Next Group", enabled: false },
          { label: "Previous Group", enabled: false },
        ],
      },
      { type: "separator" },
      { label: "Go to File" },
      { label: "Go to Symbol in Workspace" },
      { type: "separator" },
      { label: "Go to Symbol in Editor" },
      { label: "Go to Definition" },
      { label: "Go to Declaration" },
      { label: "Go to Type Definition" },
      { label: "Go to Implementations" },
      { label: "Go to References" },
      { type: "separator" },
      { label: "Go to Line/Column" },
      { label: "Go to Bracket" },
      { type: "separator" },
      { label: "Next Problem" },
      { label: "Previous Problem" },
      { type: "separator" },
      { label: "Next Change" },
      { label: "Previous Change" },
    ],
  },
  {
    label: "Run",
    submenu: [
      {
        label: "Run",
        click: () => {
          mainWindow.webContents.send("run-code-manual");
        },
        accelator: "F5",
      },
      { label: "Start Debugging" },
      { label: "Run Without Debugging" },
      { label: "Stop Debugging", enabled: false },
      { label: "Restart Debugging", enabled: false },
      { type: "separator" },
      { label: "Open Configuration", enabled: false },
      { label: "Add Configuration", enabled: true },
      { type: "separator" },
      { label: "Step Over", enabled: false },
      { label: "Step Into", enabled: false },
      { label: "Step Out", enabled: false },
      { label: "Continue", enabled: false },
      { type: "separator" },
      { label: "Toggle Breakpoint" },
      { label: "New Breakpoint" },
      {
        role: "zoom",
        submenu: [
          { role: "resetZoom" },
          { role: "zoomIn" },
          { role: "zoomOut" },
        ],
      },
    ],
  },
] as unknown as MenuItem[];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

const get_files = (dir: string) => {
  const files = fs.readdirSync(dir, { withFileTypes: true });

  const buildStructure = (currentPath: string): any => {
    const currentFiles = fs.readdirSync(currentPath, { withFileTypes: true });

    return currentFiles.map((file, index) => {
      const fullPath = path.join(currentPath, file.name);
      if (file.isDirectory()) {
        return {
          id: `${index + 1}`,
          name: file.name,
          isFolder: true,
          path: file.path,
          items: buildStructure(fullPath),
        };
      } else {
        return {
          id: `${index + 1}`,
          name: file.name,
          path: file.path,
          isFolder: false,
          items: [],
        };
      }
    });
  };

  return buildStructure(dir);
};

ipcMain.handle("get-folder", async (event, data) => {
  // @ts-ignore
  return store.get(SELECTED_FOLDER_STORE_NAME);
});

ipcMain.on("clear-folder", () => {
  // @ts-ignore
  store.delete(SELECTED_FOLDER_STORE_NAME);
});

ipcMain.on("create-folder", async (event, data) => {
  fs.mkdirSync(data.path);
});

ipcMain.on("set-folder", (event, folder: string) => {
  let structure = undefined;

  try {
    // Get the folder structure
    const items = get_files(folder);

    // Build the overall folder structure
    structure = {
      id: 1,
      name: folder,
      root: folder,
      isFolder: true,
      items,
    };

    // @ts-ignore
    store.set(SELECTED_FOLDER_STORE_NAME, structure);

    // Notify the renderer process that the folder has been opened
    mainWindow.webContents.send("new-folder-opened", structure); // Optionally send the structure as well
  } catch (error) {
    console.error(`Error while reading the folder: ${error.message}`);
    mainWindow.webContents.send("error-opening-folder", error.message); // Send an error message to renderer
  }
});

ipcMain.handle("open-set-folder", async (event, data) => {
  const folder = await dialog.showOpenDialog(mainWindow, {
    properties: ["openDirectory"],
  });
  let structure = undefined;
  if (!folder.canceled) {
    console.log("folder", folder.filePaths[0]);
    const items = get_files(folder.filePaths[0]);
    structure = {
      // name: path.dirname(folder.filePaths[0]),
      id: 0,
      name: folder.filePaths[0],
      root: folder.filePaths[0],
      isFolder: true,
      items,
    };
    // @ts-ignore
    store.set(SELECTED_FOLDER_STORE_NAME, structure);
    // ipcMain.emit('new-folder-opened')
    mainWindow.webContents.send("new-folder-opened");
  }
});

ipcMain.on("refresh-window", (event, folder) => {
  let structure = undefined;

  const items = get_files(folder);
  structure = {
    id: 0,
    name: folder,
    root: folder,
    isFolder: true,
    items,
  };

  // @ts-ignore
  store.set(SELECTED_FOLDER_STORE_NAME, structure);
  mainWindow.webContents.send("new-folder-opened");
});

ipcMain.on("create-folder", async (event, data) => {
  //   path: data.path,
  // fileName: string
  //   rootPath:  data.rootPath

  const new_folder = fs.mkdirSync(data.path);

  const items = get_files(data.rootPath);
  const structure = {
    // name: path.dirname(data.rootPath),
    id: 1,
    name: data.rootPath,
    root: data.rootPath,
    isFolder: true,
    items,
  };

  // @ts-ignore
  store.set(SELECTED_FOLDER_STORE_NAME, structure);

  const newFolder = {
    name: data.fileName,
    parentPath: data.path,
    path: data.path,
    is_dir: true,
  };
});

ipcMain.on("create-file", async (event, data) => {
  //   path: data.path,
  // fileName: string
  //   rootPath:  data.rootPath

  const new_file = fs.writeFileSync(data.path, "");

  const items = get_files(data.rootPath);
  const structure = {
    // name: path.dirname(data.rootPath),
    id: 1,
    name: data.rootPath,
    root: data.rootPath,
    isFolder: true,
    items,
  };

  // @ts-ignore
  store.set(SELECTED_FOLDER_STORE_NAME, structure);

  // mainWindow.webContents.send("new-folder-opened");
});

ipcMain.on("set-settings", (event, data) => {
  // @ts-ignore
  store.set(SETTINGS_STORE_NAME, data);
});

ipcMain.handle("get-settings", async (event) => {
  // @ts-ignore
  return store.get(SETTINGS_STORE_NAME);
});

ipcMain.handle("get-file-content", async (event, path) => {
  try {
    console.log(path);
    const file_content = fs.readFileSync(path, "utf8");
    return file_content;
  } catch (err) {
    return err;
  }
});

function detectAndConvertToHtml(output: string): string | null {
  // Regex to detect typical pandas DataFrame structure
  // Example of pandas DataFrame output (simplified regex)
  const dfPattern = /^(?:\s*\d+\s+)+[\w._]+\s+([\d\.\-]+(\s+[\d\.\-]+)*)+$/;

  // Split the output by lines
  const lines = output.trim().split("\n");

  // Initialize array to hold rows of data
  const data: string[][] = [];

  // Loop through lines and check for DataFrame-like structure (matching pandas style)
  for (let line of lines) {
    if (dfPattern.test(line)) {
      // Split the line into columns and add to data
      const row = line.trim().split(/\s+/);
      data.push(row);
    }
  }

  // If data is detected, convert to HTML table
  if (data.length > 0) {
    // The first row is the header
    const header = data[0];
    const body = data.slice(1);

    // Generate HTML table
    let htmlTable = '<table border="1">';
    htmlTable += "<thead><tr>";
    for (let col of header) {
      htmlTable += `<th>${col}</th>`;
    }
    htmlTable += "</tr></thead><tbody>";

    for (let row of body) {
      htmlTable += "<tr>";
      for (let cell of row) {
        htmlTable += `<td>${cell}</td>`;
      }
      htmlTable += "</tr>";
    }

    htmlTable += "</tbody></table>";
    return htmlTable;
  }

  return null;
}

let previousOutput = ""; // Store previous output

ipcMain.handle("run-code", async (event, data) => {
  try {
    if (!data.path.endsWith(".py")) {
      if (data.path.endsWith(".js")) {
        const nodeProcess = spawn(`node`, [data.path]);

        nodeProcess.stdout.on("data", (data) => {
          // Append to the previous output
          previousOutput += data.toString();
          mainWindow.webContents.send("received-output", previousOutput);
        });

        nodeProcess.stderr.on("data", (data) => {
          // Append to the previous output
          previousOutput += `Error: ${data.toString()}`;
          mainWindow.webContents.send("received-output", previousOutput);
        });

        nodeProcess.on("close", (code) => {
          if (code !== 0) {
            previousOutput += `Process exited with code ${code}`;
            mainWindow.webContents.send("received-output", previousOutput);
          }
        });
      }
      return;
    }

    // @ts-ignore
    const vars = store.get(DATASTUDIO_VARIABLES_STORE_NAME);

    const content = fs.readFileSync(data.path, "utf8");

    const words = content.split(/\s+/);

    vars.map((data: any) => {
      for (let word of words) {
        data.name === word
          ? event.sender.send("show-tools", data.toString())
          : console.log(data.name, words);
      }
    });
  } catch (err) {}

  try {
    const pythonProcess = spawn(`${data.script}`, [data.path]);

    pythonProcess.stdout.on("data", (data) => {
      // Append to the previous output
      previousOutput += data.toString();
      mainWindow.webContents.send("received-output", data.toString());

      const htmlTable = detectAndConvertToHtml(data.toString());

      if (htmlTable) {
        console.log("Detected and converted table to HTML:");
        console.log(htmlTable);
        mainWindow.webContents.send(
          "received-output",
          data.toString() + htmlTable
        );
      } else {
        console.log("No table detected in the output.");
      }
    });

    pythonProcess.stderr.on("data", (data) => {
      // Append to the previous output
      previousOutput += `Error: ${data.toString()}`;
      mainWindow.webContents.send("received-output", data.toString());
    });

    pythonProcess.on("close", (code) => {
      if (code !== 0) {
        previousOutput += `Process exited with code ${code}`;
        mainWindow.webContents.send("received-output", data.toString());
      }
    });
  } catch (err) {}
});

ipcMain.handle("get-variables", async (event, filePath: string) => {
  try {
    if (!filePath.endsWith(".py")) {
      return { error: "Only Python files are allowed." };
    }

    const fileContent = fs.readFileSync(filePath, "utf8");

    const variableRegex = /^([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(.+)$/gm;

    const variables: Variable[] = [];
    let match;

    while ((match = variableRegex.exec(fileContent)) !== null) {
      const name = match[1];
      const rawValue = match[2].trim();

      let value: any = rawValue;
      let type = "string";

      try {
        if (!isNaN(Number(rawValue))) {
          value = Number(rawValue);
          type = "number";
        } else if (rawValue === "True" || rawValue === "False") {
          value = rawValue === "True";
          type = "boolean";
        } else if (rawValue === "None") {
          value = null;
          type = "null";
        } else if (rawValue.startsWith("[") && rawValue.endsWith("]")) {
          value = JSON.parse(rawValue.replace(/'/g, '"'));
          type = "list";
        } else if (rawValue.startsWith("{") && rawValue.endsWith("}")) {
          value = JSON.parse(rawValue.replace(/'/g, '"'));
          type = "dict";
        } else if (rawValue.startsWith("(") && rawValue.endsWith(")")) {
          value = JSON.parse(
            rawValue.replace(/'/g, '"').replace(/^\(|\)$/g, "[") + "]"
          );
          type = "tuple";
        } else if (rawValue.startsWith("set(") && rawValue.endsWith(")")) {
          const setContent = rawValue.slice(4, -1).replace(/^\{|\}$/g, "");
          value = new Set(JSON.parse(`[${setContent.replace(/'/g, '"')}]`));
          type = "set";
        } else {
          value = rawValue.replace(/^["']|["']$/g, "");
        }
      } catch (parseError) {}

      variables.push({ name, type, value });
    }

    return { vars: variables };
  } catch (err) {
    return { error: "Failed to process the file." };
  }
});

ipcMain.handle("get-data-studio-variables", (event) => {
  // @ts-ignore
  return store.get(DATASTUDIO_VARIABLES_STORE_NAME);
});

ipcMain.on("set-data-studio-variables", (event, data) => {
  // @ts-ignore
  return store.set(DATASTUDIO_VARIABLES_STORE_NAME, data);
});

ipcMain.on("coming-soon-dialog", async (event, data) => {
  await dialog.showMessageBox(mainWindow, {
    title: "Coming Soon",
    type: "info",
    buttons: ["OK", "Cancel"],
    message: "This feature is coming soon!",
  });
});

function deleteDirectoryRecursive(dirPath: string) {
  fs.rmdirSync(dirPath);
}

ipcMain.handle("send-message", async (_, message) => {
  try {
    const response = await axois.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
      {
        contents: [{ parts: [{ text: message }] }],
      },
      {
        headers: { "Content-Type": "application/json" },
        params: { key: GEMINI_API_KEY },
      }
    );

    return response.data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error: Unable to fetch response.";
  }
});

ipcMain.on("new-folder-input", (event, data) => {
  event.sender.send("command-create-folder", data);
});
ipcMain.on("new-file-input", (event, data) => {
  event.sender.send("command-create-file", data);
});

ipcMain.on("folder-contextmenu", async (event, data) => {
  const template: any = [
    {
      label: "New File...",
      click: () => {
        event.sender.send("command-create-file", data);
      },
      visible: data.type == "folder",
    },
    {
      label: "New Folder...",
      click: () => {
        event.sender.send("command-create-folder", data);
      },
      visible: data.type == "folder",
    },
    { type: "separator" },
    {
      label: "Cut",
      role: "cut",
      click: () => {
        // Implement Cut functionality here
      },
      enabled: true, // Ensure that enabled is set if needed
    },
    {
      label: "Copy",
      role: "copy",

      enabled: true,
    },
    {
      label: "Paste",
      role: "paste",
    },
    {
      label: "Copy Relative Path",
    },
    { type: "separator" },
    {
      label: "Rename",
      role: "editMenu",
      click: () => {
        // Implement Rename functionality here
      },
    },
    {
      label: "Delete",
      click: async () => {
        console.log(data);
        if (data.type === "file") {
          fs.rmSync(data.path);
        } else {
          deleteDirectoryRecursive(data.path);
        }
      },
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  menu.popup({ window: BrowserWindow.fromWebContents(event.sender) });
});

ipcMain.on("datavarinfotitle-contextmenu", async (event, data) => {
  const template: any = [
    {
      label: "Copy Name",
      click: () => {},
    },
    { type: "separator" },
    {
      label: "Copy Name",
      click: () => {},
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  menu.popup({ window: BrowserWindow.fromWebContents(event.sender) });
});

ipcMain.on("save-file", async (event, data) => {
  const file_content = fs.writeFileSync(data.path, data.content);
  console.log("file writen");
});

ipcMain.on("minimize", () => {
  mainWindow.minimize();
});

ipcMain.on("maximize", () => {
  if (mainWindow.isMaximized()) {
    mainWindow.minimize();
  } else {
    mainWindow.maximize();
  }
});

ipcMain.on("close", () => {
  mainWindow.close();
});

ipcMain.on("send-tools-data", (event, data) => {
  mainWindow.webContents.send("update-tools-data", data); // Forward to renderer
});

ipcMain.handle("read-excel-file", async (event, filePath, skipRows) => {
  try {
    const jsonData: any[] = [];
    return jsonData; // Send data to renderer
  } catch (error) {
    console.error("Error reading Excel file:", error);
    return []; // In case of an error, return an empty array
  }
});

const createWindow = (): void => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    titleBarStyle: "hidden",
    titleBarOverlay: true,
    backgroundColor: "#21252bff",
    title: "Anantam",
    icon: path.join(__dirname, "assets/icon.ico"),
    darkTheme: true,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      // nodeIntegration: true,
    },
    // zoomToPageWidth: true,
  });

  mainWindow.maximize();

  // @ts-ignore
  store.get(SELECTED_FOLDER_STORE_NAME);

  try {
    // @ts-ignore
    cwd = store.get(SELECTED_FOLDER_STORE_NAME).root;
  } catch {
    cwd = "/";
  }

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  try {
    const shell = os.platform() === "win32" ? "powershell.exe" : "bash";

    ptyProcess = pty.spawn(shell, [], {
      name: "xterm-color",
      cols: 80,
      rows: 30,
      cwd: cwd || process.env.HOME,
      env: process.env,
    });

    ptyProcess.onData(function (data) {
      mainWindow.webContents.send("terminal.incomingData", data);
    });

    ipcMain.on("terminal.keystroke", (event, key) => {
      ptyProcess.write(key);
    });

    ipcMain.on("terminal.resize", (event, data) => {
      ptyProcess.resize(data.cols, data.rows);
    });

    ipcMain.on("terminal.write", (event, line) => {
      ptyProcess.write(line);
    });
  } catch (err) {
    mainWindow.webContents.send("terminal.incomingData", err);
    alert(err);
  }

  ipcMain.handle("open-folder", async (event, data) => {
    const folder = await dialog.showOpenDialog(mainWindow, {
      properties: ["openDirectory"],
    });
    let structure = undefined;
    if (!folder.canceled) {
      const items = get_files(folder.filePaths[0]);
      structure = {
        id: 1,
        name: folder.filePaths[0],
        root: folder.filePaths[0],
        isFolder: true,
        items,
      };
      // @ts-ignore
      store.set(SELECTED_FOLDER_STORE_NAME, structure);
    }

    return structure;
  });

  // Register the ipcMain handler for 'dialog:openFolder'
  ipcMain.handle("open-folder-new-project", async (event, data) => {
    const folder = await dialog.showOpenDialog(mainWindow, {
      properties: ["openDirectory"],
    });

    return folder.filePaths[0]; // Return the selected folder pathr;
  });

  mainWindow.once("ready-to-show", () => {
    // Open the DevTools.
    mainWindow.webContents.openDevTools();
    mainWindow.show(); // Show the main window
    attachTitlebarToWindow(mainWindow);
  });
};

const createToolsWindow = () => {
  if (!toolsWindow) {
    toolsWindow = new BrowserWindow({
      height: 800,
      width: 1200,
      show: false,
      webPreferences: {
        preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
        // nodeIntegration: true,
      },
    });

    toolsWindow.loadURL(TOOLS_WINDOW_WEBPACK_ENTRY);

    toolsWindow.setMenuBarVisibility(false);

    toolsWindow.on("closed", () => {
      toolsWindow = null;
      mainWindow.webContents.send("tools-window-closed");
    });
  }
};

ipcMain.handle("show-tools", () => {
  createToolsWindow();

  if (toolsWindow && toolsWindow.isMinimized()) {
    toolsWindow.restore();
  }

  toolsWindow?.show();
});

ipcMain.handle("hide-tools", () => {
  if (toolsWindow) {
    toolsWindow.hide();
  }
});

const createDataStudioWindow = () => {
  if (!dataStudio) {
    dataStudio = new BrowserWindow({
      height: 800,
      width: 1200,
      show: false,
      frame: false,

      webPreferences: {
        preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
        // nodeIntegration: true,
      },
    });

    dataStudio.loadFile("./src/dataStudio.html");

    dataStudio.setMenuBarVisibility(false);

    dataStudio.on("closed", () => {
      dataStudio = null;
      mainWindow.webContents.send("datastudio-window-closed");
    });
  }
};

ipcMain.handle("show-datastudio", () => {
  createDataStudioWindow();

  if (dataStudio && dataStudio.isMinimized()) {
    dataStudio.restore();
  }

  dataStudio?.show();
});

ipcMain.handle("hide-datastudio", () => {
  if (dataStudio) {
    dataStudio.hide();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow(); // Create the main window
  createToolsWindow();

  // Check for updates on startup
  autoUpdater.checkForUpdates();

  autoUpdater.on("update-available", () => {
    dialog.showMessageBox({
      type: "info",
      title: "Update Available",
      message:
        "A new version of the Anantam is available. The update will be downloaded and installed automatically.",
    });
  });

  autoUpdater.on("update-downloaded", () => {
    dialog
      .showMessageBox({
        type: "info",
        title: "Update Ready",
        message:
          "The update has been downloaded. Anantam will restart to apply the update.",
      })
      .then(() => {
        autoUpdater.quitAndInstall();
      });
  });

  autoUpdater.on("error", (error) => {
    console.error("Update error:", error);
  });
});
// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
