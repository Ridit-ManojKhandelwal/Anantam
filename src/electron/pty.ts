import os from "os";

import * as pty from "node-pty";

import { mainWindow } from "../main";

let ptyProcess: pty.IPty;

export const Pty = ({ cwd, ipcMain }: { cwd: string; ipcMain: any }) => {
  try {
    const shell = os.platform() === "win32" ? "cmd.exe" : "bash";
    const homeDir =
      os.platform() === "win32" ? process.env.USERPROFILE : process.env.HOME;

    ptyProcess = pty.spawn(shell, [], {
      name: "xterm-color",
      cols: 80,
      rows: 30,
      cwd: cwd || homeDir,
      env: process.env,
    });

    ptyProcess.onData(function (data) {
      mainWindow.webContents.send("terminal.incomingData", data);
    });

    ipcMain.on("terminal.keystroke", (event: any, key: any) => {
      ptyProcess.write(key);
    });

    ipcMain.on("terminal.resize", (event: any, data: any) => {
      ptyProcess.resize(data.cols, data.rows);
    });

    ipcMain.on("terminal.write", (event: any, line: any) => {
      ptyProcess.write(line);
    });
  } catch (err) {
    mainWindow.webContents.send("terminal.incomingData", err);
    alert(err);
  }
};
