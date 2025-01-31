// /*---------------------------------------------------------------------------------------------
//  *  Copyright (c) MNovus. All rights reserved.
//  *  Licensed under the MIT License. See License.txt in the project root for license information.
//  *--------------------------------------------------------------------------------------------*/

import React, { useState } from "react";

import { MainContext } from "../shared/functions";
import * as monaco from "monaco-editor";
import { get_file_types } from "../shared/functions";
import { useAppDispatch, useAppSelector } from "../shared/hooks";
import { TSelectedFile } from "../shared/types";
import { update_active_files, update_indent } from "../shared/rdx-slice";
import { store } from "../shared/store";
import { Splitter } from "antd";
import FooterComponent from "./sections/footer";
import ContentSection from "./sections/content";
import { HeaderSection } from "./sections/header";
import { BottomTabs } from "./bottom-section/tab";
import Navigator from "./sidebar-sections/navigator";
import Enviornment from "./sidebar-sections/enviornment";

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

  const editor_files_ref = React.useRef<
    { editor_id: string; editor_state: monaco.editor.ICodeEditorViewState }[]
  >([]);
  const dispatch = useAppDispatch();
  const active_files = useAppSelector((state) => state.main.active_files);

  const active_file = useAppSelector((state) => state.main.active_file);

  const sidebarActive = useAppSelector((state) => state.main.sidebar_active);
  const terminalActive = useAppSelector((state) => state.main.terminal_active);

  const handle_set_editor = React.useCallback(
    (selected_file: TSelectedFile) => {
      console.log("selected_file", selected_file);

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
          console.log(
            "target_model",
            target_model,
            _model_index,
            editor_files_ref.current[_model_index],
            editor_files_ref.current
          );

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
            mouseWheelZoom: false,
            smoothScrolling: true,
            wrappingIndent: "same",
            fontSize: 14,
            fontFamily: "monospace",
            lineHeight: 22,
            renderLineHighlight: "none",
            renderWhitespace: "none",
            scrollBeyondLastLine: false,
            scrollBeyondLastColumn: 0,
            hover: {
              enabled: false,
            },
          }
        );
      }

      monaco.editor.defineTheme("dark", {
        base: "vs-dark",
        inherit: true,
        rules: [],
        colors: {
          "editor.background": "#282c34ff",
          "editor.foreground": "#abb2bfff",
          "editor.lineHighlightBackground": "#2c313aff",
          "editorCursor.foreground": "#ffffff",
          "editor.selectionBackground": "#264f78",
          "editor.inactiveSelectionBackground": "#3a3d41",
          "editorLineNumber.foreground": "#495162ff",
          "editorLineNumber.activeForeground": "#ffffff",
          "editorWhitespace.foreground": "#3e3e3e",
          "editorIndentGuide.background": "#3a3a3a",
          "editorIndentGuide.activeBackground": "#7a7a7a",
        },
      });

      monaco.editor.setTheme("dark");

      editor_ref.current.setModel(new_model);

      editor_ref.current.onKeyUp((e) => {
        if (e.ctrlKey && e.keyCode == 49) {
          console.log("will save");

          return handle_save_file({
            path: editor_ref.current.getModel().uri.path,
            content: editor_ref.current.getValue(),
          });
        }
      });

      editor_ref.current.onDidChangeModelContent(() => {
        const state = store.getState().main;
        const index = state.active_files.findIndex(
          (file) => file.path === editor_ref.current.getModel().uri.path
        );

        if (index !== -1) {
          const updated_files = [...state.active_files];
          updated_files[index] = { ...updated_files[index], is_touched: true };
          dispatch(update_active_files(updated_files));
        }
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
      window.electron.save_file(data);

      setTimeout(() => {
        const model_editing_index = store
          .getState()
          .main.active_files.findIndex((file) => file.path == data.path);
        const model_editing = {
          ...store.getState().main.active_files[model_editing_index],
        };
        const _active_file = [...store.getState().main.active_files];

        _active_file.splice(model_editing_index, 1);
        model_editing.is_touched = false;
        _active_file[model_editing_index] = model_editing;
        dispatch(update_active_files(_active_file));
      }, 0);
    },
    []
  );

  const handle_remove_editor = React.useCallback(
    (selected_file: TSelectedFile) => {
      console.log("selected_file", selected_file);

      const is_current_model =
        editor_ref.current.getModel().uri.path == selected_file.path;
      const allModels = monaco.editor.getModels();
      const target_model_index = allModels.findIndex(
        (model) => model.uri.path == selected_file.path
      );
      // monaco.editor.add
      // monaco.editor.getModels().splice(target_model_index, 1)
      console.log(
        "monaco.editor.getModels().length",
        monaco.editor.getModels().length
      );
      monaco.editor.getModels()[target_model_index].dispose();

      console.log(
        "monaco.editor.getModels().length",
        monaco.editor.getModels().length
      );
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
    console.log("win is blur");

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
            {sidebarActive ? (
              <Splitter.Panel defaultSize="20%" min="10%" max="95%">
                <Splitter
                  layout="vertical"
                  style={{
                    height: "100vh",
                    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <Splitter.Panel>
                    <Navigator />
                  </Splitter.Panel>

                  <Splitter.Panel>
                    <Enviornment />
                  </Splitter.Panel>
                </Splitter>
              </Splitter.Panel>
            ) : (
              ""
            )}
            <Splitter.Panel>
              <Splitter layout="vertical">
                <Splitter.Panel>
                  <ContentSection />
                </Splitter.Panel>
                {terminalActive ? (
                  <Splitter.Panel
                    defaultSize="30%"
                    min="10%"
                    max="95%"
                    className="terminal"
                  >
                    <BottomTabs />
                  </Splitter.Panel>
                ) : (
                  ""
                )}
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
