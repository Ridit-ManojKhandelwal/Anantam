import { useEffect, useRef, useState } from "react";
import { ReactComponent as TimesIcon } from "../../assets/svg/times.svg";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Terminal as XTerminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "@xterm/xterm/css/xterm.css";
import { PlusOutlined } from "@ant-design/icons/lib";

export const Terminal = () => {
  const terminalRef = useRef<HTMLDivElement | null>(null);
  const terminalInstance = useRef<XTerminal | null>(null);
  const fitAddon = useRef<FitAddon | null>(null);
  const [tabs, setTabs] = useState([
    {
      key: 0,
      name: "name",
    },
  ]);
  const [activeTab, setActiveTab] = useState(0);

  const addTab = () => {
    setTabs((prevTabs) => {
      const newTab = {
        key: prevTabs.length,
        name: Date.now().toString(),
      };
      return [...prevTabs, newTab];
    });

    setActiveTab(tabs.length);
    window.electron.ipcRenderer.on("terminal.create", tabs.length);
  };

  const removeTab = (key: number) => {
    setActiveTab(tabs.length - 1);
    setTabs(tabs.filter((tab) => tab.key !== key));
  };

  useEffect(() => {
    if (!terminalRef.current || terminalInstance.current) return;

    const term = new XTerminal({
      cursorBlink: true,
      theme: {
        background: "#282c34ff",
      },
    });

    const fit = new FitAddon();
    fitAddon.current = fit;
    term.loadAddon(fit);

    term.open(terminalRef.current);
    fit.fit(); // Initial fit

    term.write(">>");
    terminalInstance.current = term;

    const adjustHeight = () => {
      if (terminalRef.current) {
        const parentHeight = document.querySelector(".terminal").clientHeight; // Adjust this if you have specific parent height logic
        terminalRef.current.style.height = `${parentHeight - 100}px`; // Example: Leave 100px for other UI elements
      }
    };

    const handleResize = () => {
      adjustHeight();
      fit.fit();
      const rows = term.rows;
      const cols = term.cols;
      window.electron.ipcRenderer.send("terminal.resize", { rows, cols });
    };

    // Initial adjustment
    adjustHeight();

    window.addEventListener("resize", handleResize);

    const handleIncomingData = (_event: any, data: string) => {
      term.write(data);
    };

    window.electron.ipcRenderer.on("terminal.incomingData", handleIncomingData);

    term.onData((data) => {
      window.electron.ipcRenderer.send("terminal.keystroke", data);
    });

    return () => {
      window.removeEventListener("resize", handleResize);
      term.dispose();

      window.electron.ipcRenderer.removeListener(
        "terminal.incomingData",
        handleIncomingData
      );
      terminalInstance.current = null;
    };
  }, []);

  return (
    <div className="content-inner">
      <PerfectScrollbar className="page-tabs-cont" style={{ zIndex: 9 }}>
        {tabs.map((tab: any) => {
          return (
            <div
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={"tab" + (tab.key === activeTab ? " active" : "")}
              style={{
                borderBottom: "none",
              }}
            >
              <span>{tab.name}</span>
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  removeTab(tab.key);
                }}
                className="file-actions"
              >
                <TimesIcon className="close-icon" />
              </span>
            </div>
          );
        })}
        <div className="runTool">
          <button onClick={addTab}>
            <PlusOutlined />
          </button>
        </div>
      </PerfectScrollbar>
      <div ref={terminalRef} className="terminal" />
    </div>
  );
};
