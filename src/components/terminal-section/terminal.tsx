import { useEffect, useRef, useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Terminal as XTerminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "@xterm/xterm/css/xterm.css";

export const Terminal = () => {
  const terminalRef = useRef<HTMLDivElement | null>(null);
  const terminalInstance = useRef<XTerminal | null>(null);
  const fitAddon = useRef<FitAddon | null>(null);

  useEffect(() => {
    if (!terminalRef.current || terminalInstance.current) return;

    const term = new XTerminal({
      cursorBlink: true,
      theme: {
        background: "#282c34ff",
      },
      fontSize: 16,
    });

    // const fit = new FitAddon();
    // fitAddon.current = fit;
    // term.loadAddon(fit);

    term.open(terminalRef.current);
    // fit.fit(); // Initial fit

    term.write(">>");
    terminalInstance.current = term;

    const handleIncomingData = (_event: any, data: string) => {
      term.write(data);
    };

    window.electron.ipcRenderer.on("terminal.incomingData", handleIncomingData);

    term.onData((data) => {
      window.electron.ipcRenderer.send("terminal.keystroke", data);
    });

    return () => {
      term.dispose();

      window.electron.ipcRenderer.removeListener(
        "terminal.incomingData",
        handleIncomingData
      );
      terminalInstance.current = null;
    };
  }, []);

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <div ref={terminalRef} className="terminal" />
    </div>
  );
};
