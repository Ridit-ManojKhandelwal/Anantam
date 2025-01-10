/*---------------------------------------------------------------------------------------------
 *  Copyright (c) MNovus. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import React, { useEffect, useState } from "react";

import SidebarSection from "./sections/sidebar";
import ContentSection from "./sections/content";
import FooterComponent from "./sections/footer";
// import { MultiInstance } from "./terminal-section/multiInstance";
import { MainContext } from "../shared/functions";
import * as monaco from "monaco-editor";
import { Splitter } from "antd";
import { get_file_types } from "../shared/functions";
// import { LSPClient, createConnection } from "monaco-languageclient";
import { useAppDispatch, useAppSelector } from "../shared/hooks";
import { TSelectedFile } from "../shared/types";
import { update_active_files, update_indent } from "../shared/rdx-slice";
import { store } from "../shared/store";
import HeaderSection from "./sections/header";

const MainComponent = React.memo((props: any) => {
  const editor_ref = React.useRef<
    monaco.editor.IStandaloneCodeEditor | undefined
  >();
  // const [lspConnection, setLspConnection] = useState<LSPClient | null>(null);
  const editor_files_ref = React.useRef<
    { editor_id: string; editor_state: monaco.editor.ICodeEditorViewState }[]
  >([]);
  const dispatch = useAppDispatch();
  const active_files = useAppSelector((state) => state.main.active_files);
  const folder_structure = useAppSelector(
    (state) => state.main.folder_structure
  );
  const settings = useAppSelector((state) => state.main.settings);

  const handle_set_editor = React.useCallback(
    (selected_file: TSelectedFile) => {
      console.log("selected_file", selected_file);

      // Normalize file path to ensure consistent comparison
      const normalized_path = selected_file.path.trim().replace(/\\/g, "/");
      const normalized_selected_path = normalized_path.startsWith("/")
        ? normalized_path // Keep the leading / if already there
        : "/" + normalized_path; // Add / if missing
      console.log("Normalized Path: ", normalized_selected_path);

      if (editor_ref.current) {
        const current_model = editor_ref.current.getModel();

        // Save the current model's state before switching tabs
        if (current_model) {
          const state = editor_ref.current.saveViewState();
          const current_model_index = editor_files_ref.current.findIndex(
            (editor) => editor.editor_id === current_model.uri.path
          );

          if (current_model_index > -1) {
            editor_files_ref.current[current_model_index].editor_state = state;
          } else {
            editor_files_ref.current.push({
              editor_id: current_model.uri.path,
              editor_state: state,
            });
          }
        }

        // Check if the model already exists for the selected file
        let target_model = monaco.editor
          .getModels()
          .find((model) => model.uri.path === normalized_selected_path);

        // Debugging log to see the existing models
        const existing_models = monaco.editor
          .getModels()
          .map((model) => model.uri.path);
        console.log("Existing Models:", existing_models);

        if (!target_model) {
          console.log("Creating new model for", normalized_selected_path);
          target_model = monaco.editor.createModel(
            selected_file.content,
            get_file_types(selected_file.name),
            monaco.Uri.file(normalized_selected_path)
          );
        }

        // Only set the model if it's different from the current model
        if (target_model !== current_model) {
          // Set the new model
          editor_ref.current.setModel(target_model);

          // Restore the previous state of the model if available
          const target_model_state = editor_files_ref.current.find(
            (editor) => editor.editor_id === normalized_selected_path
          );
          if (target_model_state?.editor_state) {
            editor_ref.current.restoreViewState(
              target_model_state.editor_state
            );
          }
        }

        editor_ref.current.focus();
      } else {
        // Initialize the editor if not yet initialized
        const existing_model = monaco.editor
          .getModels()
          .find((model) => model.uri.path === normalized_selected_path);

        const model = existing_model
          ? existing_model
          : monaco.editor.createModel(
              selected_file.content,
              get_file_types(selected_file.name),
              monaco.Uri.file(normalized_selected_path)
            );

        // Initialize Monaco editor
        editor_ref.current = monaco.editor.create(
          document.querySelector(".editor-container"),
          {
            theme: settings.theme,
            minimap: { enabled: settings.minimap ? true : false },
            autoClosingBrackets: "always",
            cursorBlinking: settings.cursorAnimation ? "smooth" : "blink",
            autoIndent: "advanced",
            cursorSmoothCaretAnimation: settings.smoothTyping ? "on" : "off",
            smoothScrolling: true,
            links: true,
            linkedEditing: true,
            quickSuggestions: true,
            wrappingIndent: "indent",
            formatOnType: settings.format ? true : false,
            formatOnPaste: settings.format ? true : false,
            fontSize: settings.fontSize,
            fontFamily: settings.fontFamily,
            tabSize: settings.tabSize,
          }
        );

        editor_ref.current.setModel(model);
      }

      editor_ref.current.onDidChangeCursorPosition((e) => {
        dispatch(
          update_indent({
            line: e.position.lineNumber,
            column: e.position.column,
          })
        );
      });

      editor_ref.current.onKeyUp((e) => {
        if (e.ctrlKey && e.keyCode == 49) {
          return handle_save_file({
            path: editor_ref.current.getModel().uri.path,
            content: editor_ref.current.getValue(),
          });
        }
      });
    },

    [editor_files_ref.current, active_files] // Dependencies for react hook
  );

  const handle_save_file = React.useCallback(
    (data: { path: string; content: string }) => {
      // Remove leading slashes and normalize backslashes to forward slashes
      const fixedPath = data.path.replace(/^\/+/, "").replace(/\\/g, "/");

      // Update the data.path with the fixed path
      data.path = fixedPath;

      console.log(data.path);

      // Save the file
      window.electron.save_file(data);

      setTimeout(() => {
        const model_editing_index = store
          .getState()
          .main.active_files.findIndex((file) => file.path === data.path);
        const model_editing = {
          ...store.getState().main.active_files[model_editing_index],
        };
        const _active_file = [...store.getState().main.active_files];

        model_editing.is_touched = false;
        _active_file[model_editing_index] = model_editing;
        dispatch(update_active_files(_active_file));
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

      monaco.editor.getModels().splice(target_model_index, 1);
      console.log(
        "monaco.editor.getModels().length",
        monaco.editor.getModels().length
      );

      // monaco.editor.getModels()[target_model_index].dispose();

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

  // useEffect(() => {
  //   const socket: any = new WebSocket("ws://127.0.0.1:3000/python"); // Replace with your LSP server URL

  //   socket.onopen = () => {
  //     const reader = new WebSocketMessageReader(socket);
  //     const writer = new WebSocketMessageWriter(socket);
  //     const connection = createConnection(reader, writer);

  //     // Initialize LSP Client with Monaco
  //     const client = new LSPClient(connection, editor_ref.current);
  //     client.start();
  //     setLspConnection(client);
  //   };

  //   return () => {
  //     socket.close();
  //   };
  // }, []);

  // // Handle LSP connection after Monaco is mounted
  // useEffect(() => {
  //   if (lspConnection) {
  //     // Setup Monaco editor for LSP
  //     monaco.editor.create(document.querySelector(".editor-container")!, {
  //       theme: "vs-dark",
  //       minimap: { enabled: false },
  //     });

  //     editor_ref.current = monaco.editor.create(
  //       document.querySelector(".editor-container")!,
  //       {
  //         language: "python",
  //         theme: "vs-dark",
  //       }
  //     );
  //   }
  // }, [lspConnection]);

  return (
    <MainContext.Provider value={{ handle_set_editor, handle_remove_editor }}>
      <div
        className={`wrapper-component ${(settings.theme === "vs-dark" && "dark-mode") || "light-mode"}`}
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
              <SidebarSection />
            </Splitter.Panel>
            <Splitter.Panel>
              <Splitter layout="vertical">
                <Splitter.Panel>
                  <ContentSection />
                </Splitter.Panel>

                {/* <Splitter.Panel defaultSize="1%" min="1%" max="90%">
                  <PerfectScrollbar className="scroller" style={{ zIndex: 9 }}>
                    <MultiInstance />
                  </PerfectScrollbar>
                </Splitter.Panel> */}
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
