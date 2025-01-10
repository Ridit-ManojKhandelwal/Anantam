import React, { act } from "react";
import { useAppDispatch, useAppSelector } from "../../shared/hooks";
import {
  set_folder_structure,
  update_active_file,
  update_active_files,
  set_settings_tab,
} from "../../shared/rdx-slice";
import { IFolderStructure, TActiveFile } from "../../shared/types";
import { ReactComponent as TimesIcon } from "../../assets/svg/times.svg";
import { ReactComponent as PythonIcon } from "../../assets/svg/py.svg";
import { ReactComponent as SettingsIcon } from "../../assets/svg/settings.svg";
import SettingsComponent from "../sidebar-routes/settings";
import PerfectScrollbar from "react-perfect-scrollbar";
import { MainContext } from "../../shared/functions";

const ContentSection = React.memo((props: any) => {
  const dispatch = useAppDispatch();
  const folder_structure = useAppSelector(
    (state) => state.main.folder_structure
  );
  const active_files = useAppSelector((state) => state.main.active_files);
  const active_file = useAppSelector((state) => state.main.active_file);
  const settings = useAppSelector((state) => state.main.settings_tab_active);

  const useMainContextIn = React.useContext(MainContext);

  const handle_open_folder = React.useCallback(async () => {
    const folder = (await window.electron.openFolder()) as IFolderStructure;
    folder != undefined && dispatch(set_folder_structure(folder));
  }, []);

  const handle_set_selected_file = React.useCallback(
    (active_file: TActiveFile) => {
      if (active_file) {
        dispatch(update_active_file(active_file));
        useMainContextIn.handle_set_editor(active_file);
      }
    },
    [active_files]
  );

  const handleRemoveFile = React.useCallback(
    (e: React.MouseEvent, file: TActiveFile) => {
      e.stopPropagation(); // Prevent click event propagation to parent tab

      const _clone = [...active_files];
      const index_to_remove = _clone.findIndex((_t) => _t.path === file.path);

      if (index_to_remove > -1) {
        const wasActive = active_file?.path === file.path;

        // Remove file from active files
        const targetFile = _clone[index_to_remove];
        _clone.splice(index_to_remove, 1);

        // If the removed file was active, set the next file as active
        if (wasActive && _clone.length > 0) {
          const nextActiveFile =
            index_to_remove === 0 ? _clone[0] : _clone[index_to_remove - 1];
          dispatch(update_active_file(nextActiveFile));
        } else if (_clone.length === 0) {
          dispatch(update_active_file(null)); // No tabs left
        }

        dispatch(update_active_files(_clone));
        useMainContextIn.handle_remove_editor(targetFile);
      }
    },
    [active_files, active_file]
  );

  const handleRemoveSettings = React.useCallback(() => {
    set_settings_tab(false);
  }, []);

  return (
    <div className="content-section">
      {Object.keys(folder_structure).length == 0 && (
        <div className="default-screen">
          <button onClick={handle_open_folder}>Open Directory</button>
        </div>
      )}
      {Object.keys(folder_structure).length > 0 && active_files.length == 0 ? (
        <div className="no-selected-files">
          <PythonIcon />
        </div>
      ) : (
        <div className="content-inner">
          <PerfectScrollbar className="page-tabs-cont" style={{ zIndex: 9 }}>
            {active_files.map((file) => (
              <div
                key={file.path}
                onClick={() => handle_set_selected_file(file)}
                className={
                  "tab" + (active_file?.path == file.path ? " active" : "")
                }
              >
                <span>{file.icon}</span>
                <span>{file.name}</span>
                <span
                  onClick={(e) => handleRemoveFile(e as any, file)}
                  className="file-actions"
                >
                  <TimesIcon className="close-icon" />
                </span>
              </div>
            ))}

            {settings && (
              <div
                onClick={() => handle_set_selected_file({ path: "settings" })}
                className={
                  "tab" + (active_file?.path === "settings" ? " active" : "")
                }
              >
                <span>
                  <SettingsIcon />
                </span>
                <span>Settings</span>
                <span onClick={handleRemoveSettings} className="file-actions">
                  <TimesIcon className="close-icon" />
                </span>
              </div>
            )}
          </PerfectScrollbar>

          {active_file?.path === "settings" ? (
            <SettingsComponent />
          ) : (
            <div className="editor-container"></div>
          )}
        </div>
      )}
    </div>
  );
});

export default ContentSection;
