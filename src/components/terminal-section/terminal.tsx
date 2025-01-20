import { useEffect, useRef, useState } from "react";
import { Terminal as XTerminal } from "xterm";
import "@xterm/xterm/css/xterm.css";
import { FitAddon } from "xterm-addon-fit";

export const Terminal = () => {
  const terminalRef = useRef<HTMLDivElement | null>(null);
  const terminalInstance = useRef<XTerminal | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const [containerReady, setContainerReady] = useState(false);

  useEffect(() => {
    if (!terminalRef.current || terminalInstance.current) return;

    // Initialize terminal
    const term = new XTerminal({
      cols: 80,
      rows: 24,
      cursorBlink: true,
      theme: {
        background: "#121212",
      },
    });

    const fitAddon = new FitAddon();
    fitAddonRef.current = fitAddon;
    term.loadAddon(fitAddon);

    term.open(terminalRef.current);

    // Wait for DOM to fully render before fitting
    const checkContainerSize = () => {
      if (
        terminalRef.current &&
        terminalRef.current.offsetWidth > 0 &&
        terminalRef.current.offsetHeight > 0
      ) {
        fitAddon.fit();
        setContainerReady(true); // Set the state when the container is ready
      }
    };

    // Trigger size check after initial render
    setTimeout(checkContainerSize, 0);

    term.write(">>");
    terminalInstance.current = term;

    // Handle terminal resizing dynamically
    const resizeObserver = new ResizeObserver(() => {
      if (fitAddonRef.current) {
        fitAddonRef.current.fit();
      }
    });
    resizeObserver.observe(terminalRef.current);

    // Handle Electron IPC communication
    const handleIncomingData = (_event: any, data: string) => {
      term.write(data);
    };

    window.electron.ipcRenderer.send("terminal.resize", {
      rows: term.rows,
      cols: term.cols,
    });

    window.electron.ipcRenderer.on("terminal.incomingData", handleIncomingData);

    term.onData((data) => {
      window.electron.ipcRenderer.send("terminal.keystroke", data);
    });

    // Cleanup
    return () => {
      term.dispose();
      resizeObserver.disconnect();
      window.electron.ipcRenderer.removeListener(
        "terminal.incomingData",
        handleIncomingData
      );
      terminalInstance.current = null;
      fitAddonRef.current = null;
    };
  }, []);

  // Render terminal container only when it's ready
  return <div ref={terminalRef} style={{ width: "100%", height: "100%" }} />;
};
