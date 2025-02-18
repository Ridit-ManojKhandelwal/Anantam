import React, { useEffect, useRef, useState } from "react";

import { useAppDispatch, useAppSelector } from "../../shared/hooks";
import { MainContext } from "../../shared/functions";

import PerfectScrollbar from "react-perfect-scrollbar";

import {
  set_folder_structure,
  update_active_file,
  update_active_files,
} from "../../shared/rdx-slice";
import { TActiveFile } from "../../shared/types";

import FileIcon from "../../shared/file-icon";
import { store } from "../../shared/store";

import { ReactComponent as AngleLeftIcon } from "../../assets/svg/d-chevron.svg";

import useTraverseTree from "../../hooks/use-traverse-tree";
import Folder from "./folder";

const Navigator = React.memo((props: any) => {
  const folder_structure = useAppSelector(
    (state) => state.main.folder_structure
  );

  const dispatch = useAppDispatch();

  const { insertNode, removeNode } = useTraverseTree();

  const useMainContextIn = React.useContext(MainContext);

  const active_files = useAppSelector((state) => state.main.active_files);

  const handleInsertNode = (folderId: any, item: any, isFolder: any) => {
    const finalTree = insertNode(folder_structure, folderId, item, isFolder);
    dispatch(set_folder_structure(finalTree));
  };

  const handleRemoveNode = (nodeId: any) => {
    const updatedTree = removeNode(folder_structure, nodeId);
    dispatch(set_folder_structure(updatedTree));
  };

  const handle_set_editor = React.useCallback(
    async (branch_name: string, full_path: string) => {
      console.log("branch", branch_name, full_path);
      const get_file_content =
        await window.electron.get_file_content(full_path);
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

  useEffect(() => {
    window.electron.ipcRenderer.on("new-file-tab", () => {
      console.log("new file");
      handle_set_editor("Untitled", "");
    });

    window.electron.ipcRenderer.on(
      "new-file-opened",
      (data: { fileName: string; filePath: string }) => {
        console.log("open file", data);
        handle_set_editor(data.fileName, data.filePath);
      }
    );
  }, []);

  return (
    <div className="folder-tree">
      <div className="explorer-content-wrapper">
        <div className="content-list-outer-container">
          <div>
            <AngleLeftIcon />
            <span>{folder_structure?.name?.split(/\/|\\/).at(-1)}</span>
          </div>
          <PerfectScrollbar className="scroller">
            {/* <div ref={content_main_div_ref} className="content-list main"></div> */}
            <Folder
              handleInsertNode={handleInsertNode}
              handleRemoveNode={handleRemoveNode}
              explorer={folder_structure}
            />
          </PerfectScrollbar>
        </div>
      </div>
    </div>
  );
});

export default Navigator;
