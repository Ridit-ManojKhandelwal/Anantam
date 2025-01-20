import React, { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../shared/hooks";
import {
  set_folder_structure,
  update_active_file,
  update_active_files,
  set_settings_tab,
} from "../../shared/rdx-slice";
import { IFolderStructure, TActiveFile } from "../../shared/types";
import { ReactComponent as TimesIcon } from "../../assets/svg/times.svg";
import { ReactComponent as SettingsIcon } from "../../assets/svg/settings.svg";
import { ReactComponent as PythonIcon } from "../../assets/svg/py.svg";
import SettingsComponent from "../settings-section/settings";
import PerfectScrollbar from "react-perfect-scrollbar";
import { MainContext } from "../../shared/functions";
import DataStudio from "../data-studio/app";
import { store } from "../../shared/store";
import FileIcon from "../../shared/file-icon";

const ContentSection = React.memo((props: any) => {
  const dispatch = useAppDispatch();
  const folder_structure = useAppSelector(
    (state) => state.main.folder_structure
  );

  const settings = useAppSelector((state) => state.main.settings_tab_active);
  const data_studio_active = useAppSelector(
    (state) => state.main.data_studio_active.active
  );

  const active_files = useAppSelector((state) => state.main.active_files);
  const active_file = useAppSelector((state) => state.main.active_file);
  // const editor_container_ref = React.useRef<HTMLDivElement | undefined>()
  const useMainContextIn = React.useContext(MainContext);

  const handle_open_folder = React.useCallback(async () => {
    const folder = (await window.electron.openFolder()) as IFolderStructure;
    folder != undefined && dispatch(set_folder_structure(folder));
  }, []);

  const handle_set_selected_file = React.useCallback(
    (active_file: TActiveFile) => {
      dispatch(update_active_file(active_file));
      useMainContextIn.handle_set_editor(active_file);
    },
    [active_files]
  );

  const handleRemoveFile = React.useCallback(
    (e: MouseEvent, file: TActiveFile) => {
      e.stopPropagation();
      const _clone = [...active_files];
      const index_to_remove = _clone.findIndex((_t) => _t.path == file.path);
      const targetFile = _clone[index_to_remove];
      _clone.splice(index_to_remove, 1);
      const next_index =
        index_to_remove == 0 ? index_to_remove : index_to_remove - 1;
      active_file.path == file.path &&
        dispatch(update_active_file(_clone[next_index]));
      dispatch(update_active_files(_clone));
      useMainContextIn.handle_remove_editor(targetFile);
    },
    [active_files, active_file]
  );

  return (
    <div className="content-section">
      {Object.keys(folder_structure).length == 0 && (
        <div className="default-screen">
          <button onClick={handle_open_folder}>Open Directory</button>
        </div>
      )}
      {Object.keys(folder_structure).length > 0 && active_files.length == 0 ? (
        <div className="no-selected-files">
          {data_studio_active ? (
            <DataStudio />
          ) : settings ? (
            <SettingsComponent />
          ) : (
            <div>
              <h1> Possibilities are endless!</h1>
            </div>
          )}
        </div>
      ) : (
        <div className="content-inner">
          <PerfectScrollbar className="page-tabs-cont" style={{ zIndex: 9 }}>
            {active_files.map((file) => {
              return (
                <div
                  key={file.path}
                  onClick={() => handle_set_selected_file(file)}
                  className={
                    "tab" + (active_file?.path === file.path ? " active" : "")
                  }
                >
                  <span>
                    <FileIcon type={file.icon} />
                  </span>
                  <span>{file.name}</span>

                  <span
                    onClick={(e) => handleRemoveFile(e as any, file)}
                    className="file-actions"
                  >
                    {active_file?.path === file.path &&
                    active_file.is_touched ? (
                      <div className="dot-icon" />
                    ) : (
                      <TimesIcon className="close-icon" />
                    )}
                  </span>
                </div>
              );
            })}
          </PerfectScrollbar>

          <div className="editor-container"></div>
        </div>
      )}
    </div>
  );
});

export default ContentSection;
