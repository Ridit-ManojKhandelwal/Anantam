import { Terminal as XTerminal } from "@xterm/xterm";
import { FitAddon } from "xterm-addon-fit";
import { useEffect, useRef, useState } from "react";
import socket from "../../shared/socket";
import "@xterm/xterm/css/xterm.css";
import PerfectScrollbar from "react-perfect-scrollbar";

export const Terminal = () => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const isRendered = useRef(false);
  const [folderName, setFolderName] = useState<string>("");

  const getFolderName = async () => {
    try {
      const folder_name = await window.electron.get_folder();
      setFolderName(folder_name.name);
    } catch (error) {
      console.error("Error fetching folder name:", error);
    }
  };

  useEffect(() => {
    // Fetch the folder name before initializing the terminal
    getFolderName();
  }, []); // Runs only once when component mounts

  useEffect(() => {
    const initializeTerminal = async () => {
      if (!terminalRef.current || !folderName) return; // Ensure terminal and folderName are available

      const term = new XTerminal({
        cursorBlink: true,
        theme: {
          background: "#1e1e1e",
          foreground: "#fff",
          cursor: "#f8f8f0",
        },
        fontFamily:
          'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
      });

      // Initialize the FitAddon
      const fitAddon: any = new FitAddon();
      term.loadAddon(fitAddon); // Attach the FitAddon to the terminal

      term.open(terminalRef.current);
      fitAddon.fit(); // Fit the terminal to the container size

      // Emit initial terminal size to the backend
      socket.emit("terminal:resize", {
        cols: term.cols,
        rows: term.rows,
      });

      // Handle terminal resize
      const handleResize = () => {
        fitAddon.fit(); // Adjust the terminal size based on the container
        socket.emit("terminal:resize", {
          cols: term.cols,
          rows: term.rows,
        });
      };

      window.addEventListener("resize", handleResize);

      term.onData((data) => {
        socket.emit("terminal:write", data);
      });

      socket.on("terminal:data", (data) => {
        term.write(data);
      });

      return () => {
        window.removeEventListener("resize", handleResize);
        term.dispose();
      };
    };

    if (!isRendered.current && folderName) {
      isRendered.current = true;
      initializeTerminal();
    }
  }, [folderName]); // Run this effect when folderName changes

  return (
    <PerfectScrollbar className="scroller">
      <div
        id="terminal"
        ref={terminalRef}
        style={{ height: "100%", width: "100%" }}
      />
    </PerfectScrollbar>
  );
};
