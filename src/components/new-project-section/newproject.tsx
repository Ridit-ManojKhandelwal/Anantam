import React, { useState, useEffect } from "react";
import { ReactComponent as AngleLeftIcon } from "../../assets/svg/d-chevron.svg";
import { ReactComponent as AngleRightIcon } from "../../assets/svg/r-chevron.svg";
import { Button, Input, Checkbox, Dropdown, Menu, message } from "antd/es";
import { FolderOpenOutlined } from "@ant-design/icons/lib";
import PerfectScrollBar from "react-perfect-scrollbar";
import "highlight.js/styles/github.css";
import hljs from "highlight.js";

const treeData = [
  {
    title: "Projects",
    key: "projects",
    children: [
      {
        title: "New Project",
        key: "projects-new",
        children: [
          {
            title: "Python Project", // Properly nested child
            key: "projects-new-python",
          },
          {
            title: "Infx Project", // Properly nested child
            key: "projects-new-infx",
          },
        ],
      },
      { title: "Open Project", key: "projects-open" },
    ],
  },
];

interface NewProjectModalProps {
  setModalVisibilty: () => void;
}

export default function NewProjectModal({
  setModalVisibilty,
}: NewProjectModalProps) {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const [activeOption, setActiveOption] = useState<string | null>(null);
  const [interpreterOption, setInterpreterOption] = useState<string>("python");
  const [interpreterVersion, setInterpreterVersion] = useState<number>(0);
  const [isMainPyChecked, setIsMainPyChecked] = useState<boolean>(false); // Track main.py checkbox
  const [code, setCode] = useState("print('hello world')"); // Default code for main.py
  const [edit, setEdit] = useState<boolean>(false);
  const [folderPath, setFolderPath] = useState<string>("");

  const openFolderDialog = () => {
    window.electron
      .openNewProjectFolder() // Calls the openFolder method in preload.js
      .then((path: string) => {
        if (path) {
          setFolderPath(path); // Set the selected folder path to the input
        }
      })
      .catch((error: any) => {
        console.error("Error selecting folder: ", error);
      });
  };

  const envItems = [
    {
      label: "Python Interpreter",
      key: "python-interpreter",
      onClick: () => {
        setInterpreterOption("python");
      },
    },
    {
      label: "Anantam Interpreter",
      key: "anantam-interpreter",
      onClick: () => {
        setInterpreterOption("anantam");
      },
    },
  ];

  const anantamVersionItems = [
    {
      label: "Version 1",
      key: "Version 1",
      onClick: () => {
        setInterpreterVersion(1);
      },
    },
  ];

  const createProject = async () => {
    if (!folderPath) {
      message.error("Please select a folder");
      return;
    }
    try {
      if (interpreterOption === "anantam") {
        window.electron.create_folder({ path: folderPath + "\\.env" });
        window.electron.create_project_anantam_config_file({
          path: folderPath + "\\anantam.config.json",
          interpreter_path: folderPath + "\\.env\\anantam.exe",
        });
      }

      if (isMainPyChecked) {
        window.electron.create_project_anantam_file({
          path: folderPath + "\\main.py",
          content: code,
        });
      }

      window.electron.set_folder(folderPath);
    } catch (err) {
      message.error(err);
    } finally {
      message.info("created project");
      setModalVisibilty();
    }
  };

  useEffect(() => {
    hljs.highlightAll();
  }, []);

  const NewProjectPython = () => {
    return (
      <div className="new-project-python">
        <div className="option">
          <p>Location: </p>
          <Input
            placeholder="folder-path"
            value={folderPath}
            prefix={<FolderOpenOutlined onClick={openFolderDialog} />}
          />
        </div>
        <div className="option">
          <p>New Environment using: </p>
          <Dropdown overlay={<Menu items={envItems} />} trigger={["click"]}>
            <Button>Select Interpreter</Button>
          </Dropdown>
          <div className="sub-option">
            {(interpreterOption === "anantam" && (
              <div>
                <p>Anantam Version: </p>
                <Dropdown
                  overlay={<Menu items={anantamVersionItems} />}
                  trigger={["click"]}
                >
                  <Button>Select Version</Button>
                </Dropdown>
              </div>
            )) ||
              (interpreterOption === "python" && (
                <div>
                  <p>Python Version: </p>
                  <Dropdown
                    overlay={<Menu items={envItems} />}
                    trigger={["click"]}
                  >
                    <Button>Select Version</Button>
                  </Dropdown>
                </div>
              ))}
          </div>
        </div>
        <div className="option">
          <Checkbox
            checked={isMainPyChecked}
            onChange={(e) => setIsMainPyChecked(e.target.checked)}
          >
            <p>Create a main.py welcome script:</p>
          </Checkbox>
        </div>
        <Button
          style={{
            position: "absolute",
            right: 0,
            bottom: 0,
            padding: "15px",
          }}
          onClick={createProject}
        >
          Create Project
        </Button>
      </div>
    );
  };

  const toggleExpand = (key: string) => {
    setExpandedKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const renderTree = (nodes: any[]) =>
    nodes.map((node) => (
      <div key={node.key} className="tree-item">
        <div
          className={`tree-node ${expandedKeys.includes(node.key) ? "expanded" : ""} 
              ${activeOption === node.key ? "active-option" : ""}`}
          onClick={() => {
            setSelectedKey(node.key);
            setActiveOption(node.key);
            node.children ? toggleExpand(node.key) : null;
          }}
        >
          {node.children && (
            <span
              className={`expand-icon ${expandedKeys.includes(node.key) ? "open" : ""}`}
            >
              {expandedKeys.includes(node.key) ? (
                <AngleLeftIcon />
              ) : (
                <AngleRightIcon />
              )}
            </span>
          )}
          {node.title}
        </div>
        {node.children && expandedKeys.includes(node.key) && (
          <div className="tree-children">{renderTree(node.children)}</div>
        )}
      </div>
    ));

  const renderContent = () => {
    switch (selectedKey) {
      case "projects-new-python":
        return <NewProjectPython />;
      case "projects-new-infx":
        return "content";
      default:
        return <NewProjectPython />;
    }
  };

  return (
    <div className="modal-container">
      <PerfectScrollBar
        style={{
          display: "grid",
          width: "100%",
        }}
      >
        <div className="settings-container">
          <div className="settings-sidebar">{renderTree(treeData)}</div>
          <div className="settings-content">{renderContent()}</div>
        </div>
      </PerfectScrollBar>
    </div>
  );
}
