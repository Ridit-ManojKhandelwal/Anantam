/*---------------------------------------------------------------------------------------------
 *  Copyright (c) MNovus. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import React from "react";
import { ReactComponent as FileIcon } from "../../assets/svg/files.svg";
import { ReactComponent as SettingsIcon } from "../../assets/svg/settings.svg";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../shared/hooks";
import { set_settings_tab } from "../../shared/rdx-slice"; // Import your action

const SidebarSection = React.memo((props: any) => {
  const route = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Select the settings_tab_active state
  const isSettingsTabActive = useAppSelector(
    (state) => state.main.settings_tab_active
  );

  const handleSettingsOpen = () => {
    if (!isSettingsTabActive) {
      dispatch(set_settings_tab(true)); // Dispatch action to set it to true
    }
  };

  React.useEffect(() => {
    console.log("route", route);
  }, [route]);

  // const selected_file = useAppSelector((state) => state.main.selected_file); //

  // const editor_ref = React.useRef<
  //   monaco.editor.IStandaloneCodeEditor | undefined
  // >();
  // const editor_files_ref = React.useRef<
  //   { editor_id: string; editor_state: monaco.editor.ICodeEditorViewState }[]
  // >([]);
  // const dispatch = useAppDispatch();

  // const handle_set_editor = React.useCallback(
  //   (selected_file: TSelectedFile) => {
  //     console.log("selected_file", selected_file);

  //     if (editor_ref.current != undefined) {
  //       const current_model = editor_ref.current.getModel();

  //       const current_model_index = editor_files_ref.current.findIndex(
  //         (editor) => editor.editor_id == current_model.uri.path
  //       );
  //       if (current_model_index > -1) {
  //         editor_files_ref.current.splice(current_model_index, 1);
  //         const state = editor_ref.current.saveViewState();
  //         editor_files_ref.current.push({
  //           editor_id: current_model.uri.path,
  //           editor_state: state,
  //         });
  //       } else {
  //         const state = editor_ref.current.saveViewState();
  //         editor_files_ref.current.push({
  //           editor_id: current_model.uri.path,
  //           editor_state: state,
  //         });
  //       }

  //       const target_model = monaco.editor
  //         .getModels()
  //         .filter((model) => model.uri.path == selected_file.path);
  //       if (target_model.length > 0) {
  //         const _model_index = editor_files_ref.current.findIndex(
  //           (editor) => editor.editor_id == selected_file.path
  //         );
  //         editor_ref.current.setModel(target_model[0]);
  //         console.log(
  //           "target_model",
  //           target_model,
  //           _model_index,
  //           editor_files_ref.current[_model_index],
  //           editor_files_ref.current
  //         );

  //         return (
  //           _model_index > -1 &&
  //           editor_ref.current.restoreViewState(
  //             editor_files_ref.current[_model_index].editor_state
  //           )
  //         );
  //       }
  //     }

  //     const new_model = monaco.editor.createModel(
  //       selected_file.content,
  //       get_file_types(selected_file.name),
  //       monaco.Uri.file(selected_file.path)
  //     );
  //     monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
  //       jsx: 4,
  //       baseUrl: selected_file.path.split(/\\|\//g).at(-1),
  //     });

  //     monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
  //       noSemanticValidation: true,
  //       noSyntaxValidation: true,
  //     });

  //     if (editor_ref.current == undefined) {
  //       editor_ref.current = monaco.editor.create(
  //         document.querySelector(".editor-container"),
  //         {
  //           theme: "vs-dark",
  //         }
  //       );
  //     }
  //     editor_ref.current.setModel(new_model);

  //     // editor_ref.current.onKeyUp((e) => {
  //     //     dispatch(update_indent({
  //     //         line: editor_ref.current.getPosition().lineNumber,
  //     //         column: editor_ref.current.getPosition().column,
  //     //     }))
  //     // })

  //     editor_ref.current.onDidChangeCursorPosition((e) => {
  //       dispatch(
  //         update_indent({
  //           line: e.position.lineNumber,
  //           column: e.position.column,
  //         })
  //       );
  //     });
  //   },
  //   [editor_ref.current, editor_files_ref.current]
  // );

  React.useEffect(() => {
    // If no route is selected, navigate to the default route
    if (route.pathname === "/") {
      navigate("/main_window");
    }
  }, [route.pathname, navigate]);

  return (
    // <SidebarContext.Provider value={{handle_set_editor}}>
    <div className="sidebar-section">
      <div className="icon-list">
        <div>
          <Link
            to={"/main_window"}
            className={
              "icon" + (route.pathname == "/main_window" ? " active" : "")
            }
          >
            <FileIcon />
            <div className="tooltip">Navigator</div>
          </Link>
        </div>
        <div>
          <Link
            to=""
            className={
              "icon" +
              (route.pathname == "/main_window/settings" ? " active" : "")
            }
            onClick={handleSettingsOpen}
          >
            <SettingsIcon />
            <div className="tooltip">Settings</div>
          </Link>
        </div>
      </div>
      <div className="explorer-list">{<Outlet />}</div>
    </div>
    // </SidebarContext.Provider>
  );
});

export default SidebarSection;
