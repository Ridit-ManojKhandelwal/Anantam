import React, { useRef, useState } from "react";

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

  const { insertNode } = useTraverseTree();

  const handleInsertNode = (folderId: any, item: any, isFolder: any) => {
    const finalTree = insertNode(folder_structure, folderId, item, isFolder);
    dispatch(set_folder_structure(finalTree));
  };

  console.log(folder_structure);

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
              explorer={folder_structure}
            />
          </PerfectScrollbar>
        </div>
      </div>
    </div>
  );
});

export default Navigator;
