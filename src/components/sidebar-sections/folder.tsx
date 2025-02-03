import React, { useEffect, useState } from "react";
import { path_join } from "../../shared/functions";

import "./style.css";
import {
  FileAddFilled,
  FileOutlined,
  FolderAddOutlined,
  FolderOpenOutlined,
  FolderOutlined,
} from "@ant-design/icons/lib";
import FileIcon from "../../shared/file-icon";
import { useAppDispatch, useAppSelector } from "../../shared/hooks";
import { MainContext } from "../../shared/functions";

import {
  update_active_file,
  update_active_files,
} from "../../shared/rdx-slice";
import { TActiveFile } from "../../shared/types";

import { store } from "../../shared/store";

const Folder = React.memo(({ handleInsertNode = () => {}, explorer }: any) => {
  const [expand, setExpand] = useState(false);
  const [showInput, setShowInput] = useState({
    visible: false,
    isFolder: null,
  });

  const active_files = useAppSelector((state) => state.main.active_files);
  const useMainContextIn = React.useContext(MainContext);

  const dispatch = useAppDispatch();

  const handleNewFolder = (e: any, isFolder: any) => {
    e.stopPropagation();
    setExpand(true);
    setShowInput({
      visible: true,
      isFolder,
    });
  };

  const handle_set_editor = React.useCallback(
    async (branch_name: string, full_path: string) => {
      console.log("branch", branch_name, full_path);
      const get_file_content = await window.electron.get_file_content(
        full_path
      );
      const active_file: TActiveFile = {
        icon: "",
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
          .main.active_files.findIndex((file) => file.path == full_path) == -1
      ) {
        store.dispatch(
          update_active_files([
            ...store.getState().main.active_files,
            active_file,
          ])
        );
      }

      dispatch(update_active_file(active_file));

      // dispatch(set_selected_file(selected_file))
      setTimeout(() => {
        useMainContextIn.handle_set_editor(selected_file);
      }, 0);
    },
    [active_files]
  );

  const onAddFolder = (e: any) => {
    if (e.keyCode === 13 && e.target.value.trim()) {
      const newName = e.target.value.trim();

      // Check if the file or folder already exists
      const alreadyExists = explorer.items.some(
        (item: any) => item.name === newName
      );

      if (alreadyExists) {
        alert(
          `${
            showInput.isFolder ? "Folder" : "File"
          } "${newName}" already exists.`
        );
        return;
      }

      handleInsertNode(explorer.id, newName, showInput.isFolder);

      console.log(explorer);
      if (showInput.isFolder) {
        window.electron.create_folder({
          path: explorer.root,
          fileName: newName,
          rootPath: explorer.root,
        });
      } else {
        window.electron.create_file({
          path: path_join([explorer.path, newName]),
          fileName: newName,
          rootPath: explorer.root,
        });
      }

      setShowInput({ ...showInput, visible: false });
    }
  };

  if (explorer.isFolder) {
    return (
      <div style={{ marginTop: 5 }}>
        <div
          className="folder"
          onClick={() => setExpand(!expand)}
          onAuxClick={() =>
            window.electron.show_contextmenu({
              path: explorer.name,
              type: "folder",
              rootPath: explorer.root,
            })
          }
        >
          <span>
            {expand ? <FolderOpenOutlined /> : <FolderOutlined />}
            {explorer.name.split(/\/|\\/).at(-1)}
          </span>
          <div>
            <button onClick={(e) => handleNewFolder(e, true)}>
              <FolderAddOutlined />
            </button>
            <button onClick={(e) => handleNewFolder(e, false)}>
              <FileAddFilled />
            </button>
          </div>
        </div>
        <div style={{ display: expand ? "block" : "none", paddingLeft: 25 }}>
          {showInput.visible && (
            <div className="inputContainer">
              <span>
                {showInput.isFolder ? <FolderOutlined /> : <FileOutlined />}
              </span>
              <input
                type="text"
                onKeyDown={onAddFolder}
                onBlur={() => setShowInput({ ...showInput, visible: false })}
                className="inputContainer__input"
                autoFocus
              />
            </div>
          )}
          {explorer.items.map((exp: any) => {
            return (
              <span key={exp.id}>
                <Folder handleInsertNode={handleInsertNode} explorer={exp} />
              </span>
            );
          })}
        </div>
      </div>
    );
  } else {
    return (
      <span
        className="file"
        onClick={() =>
          handle_set_editor(
            explorer.name,
            path_join([explorer.path, explorer.name])
          )
        }
        onAuxClick={() =>
          window.electron.show_contextmenu({
            path: explorer.name,
            type: "file",
            rootPath: explorer.root,
          })
        }
      >
        {FileIcon({
          type: `${explorer.name}`.split(".").at(-1),
        })}
        {explorer.name}
      </span>
    );
  }
});

export default Folder;
