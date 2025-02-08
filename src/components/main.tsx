// /*---------------------------------------------------------------------------------------------
//  *  Copyright (c) MNovus. All rights reserved.
//  *  Licensed under the MIT License. See License.txt in the project root for license information.
//  *--------------------------------------------------------------------------------------------*/

import React from "react";

import * as monaco from "monaco-editor";

import {
  update_active_files,
  update_env_vars,
  update_indent,
  update_terminal_active,
} from "../shared/rdx-slice";

import { MainContext } from "../shared/functions";
import { get_file_types } from "../shared/functions";
import { useAppDispatch, useAppSelector } from "../shared/hooks";
import { TSelectedFile } from "../shared/types";
import { store } from "../shared/store";

import { MonacoPyrightProvider } from "monaco-pyright-lsp";

import { App } from "./app";

const MainComponent = React.memo((props: any) => {
  const folder_structure = useAppSelector(
    (state) => state.main.folder_structure
  );

  const editor_ref = React.useRef<
    monaco.editor.IStandaloneCodeEditor | undefined
  >();

  const editor_files_ref = React.useRef<
    { editor_id: string; editor_state: monaco.editor.ICodeEditorViewState }[]
  >([]);
  const dispatch = useAppDispatch();
  const active_files = useAppSelector((state) => state.main.active_files);

  const active_file = useAppSelector((state) => state.main.active_file);

  const handle_set_editor = React.useCallback(
    async (selected_file: TSelectedFile) => {
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

      async function initializeEditor() {
        const pyrightProvider = new MonacoPyrightProvider();
        await pyrightProvider.init(monaco);

        const editor = monaco.editor.create(
          document.getElementById("#editor"),
          {
            value: "# Write your Python code here",
            language: "python",
          }
        );

        await pyrightProvider.setupDiagnostics(editor);
      }

      initializeEditor();

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

      editor_ref.current.addCommand(
        monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
        function () {
          console.log("will save");
          handle_save_file({
            path: editor_ref.current.getModel().uri.path,
            content: editor_ref.current.getValue(),
          });
        }
      );

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
    const active_files = store
      .getState()
      .main.active_files.filter((file) => file.path === active_file.path);
    window.electron.ipcRenderer.on("save-current-file", () => {
      console.log(active_file, active_files);
      active_files.forEach((file) => {
        handle_save_file({
          path: file.path,
          content: monaco.editor
            .getModels()
            .find((model) => model.uri.path == file.path)
            .getValue(),
        });
      });
    });
  }, []);

  React.useEffect(() => {
    try {
      window.electron.ipcRenderer.on("run-current-file", async () => {
        const vars = await window.electron.get_variables(active_file.path);
        dispatch(update_terminal_active(true));
        dispatch(update_env_vars(vars));
        window.electron.run_code({
          path: active_file.path,
          script: "python3",
        });
      });
    } catch {}
  });

  React.useEffect(() => {
    window.addEventListener("blur", handle_win_blur);
    return () => window.removeEventListener("blur", handle_win_blur);
  }, []);

  return (
    <MainContext.Provider
      value={{ handle_set_editor, handle_remove_editor, handle_save_file }}
    >
      <App />
    </MainContext.Provider>
  );
});

export default MainComponent;
