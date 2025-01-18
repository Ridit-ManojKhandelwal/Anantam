import { Terminal as XTerminal } from "@xterm/xterm";
import { useEffect, useRef } from "react";
const ipc = Electron.ipcRenderer;

import "@xterm/xterm/css/xterm.css";

export const Terminal = () => {
  const terminalRef = useRef();
  const isRendered = useRef(false);

  useEffect(() => {
    if (isRendered.current) return;
    isRendered.current = true;

    const term = new XTerminal({
      rows: 20,
    });

    term.open(terminalRef.current);

    ipc.on("terminal.incomingData", (event, data) => {
      term.write(data);
    });

    term.onData((e) => {
      ipc.send("terminal.keystroke", e);
    });
  }, []);

  return <div ref={terminalRef} id="terminal" />;
};
