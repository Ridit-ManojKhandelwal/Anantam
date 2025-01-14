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
  update_active_file,
  update_active_files,
} from "../../shared/rdx-slice";
import { TActiveFile } from "../../shared/types";
import FileIcon from "../../shared/file-icon"; // Make sure FileIcon supports custom size if needed
import { store } from "../../shared/store";
import { MainContext } from "../../shared/functions";
import NewProjectModal from "../new-project-section/newproject";

const HeaderSection = React.memo((props: any) => {
  const folder_structure = useAppSelector(
    (state) => state.main.folder_structure
  );

  const dispatch = useAppDispatch();
  const useMainContextIn = React.useContext(MainContext);
  const [newProjectModalVisibilty, setNewProjectModalVisibilty] =
    useState<boolean>(false);

  // Check if folder_structure and folder_structure.tree are defined
  const files = folder_structure?.tree?.filter((file) => !file.is_dir) || [];

  const configFile =
    files.map((file) => (file.name === "anantam.config.infx" ? true : false)) ||
    files.length === 0
      ? false
      : true;

  const initializeProject = () => {
    try {
      window.electron.create_folder({ path: folder_structure.root + "\\.env" });
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

  // Extracted save functionality
  const handle_save_file = useCallback(
    (data: { path: string; content: string }) => {
      const fixedPath = data.path.replace(/^\/+/, "").replace(/\\/g, "/");
      data.path = fixedPath;

      window.electron.save_file(data);

      setTimeout(() => {
        const model_editing_index = store
          .getState()
          .main.active_files.findIndex((file) => file.path === data.path);
        const model_editing = {
          ...store.getState().main.active_files[model_editing_index],
        };
        const _active_file = [...store.getState().main.active_files];

        model_editing.is_touched = false;
        _active_file[model_editing_index] = model_editing;
        dispatch(update_active_files(_active_file));
      }, 0);
    },
    [dispatch]
  );

  // Function to display files in the dropdown menu
  const handle_set_editor = useCallback(
    async (branch_name: string, full_path: string) => {
      const get_file_content =
        await window.electron.get_file_content(full_path);
      const active_file: TActiveFile = {
        icon: <FileIcon type={branch_name.split(".").at(-1)} />, // Pass a size prop
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
                  handle_set_editor(file.name, file.path + `\\${file.name}`)
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

  // Settings dropdown
  const generateSettingsMenu = () => {
    return (
      <Menu>
        <Menu.Item key="theme" onClick={() => console.log("Change Theme")}>
          Change Theme
        </Menu.Item>
        <Menu.Item
          key="editor-settings"
          onClick={() => console.log("Editor Settings")}
        >
          Editor Settings
        </Menu.Item>
        <Menu.Item key="preferences" onClick={() => console.log("Preferences")}>
          Preferences
        </Menu.Item>
      </Menu>
    );
  };

  // Search handler
  const [searchQuery, setSearchQuery] = useState("");
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
            <Button style={{ border: "none", padding: 0, margin: 0 }}>
              <FileOutlined />
            </Button>
            <Button
              style={{
                border: "none",
                padding: 0,
                margin: 0,
              }}
              onClick={() => setNewProjectModalVisibilty(true)}
            >
              <Tooltip title="New Project">
                <FolderAddOutlined />
              </Tooltip>
            </Button>
            <Button
              style={{ border: "none", padding: 0, margin: 0 }}
              onClick={() => {
                const current_file = store
                  .getState()
                  .main.active_files.find((file) => file.is_touched);
                if (current_file) {
                  try {
                    handle_save_file({
                      path: current_file.path,
                      content: `${window.electron.get_file_content(
                        current_file.path
                      )}`,
                    });
                  } catch (err) {
                    message.error(err);
                  } finally {
                    message.info("saved successfully");
                  }
                }
              }}
            >
              <SaveOutlined />
            </Button>
            <Button style={{ border: "none", padding: 0, margin: 0 }}>
              <BugOutlined />
            </Button>
            <Button style={{ border: "none", padding: 0, margin: 0 }}>
              <BarsOutlined />
            </Button>
            <Button style={{ border: "none", padding: 0, margin: 0 }}>
              <CopyOutlined />
            </Button>
            {!configFile && (
              <Button
                style={{ border: "none", padding: 0, margin: 0 }}
                onClick={initializeProject}
              >
                <Tooltip title="Inilize Anantam Project">
                  <ImportOutlined />
                </Tooltip>
              </Button>
            )}
          </div>
        </div>

        {/* Search Bar in the middle */}
        <div className="search-bar">
          <AutoComplete style={{ width: 300 }} allowClear>
            <Input
              prefix={<SearchOutlined />}
              value={searchQuery}
              placeholder="Search Files"
            />
          </AutoComplete>
        </div>

        <div className="project-info">
          <Button>Data Studio</Button>
          <Dropdown overlay={generateFileMenu()} trigger={["click"]}>
            <Button style={{ border: "none" }}>
              {folder_structure?.name?.split(/\/|\\/).at(-1)}
            </Button>
          </Dropdown>

          {/* Settings Dropdown */}
          <Dropdown overlay={generateSettingsMenu()} trigger={["click"]}>
            <Button style={{ border: "none" }}>
              <SettingOutlined />
            </Button>
          </Dropdown>
        </div>
      </div>
    </div>
  );
});

export default HeaderSection;
