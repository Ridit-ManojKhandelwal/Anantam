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
import { IFolderStructure, TActiveFile } from "../../shared/types";
import { ReactComponent as TimesIcon } from "../../assets/svg/times.svg";
import PerfectScrollbar from "react-perfect-scrollbar";
import { MainContext } from "../../shared/functions";
const SettingsComponent = React.lazy(
  () => import("../settings-section/settings")
);
const DataStudio = React.lazy(() => import("../data-studio/app"));

import { CaretRightFilled, SettingOutlined } from "@ant-design/icons/lib";
import { Tools } from "../tools";
import { Splitter } from "antd/es";

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

  const useMainContextIn = React.useContext(MainContext);

  const [interpreterMenuOpen, setInterpreterMenuOpen] = useState(false);
  const [interpreter, setInterpreter] = useState("");
  const [interpreters, setInterpreters] = useState<string[]>([]);

  useEffect(() => {
    const getInterpreter = async () => {
      const savedInterpreter = await window.electron.get_interpreter();
      if (savedInterpreter?.path) {
        setInterpreters((prev) =>
          prev.includes(savedInterpreter.path)
            ? prev
            : [...prev, savedInterpreter.path]
        );
        console.log(savedInterpreter);
      }
    };

    getInterpreter();
  }, []);

  const toggleInterpreterMenu = () => {
    setInterpreterMenuOpen(!interpreterMenuOpen);
  };

  const handleSelectInterpreter = (selectedInterpreter: string) => {
    setInterpreter(selectedInterpreter);
    setInterpreterMenuOpen(false);
  };

  const handleAddInterpreter = async () => {
    try {
      const selectedFiles = await window.electron.selectInterpreter();
      if (selectedFiles && selectedFiles.length > 0) {
        const newInterpreter = selectedFiles;

        const prevInterpreter = await window.electron.get_interpreter();

        const prevInterpreterArray = Array.isArray(prevInterpreter)
          ? prevInterpreter
          : prevInterpreter?.path
          ? [prevInterpreter]
          : [];

        const interpreters = {
          ...prevInterpreterArray.map((interpreter) => ({
            path: interpreter.path,
          })),
          path: newInterpreter,
        };

        setInterpreters((prev) => [...prev, newInterpreter.path]);

        await window.electron.set_interpreter(interpreters);
      }
    } catch (error) {
      console.error("Error adding interpreter:", error);
    }
  };

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
    const settings = await window.electron.get_settings();
    const vars = await window.electron.get_variables(active_file.path);
    dispatch(update_terminal_active(true));
    dispatch(update_env_vars(vars));
    window.electron.run_code({
      path: active_file.path,
      script: "python3",
    });
  };

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
            {active_files.map((file) => (
              <div
                onClick={() => handle_set_selected_file(file)}
                className={
                  "tab" + (active_file?.path == file.path ? " active" : "")
                }
              >
                <span>{file.icon}</span>
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
            <div className="runTool">
              <button onClick={handleRun}>
                <CaretRightFilled />
              </button>
            </div>
          </PerfectScrollbar>

          <div>
            <div className="toolbar">
              <div className="tools">
                <div className="path">
                  <p>{active_file.path}</p>
                </div>
                <div className="tool">
                  <div className="interpreter-dropdown">
                    <button onClick={toggleInterpreterMenu}>
                      {interpreter || "Select Interpreter"}
                    </button>
                    {interpreterMenuOpen && (
                      <div className="interpreter-menu">
                        <ul>
                          {interpreters.map((item, index) => (
                            <li
                              key={index}
                              onClick={() => handleSelectInterpreter(item)}
                            >
                              {item}
                            </li>
                          ))}
                        </ul>
                        <button
                          className="add-interpreter"
                          onClick={handleAddInterpreter}
                        >
                          Add Interpreter
                        </button>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      if (!settings) {
                        dispatch(set_settings_tab(true));
                      } else {
                        dispatch(set_settings_tab(false));
                      }
                    }}
                  >
                    <SettingOutlined />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="editor-container"></div>
        </div>
      )}
    </div>
  );
});

export default ContentSection;
