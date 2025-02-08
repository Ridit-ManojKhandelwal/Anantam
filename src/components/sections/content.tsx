import React, { useEffect, useRef, useState } from "react";

import { useAppDispatch, useAppSelector } from "../../shared/hooks";
import {
  set_data_tool_tab,
  set_folder_structure,
  set_settings_tab,
  update_active_file,
  update_active_files,
  update_env_vars,
  update_terminal_active,
} from "../../shared/rdx-slice";
import FileIcon from "../../shared/file-icon";

import { IFolderStructure, TActiveFile } from "../../shared/types";

import { ReactComponent as TimesIcon } from "../../assets/svg/times.svg";

import PerfectScrollbar from "react-perfect-scrollbar";

import { MainContext } from "../../shared/functions";

const SettingsComponent = React.lazy(
  () => import("../settings-section/settings")
);
const DataStudio = React.lazy(() => import("../data-studio/app"));

import { CaretRightFilled, SettingOutlined } from "@ant-design/icons/lib";

const ContentSection = React.memo((props: any) => {
  const dispatch = useAppDispatch();
  const {
    folder_structure,
    settings,
    data_studio_active,
    active_files,
    active_file,
    data_tab,
  } = useAppSelector((state) => ({
    folder_structure: state.main.folder_structure,
    settings: state.main.settings_tab_active,
    data_studio_active: state.main.data_studio_active.active,
    active_files: state.main.active_files,
    active_file: state.main.active_file,
    data_tab: state.main.set_data_tool_type_tab,
  }));

  const editorRef = useRef<HTMLDivElement>(null);

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

  const handleRun = async () => {
    const vars = await window.electron.get_variables(active_file.path);
    dispatch(update_terminal_active(true));
    dispatch(update_env_vars(vars));
    window.electron.run_code({
      path: active_file.path,
      script: "python3",
    });
  };

  return (
    <PerfectScrollbar>
      <div className="content-section">
        {Object.keys(folder_structure).length == 0 && (
          <div className="default-screen">
            <button onClick={handle_open_folder}>Open Directory</button>
          </div>
        )}
        {Object.keys(folder_structure).length > 0 &&
        active_files.length == 0 ? (
          <div className="no-selected-files">
            {data_studio_active ? (
              <React.Suspense fallback={<div>Loading...</div>}>
                <div
                  style={{
                    zIndex: 1000,
                  }}
                >
                  <DataStudio />
                </div>
              </React.Suspense>
            ) : settings ? (
              <React.Suspense fallback={<div>Loading...</div>}>
                <div
                  style={{
                    zIndex: 1000,
                  }}
                >
                  <SettingsComponent />
                </div>
              </React.Suspense>
            ) : (
              <div></div>
            )}
          </div>
        ) : (
          <div className="content-inner">
            <PerfectScrollbar className="page-tabs-cont" style={{ zIndex: 9 }}>
              <div className="tabs">
                {active_files.map((file) => (
                  <div
                    onClick={(e) => {
                      if (e.button === 1) {
                        handleRemoveFile(e as any, file);
                      } else {
                        handle_set_selected_file(file);
                      }
                    }}
                    key={file.path}
                    onMouseDown={(e) => e.button === 1 && e.preventDefault()}
                    className={
                      "tab" + (active_file?.path == file.path ? " active" : "")
                    }
                  >
                    <span>
                      {FileIcon({ type: file.name.split(".").at(-1) })}
                    </span>
                    <span>{file.name}</span>
                    <span
                      onClick={(e) => handleRemoveFile(e as any, file)}
                      className={file.is_touched ? "is_touched" : ""}
                    >
                      <TimesIcon />
                      <span className="dot"></span>
                    </span>
                  </div>
                ))}
              </div>
              <div className="runTool">
                <button onClick={handleRun}>
                  <CaretRightFilled />
                </button>
              </div>
            </PerfectScrollbar>
            <div className="editor-container" id="editor" ref={editorRef}></div>
          </div>
        )}
      </div>
    </PerfectScrollbar>
  );
});

export default ContentSection;
