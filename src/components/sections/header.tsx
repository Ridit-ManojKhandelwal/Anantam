import { CloseOutlined, MinusOutlined } from "@ant-design/icons/lib";
import { useState } from "react";
import { useAppSelector } from "../../shared/hooks";

export const HeaderSection = () => {
  const [activeMenu, setActiveMenu] = useState(null);
  const { active_file } = useAppSelector((state) => ({
    active_file: state.main.active_file,
  }));

  const toggleMenu = (menu: string) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  const handleRun = async () => {
    const settings = await window.electron.get_settings();
    if (!active_file.path) {
      alert("No file found.");
      return;
    }
    window.electron.run_code({
      path: active_file.path,
      script: "python3",
    });
  };

  return (
    <nav className="header-wrapper">
      <div className="header">
        <p id="title">Anantam</p>
        <div className="menu">
          <ul
            style={{
              display: "flex",
            }}
          >
            <div
              className="menu-item"
              onMouseEnter={() => toggleMenu("file")}
              onMouseLeave={() => toggleMenu(null)}
            >
              <li>File</li>
              {activeMenu === "file" && (
                <div className="menu-sub-item">
                  <ul>
                    <li>New File</li>
                    <li>New Folder</li>
                    <hr />
                    <li>Open File</li>
                    <li
                      onClick={() => {
                        window.electron.open_set_folder();
                      }}
                    >
                      Open Folder
                    </li>
                  </ul>
                </div>
              )}
            </div>
            <div
              className="menu-item"
              onMouseEnter={() => toggleMenu("edit")}
              onMouseLeave={() => toggleMenu(null)}
            >
              <li>Edit</li>
              {activeMenu === "edit" && (
                <div className="menu-sub-item">
                  <ul>
                    <li>Undo</li>
                    <li>Redo</li>
                    <hr />
                    <li>Find</li>
                    <li>Copy</li>
                  </ul>
                </div>
              )}
            </div>
            <div
              className="menu-item"
              onMouseEnter={() => toggleMenu("run")}
              onMouseLeave={() => toggleMenu(null)}
            >
              <li>Run</li>
              {activeMenu === "run" && (
                <div className="menu-sub-item">
                  <ul>
                    <li onClick={handleRun}>Run</li>
                  </ul>
                </div>
              )}
            </div>
            <div
              className="menu-item"
              onMouseEnter={() => toggleMenu("importData")}
              onMouseLeave={() => toggleMenu(null)}
            >
              <li>Import</li>
              {activeMenu === "importData" && (
                <div className="menu-sub-item">
                  <ul>
                    <p>Import</p>
                    <li>Data Studio</li>
                    <hr />
                    <p>Export</p>
                    <li>Data Studio</li>
                  </ul>
                </div>
              )}
            </div>
            <div
              className="menu-item"
              onMouseEnter={() => toggleMenu("terminal")}
              onMouseLeave={() => toggleMenu(null)}
            >
              <li>Terminal</li>
              {activeMenu === "terminal" && (
                <div className="menu-sub-item">
                  <ul>
                    <li>New Terminal</li>
                    <hr />
                    <li>Data Studio</li>
                  </ul>
                </div>
              )}
            </div>
          </ul>
        </div>
      </div>

      <div className="drag-area"></div>

      <div className="nav-buttons">
        <button id="minimize" onClick={() => window.electron.minimize_window()}>
          <MinusOutlined
            style={{
              fontSize: "12px",
            }}
          />
        </button>
        <button id="maximize" onClick={() => window.electron.maximize_window()}>
          =
        </button>
        <button id="close" onClick={() => window.electron.close_window()}>
          <CloseOutlined
            style={{
              fontSize: "12px",
            }}
          />
        </button>
      </div>
    </nav>
  );
};
