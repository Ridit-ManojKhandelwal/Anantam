/* eslint-disable import/no-duplicates */
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) MNovus. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import React from "react";

import ContentSection from "./sections/content";
import FooterComponent from "./sections/footer";
// import { MultiInstance } from "./terminal-section/multiInstance";
import { MainContext } from "../shared/functions";
import * as monaco from "monaco-editor";
import { Splitter } from "antd";
import { get_file_types } from "../shared/functions";
import { useAppDispatch, useAppSelector } from "../shared/hooks";
import { TActiveFile, TSelectedFile } from "../shared/types";
import {
  update_active_file,
  update_active_files,
  update_indent,
} from "../shared/rdx-slice";
import { store } from "../shared/store";
import HeaderSection from "./sections/header";
import { BottomSection } from "./sections/bottom";
import Navigator from "./sidebar-sections/navigator";
const MainComponent = React.memo((props: any) => {
  const folder_structure = useAppSelector(
    (state) => state.main.folder_structure
  );

  const uniqueFiles = Array.from(
    new Set(folder_structure?.tree?.map((file) => file.name) || [])
  ).map((name) => folder_structure?.tree?.find((file) => file.name === name));

  const files = uniqueFiles?.filter((file) => !file.is_dir) || [];

  const editor_ref = React.useRef<
    monaco.editor.IStandaloneCodeEditor | undefined
  >();
  // const [lspConnection, setLspConnection] = useState<LSPClient | null>(null);
  const editor_files_ref = React.useRef<
    { editor_id: string; editor_state: monaco.editor.ICodeEditorViewState }[]
  >([]);
  const dispatch = useAppDispatch();
  const active_files = useAppSelector((state) => state.main.active_files);

  const active_file = useAppSelector((state) => state.main.active_file);

  const handle_set_editor = React.useCallback(
    (selected_file: TSelectedFile) => {
      if (editor_ref.current != undefined) {
        const current_model = editor_ref.current.getModel();

        const current_model_index = editor_files_ref.current.findIndex(
          (editor) => editor.editor_id == current_model.uri.path
        );
        if (current_model_index > -1) {
          editor_files_ref.current.splice(current_model_index, 1);
          const state = editor_ref.current.saveViewState();
          editor_files_ref.current.push({
            editor_id: current_model.uri.path,
            editor_state: state,
          });
        } else {
          const state = editor_ref.current.saveViewState();
          editor_files_ref.current.push({
            editor_id: current_model.uri.path,
            editor_state: state,
          });
        }

        const target_model = monaco.editor
          .getModels()
          .filter((model) => model.uri.path == selected_file.path);
        if (target_model.length > 0) {
          const _model_index = editor_files_ref.current.findIndex(
            (editor) => editor.editor_id == selected_file.path
          );
          editor_ref.current.setModel(target_model[0]);

          return (
            _model_index > -1 &&
            editor_ref.current.restoreViewState(
              editor_files_ref.current[_model_index].editor_state
            )
          );
        }
      }

      const new_model = monaco.editor.createModel(
        selected_file.content,
        get_file_types(selected_file.name),
        monaco.Uri.file(selected_file.path)
      );
      monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
        jsx: 4,
        baseUrl: selected_file.path.split(/\\|\//g).at(-1),
      });

      monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: true,
        noSyntaxValidation: true,
      });

      if (editor_ref.current == undefined) {
        editor_ref.current = monaco.editor.create(
          document.querySelector(".editor-container"),
          {
            theme: "vs-dark",
            minimap: {
              enabled: false,
            },
          }
        );
      }
      editor_ref.current.setModel(new_model);

      editor_ref.current.onKeyUp((e) => {
        try {
          if (e.ctrlKey && e.keyCode == 49) {
            return handle_save_file({
              path: editor_ref.current.getModel().uri.path,
              content: editor_ref.current.getValue(),
            });
          }
        } catch {}
      });

      // Update active file is_touched on content change
      editor_ref.current.onDidChangeModelContent(async () => {
        try {
          const activeFile = store.getState().main.active_file;
          const currentContent = editor_ref.current.getModel()?.getValue();
          const fileContent = await window.electron.get_file_content(
            activeFile.path
          );

          let active_file_data = {
            path: activeFile.path,
            name: activeFile.name,
            icon: activeFile.icon,
            is_touched: true,
          };

          if (currentContent === fileContent) {
            active_file_data = {
              path: activeFile.path,
              name: activeFile.name,
              icon: activeFile.icon,
              is_touched: false,
            };
          }

          // Update is_touched flag based on content comparison
          dispatch(update_active_file(active_file_data));
        } catch {}
      });

      // Define a custom dark theme
      monaco.editor.defineTheme("dark", {
        base: "vs-dark", // Use the base dark theme
        inherit: true, // Inherit from the base theme
        rules: [],
        colors: {
          "editor.background": "#121212", // Set the background color
          "editor.foreground": "#d4d4d4", // Set default text color
          "editor.lineHighlightBackground": "#2a2a2a", // Highlighted line color
          "editorCursor.foreground": "#ffffff", // Cursor color
          "editor.selectionBackground": "#264f78", // Selection background
          "editor.inactiveSelectionBackground": "#3a3d41", // Inactive selection
          "editorLineNumber.foreground": "#858585", // Line numbers
          "editorLineNumber.activeForeground": "#ffffff", // Active line number
          "editorWhitespace.foreground": "#3e3e3e", // Whitespace markers
          "editorIndentGuide.background": "#3a3a3a", // Indent guides
          "editorIndentGuide.activeBackground": "#7a7a7a", // Active indent guides
        },
      });

      monaco.editor.setTheme("dark");

      editor_ref.current.onDidChangeModelContent((e) => {
        const model_editing_index = store
          .getState()
          .main.active_files.findIndex(
            (file) => file.path == editor_ref.current.getModel().uri.path
          );
        const model_editing = {
          ...store.getState().main.active_files[model_editing_index],
        };
        const _active_file = [...store.getState().main.active_files];

        _active_file.splice(model_editing_index, 1);
        model_editing.is_touched = true;
        _active_file[model_editing_index] = model_editing;
        dispatch(update_active_files(_active_file));
      });

      editor_ref.current.onDidChangeCursorPosition((e) => {
        dispatch(
          update_indent({
            line: e.position.lineNumber,
            column: e.position.column,
          })
        );
      });
    },
    [editor_ref.current, editor_files_ref.current, active_files]
  );

  const handle_save_file = React.useCallback(
    (data: { path: string; content: string }) => {
      // Save the file using the Electron API
      window.electron.save_file(data);

      setTimeout(() => {
        const state = store.getState();
        const model_editing_index = state.main.active_files.findIndex(
          (file) => file.path === data.path
        );

        if (model_editing_index !== -1) {
          const model_editing = {
            ...state.main.active_files[model_editing_index],
            is_touched: false, // Mark file as not touched
          };

          const _active_files = [...state.main.active_files];
          _active_files[model_editing_index] = model_editing;

          // Update the active file correctly without affecting other properties
          dispatch(update_active_file(model_editing));
        }
      }, 0);
    },
    []
  );

  const handle_remove_editor = React.useCallback(
    (selected_file: TSelectedFile) => {
      const is_current_model =
        editor_ref.current.getModel().uri.path == selected_file.path;
      const allModels = monaco.editor.getModels();
      const target_model_index = allModels.findIndex(
        (model) => model.uri.path == selected_file.path
      );
      // monaco.editor.add
      // monaco.editor.getModels().splice(target_model_index, 1)

      monaco.editor.getModels()[target_model_index].dispose();

      if (is_current_model) {
        const new_index =
          target_model_index == 0 ? target_model_index : target_model_index - 1;

        if (monaco.editor.getModels().length > 0) {
          editor_ref.current.setModel(monaco.editor.getModels()[new_index]);
        } else {
          editor_ref.current.dispose();
          editor_ref.current = undefined;
        }
      }
    },
    [editor_ref.current]
  );

  const handle_win_blur = React.useCallback(() => {
    const blurred_active_files = store
      .getState()
      .main.active_files.filter((file) => file.is_touched == true);
    blurred_active_files.forEach((file) => {
      handle_save_file({
        path: file.path,
        content: monaco.editor
          .getModels()
          .find((model) => model.uri.path == file.path)
          .getValue(),
      });
    });
  }, []);

  React.useEffect(() => {
    window.addEventListener("blur", handle_win_blur);
    return () => window.removeEventListener("blur", handle_win_blur);
  }, []);

  return (
    <MainContext.Provider
      value={{ handle_set_editor, handle_remove_editor, handle_save_file }}
    >
      <div
        className={`wrapper-component `}
        style={{ height: "100vh", display: "flex", flexDirection: "column" }}
      >
        <HeaderSection />
        <div className="middle-section" style={{ flex: 1, display: "flex" }}>
          <Splitter
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "row",
            }}
          >
            <Splitter.Panel defaultSize="20%" min="10%" max="95%">
              <Navigator />
            </Splitter.Panel>
            <Splitter.Panel>
              <Splitter layout="vertical">
                <Splitter.Panel>
                  <ContentSection />
                </Splitter.Panel>
                <Splitter.Panel defaultSize="40%" min="10%" max="95%">
                  <BottomSection />
                </Splitter.Panel>
              </Splitter>
            </Splitter.Panel>
          </Splitter>
        </div>
        <FooterComponent />
      </div>
    </MainContext.Provider>
  );
});

export default MainComponent;
