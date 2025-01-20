import React, { useCallback, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../shared/hooks";
import {
  BarsOutlined,
  BugOutlined,
  CopyOutlined,
  FileOutlined,
  FolderAddOutlined,
  ImportOutlined,
  SaveOutlined,
  SearchOutlined,
  CaretRightOutlined,
  SettingOutlined,
} from "@ant-design/icons/lib";
import {
  Button,
  Dropdown,
  Menu,
  Input,
  message,
  AutoComplete,
  Modal,
  Tooltip,
} from "antd";
import PerfectScrollbar from "react-perfect-scrollbar"; // Ensure you have the correct import
import {
  set_settings_tab,
  update_active_file,
  update_active_files,
  update_data_studio_active,
} from "../../shared/rdx-slice";
import { TActiveFile } from "../../shared/types";
import FileIcon from "../../shared/file-icon"; // Make sure FileIcon supports custom size if needed
import { store } from "../../shared/store";
import { MainContext, path_join } from "../../shared/functions";
import NewProjectModal from "../new-project-section/newproject";
import update_active_tab from "./bottom";
import { dialog, ipcRenderer } from "electron";

const HeaderSection = React.memo((props: any) => {
  const folder_structure = useAppSelector(
    (state) => state.main.folder_structure
  );
  const active_file = useAppSelector((state) => state.main.active_file);
  const data_studio_active = useAppSelector(
    (state) => state.main.data_studio_active.active
  );
  const settings = useAppSelector((state) => state.main.settings_tab_active);

  const dispatch = useAppDispatch();
  const useMainContextIn = React.useContext(MainContext);
  const [newProjectModalVisibilty, setNewProjectModalVisibilty] =
    useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Check if folder_structure and folder_structure.tree are defined
  const files = folder_structure?.tree?.filter((file) => !file.is_dir) || [];

  const configFile =
    files.map((file) => (file.name === "anantam.config.infx" ? true : false)) ||
    files.length === 0
      ? false
      : true;

  const initializeProject = () => {
    try {
      // window.electron.create_folder({ path: folder_structure.root + "\\.env" });
      window.electron.create_project_anantam_config_file({
        path: folder_structure.root + "\\anantam.config.infx",
        interpreter_path: folder_structure.root + "\\.env",
      });

      window.electron.create_project_anantam_file({
        path: folder_structure.root + "\\main.py",
        content: 'print("hello world")',
      });

      message.info("Successfully initialized project.");
      window.electron.reload_window(folder_structure.root);
    } catch (err) {
      message.error("Faild to initialize project ", err);
    }
  };

  // Function to display files in the dropdown menu
  const handle_set_editor = useCallback(
    async (branch_name: string, full_path: string) => {
      const get_file_content = await window.electron.get_file_content(
        full_path
      );
      const active_file: TActiveFile = {
        icon: branch_name.split(".").at(-1) || "unknown", // Store the file type as a string
        path: full_path,
        name: branch_name,
        is_touched: false,
      };

      const selected_file = {
        name: branch_name,
        path: full_path,
        content: get_file_content,
      };

      if (
        store
          .getState()
          .main.active_files.findIndex((file) => file.path === full_path) === -1
      ) {
        store.dispatch(
          update_active_files([
            ...store.getState().main.active_files,
            active_file,
          ])
        );
      }

      dispatch(update_active_file(active_file));

      setTimeout(() => {
        useMainContextIn.handle_set_editor(selected_file);
      }, 0);
    },
    [dispatch]
  );

  // Function to generate file list for the dropdown
  const generateFileMenu = () => {
    if (Object.keys(folder_structure).length === 0 || !folder_structure.tree) {
      return null;
    }

    // Before slice file
    const _files = folder_structure.tree
      .filter((content) => !content.is_dir)
      .reduce((acc: any[], currentFile) => {
        // Check if file already exists in the accumulator by path
        const isDuplicate = acc.some((file) => file.path === currentFile.path);
        if (!isDuplicate) {
          acc.push(currentFile);
        }
        return acc;
      }, []);

    const files = _files.length > 100 ? _files.slice(0, 100) : _files;

    return useMemo(
      () => (
        <Menu>
          {files.length > 0 ? (
            files.map((file) => (
              <Menu.Item
                key={file.path}
                onClick={() =>
                  handle_set_editor(
                    file.name,
                    path_join([file.path, file.name])
                  )
                }
                style={{ display: "flex" }}
              >
                <span style={{ marginRight: "8px" }} className="icon-small">
                  <FileIcon type={file.name.split(".").at(-1)} />
                </span>
                <span>{file.name}</span>
              </Menu.Item>
            ))
          ) : (
            <Menu.Item disabled>No files available</Menu.Item>
          )}
        </Menu>
      ),
      [folder_structure.tree]
    );
  };

  // Search handler
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = () => {
    // Filter files based on the search query
    const matchedFiles = folder_structure.tree.filter((file) =>
      file.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (matchedFiles.length > 0) {
      // Open the first matching file (or allow user to select a file)
      handle_set_editor(matchedFiles[0].name, matchedFiles[0].path);
    } else {
      message.error("No files found.");
    }
  };

  const comingSoon = () => {
    window.electron.ipcRenderer.send("coming-soon-dialog", []);
  };

  return (
    <div className="header-section">
      <div className="modal">
        <PerfectScrollbar>
          <Modal
            title={<div className="modal-title-with-border">New Project</div>} // Custom title with a class
            open={newProjectModalVisibilty}
            onCancel={() => setNewProjectModalVisibilty(false)}
            width="70%"
            height="70%"
            style={{
              background: "#121212",
            }}
            wrapStyle={{
              background: "#28292D",
            }}
            bodyStyle={{
              background: "#121212",
              color: "#ffffff",
            }}
            footer={null}
          >
            <NewProjectModal
              setModalVisibilty={() => setNewProjectModalVisibilty(false)}
            />
          </Modal>
        </PerfectScrollbar>
      </div>

      <div className="header-main">
        <div className="action-bar">
          <div className="icons-bar">
            <button
              style={{
                border: "none",
                padding: 0,
                margin: 0,
                background: "transparent",
                cursor: "pointer",
              }}
              onClick={comingSoon}
            >
              <FileOutlined />
            </button>
            <button
              style={{
                border: "none",
                padding: 0,
                margin: 0,
                background: "transparent",
                cursor: "pointer",
              }}
              onClick={() => setNewProjectModalVisibilty(true)}
            >
              <Tooltip title="New Project">
                <FolderAddOutlined />
              </Tooltip>
            </button>
            <button
              style={{
                border: "none",
                padding: 0,
                margin: 0,
                background: "transparent",
                cursor: "pointer",
              }}
              onClick={() => {
                const currentFile = active_file;
                if (active_file) {
                  try {
                    // useMainContextIn.handle_save_file(active_file);
                  } catch (err) {
                    message.error(err);
                  } finally {
                    // message.info("saved successfully");
                  }
                }
              }}
            >
              <SaveOutlined />
            </button>
            <button
              style={{
                border: "none",
                padding: 0,
                margin: 0,
                background: "transparent",
                cursor: "pointer",
              }}
              onClick={comingSoon}
            >
              <BugOutlined />
            </button>
            <button
              style={{
                border: "none",
                padding: 0,
                margin: 0,
                background: "transparent",
                cursor: "pointer",
              }}
              onClick={comingSoon}
            >
              <BarsOutlined />
            </button>
            <button
              style={{
                border: "none",
                padding: 0,
                margin: 0,
                background: "transparent",
                cursor: "pointer",
              }}
              onClick={comingSoon}
            >
              <CopyOutlined />
            </button>
            {!configFile && (
              <button
                style={{
                  border: "none",
                  padding: 0,
                  margin: 0,
                  background: "transparent",
                  cursor: "pointer",
                }}
                onClick={initializeProject}
              >
                <Tooltip title="Inilize Anantam Project">
                  <ImportOutlined />
                </Tooltip>
              </button>
            )}
          </div>
        </div>

        {/* Search Bar in the middle */}
        <div className="search-bar">
          <AutoComplete style={{ width: 300 }} allowClear>
            <Input prefix={<SearchOutlined />} value={searchQuery} />
          </AutoComplete>
        </div>

        <div className="project-info">
          <Tooltip title="Run">
            <button
              style={{
                border: "none",
                background: "transparent",
              }}
              onClick={() => {
                try {
                  const file = active_file.path;
                  window.electron.run_code(file);
                } catch (err) {
                  console.error(err);
                }
              }}
            >
              <CaretRightOutlined />
            </button>
          </Tooltip>

          <Button
            onClick={() => {
              if (data_studio_active) {
                dispatch(
                  update_data_studio_active({
                    active: false,
                  })
                );
              } else {
                dispatch(
                  update_data_studio_active({
                    active: true,
                  })
                );
              }
            }}
          >
            Data Studio
          </Button>
          <Dropdown overlay={generateFileMenu()} trigger={["click"]}>
            <button
              style={{
                border: "none",
                background: "transparent",
                color: "#fff",
              }}
            >
              {folder_structure?.name?.split(/\/|\\/).at(-1)}
            </button>
          </Dropdown>
          <button
            style={{
              border: "none",
              background: "transparent",
              color: "#fff",
            }}
            onClick={() => {
              if (settings) {
                dispatch(set_settings_tab(false));
              } else {
                dispatch(set_settings_tab(true));
              }
            }}
          >
            <SettingOutlined />
          </button>
        </div>
      </div>
    </div>
  );
});

export default HeaderSection;
