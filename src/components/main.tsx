/* eslint-disable import/no-duplicates */
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) MNovus. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import React from "react";

import SidebarSection from "./sections/sidebar";
import ContentSection from "./sections/content";
import FooterComponent from "./sections/footer";
// import { MultiInstance } from "./terminal-section/multiInstance";
import { MainContext } from "../shared/functions";
import * as monaco from "monaco-editor";
import { Splitter } from "antd";
import { get_file_types } from "../shared/functions";
import { useAppDispatch, useAppSelector } from "../shared/hooks";
import { TSelectedFile } from "../shared/types";
import { update_active_files, update_indent } from "../shared/rdx-slice";
import { store } from "../shared/store";
import HeaderSection from "./sections/header";
import { BottomSection } from "./sections/bottom";

const MainComponent = React.memo((props: any) => {
  const folder_structure = useAppSelector(
    (state) => state.main.folder_structure
  );

  const uniqueFiles = Array.from(
    new Set(folder_structure?.tree?.map((file) => file.name) || [])
  ).map((name) => folder_structure?.tree?.find((file) => file.name === name));

  const files = uniqueFiles?.filter((file) => !file.is_dir) || [];

  // Check for 'anantam.config.infx' file and remove duplicates
  const configFile = Array.from(
    new Set(
      files
        .map((file) => (file.name === "anantam.config.json" ? true : false))
        .filter(Boolean) // Remove false values
    )
  );

  const editor_ref = React.useRef<
    monaco.editor.IStandaloneCodeEditor | undefined
  >();
  // const [lspConnection, setLspConnection] = useState<LSPClient | null>(null);
  const editor_files_ref = React.useRef<
    { editor_id: string; editor_state: monaco.editor.ICodeEditorViewState }[]
  >([]);
  const dispatch = useAppDispatch();
  const active_files = useAppSelector((state) => state.main.active_files);
  const settings = useAppSelector((state) => state.main.settings);

  const handle_set_editor = React.useCallback(
    (selected_file: TSelectedFile) => {
      // Normalize file path to ensure consistent comparison
      const normalized_path = selected_file.path.trim().replace(/\\/g, "/");
      const normalized_selected_path = normalized_path.startsWith("/")
        ? normalized_path // Keep the leading / if already there
        : "/" + normalized_path; // Add / if missing

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

        if (!target_model) {
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
          document.querySelector(".editor-container"), // Target container
          {
            // THEME SETTINGS
            theme: settings.theme || "vs-dark", // Theme name
            colorDecorators: true, // Show inline color decorators (e.g., color previews)

            // MINIMAP
            minimap: {
              enabled: settings.minimap ?? true, // Enable/disable minimap
              side: "right", // "right" or "left"
              showSlider: "mouseover", // Slider behavior
              renderCharacters: true, // Render actual characters in minimap
              maxColumn: 120, // Max number of columns in the minimap
            },

            // CURSOR
            cursorStyle: settings.cursorStyle || "line", // "line", "block", "underline"
            cursorBlinking: settings.cursorAnimation ? "smooth" : "blink", // Cursor animation: "blink", "smooth", "phase", "expand"
            cursorSmoothCaretAnimation: settings.smoothTyping ? "on" : "off", // Smooth caret animation

            // EDITOR BEHAVIOR
            autoClosingBrackets:
              settings.autoClosingBracket || "languageDefined", // Auto close brackets
            autoClosingQuotes: settings.autoClosingQuotes || "languageDefined", // Auto close quotes
            autoSurround: settings.autoSurround || "languageDefined", // Auto surround text
            tabCompletion: settings.tabCompletion ? "on" : "off", // Enable tab completion: "on", "off", "onlySnippets"
            formatOnType: settings.format ?? true, // Format code while typing
            formatOnPaste: settings.format ?? true, // Format code on paste
            quickSuggestions: settings.quickSuggestions ?? true, // Show suggestions while typing
            wordWrap: settings.wordWrap ? "on" : "off", // Word wrap: "on", "off", "bounded", "wordWrapColumn"
            wrappingIndent: settings.wrappingIndent || "same", // Wrapping indentation
            links: settings.links ?? true, // Detect links in code
            linkedEditing: settings.linkedEditing ?? true, // Linked editing for HTML/XML tags

            // INDENTATION
            tabSize: settings.tabSize || 4, // Number of spaces per tab
            insertSpaces: settings.insertSpaces ?? true, // Use spaces instead of tabs
            autoIndent: settings.autoIndent || "full", // Auto indentation: "none", "keep", "brackets", "advanced", "full"

            // FONT & APPEARANCE
            fontSize: settings.fontSize || 14, // Font size
            fontFamily:
              settings.fontFamily ||
              "Fira Code, Consolas, 'Courier New', monospace", // Font family
            fontLigatures: settings.fontLigatures || true, // Enable font ligatures
            lineNumbers: settings.lineNumbers || "on", // Line numbers: "on", "off", "relative", "interval"
            lineDecorationsWidth: settings.lineDecorationsWidth || 20, // Width for line decorations
            lineHeight: settings.lineHeight || 20, // Line height
            glyphMargin: settings.glyphMargin ?? true, // Show glyph margin (e.g., for breakpoints)

            // SCROLLING & ANIMATIONS
            smoothScrolling: settings.smoothScrolling ?? true, // Enable smooth scrolling
            scrollBeyondLastLine: settings.scrollBeyondLastLine ?? true, // Allow scrolling beyond last line
            scrollbar: {
              vertical: "visible", // Vertical scrollbar: "auto", "visible", "hidden"
              horizontal: "visible", // Horizontal scrollbar: "auto", "visible", "hidden"
              useShadows: true, // Use shadows in scrollbars
              verticalScrollbarSize: 14, // Size of vertical scrollbar
              horizontalScrollbarSize: 10, // Size of horizontal scrollbar
            },

            // HIGHLIGHTING & TOKENIZATION
            renderWhitespace: settings.renderWhitespace || "boundary", // "none", "boundary", "selection", "all"
            renderControlCharacters: settings.renderControlCharacters ?? true, // Render control characters
            renderLineHighlight: settings.renderLineHighlight || "all", // Highlight current line: "none", "gutter", "line", "all"

            // CODE LENS & OVERVIEWS
            codeLens: settings.codeLens ?? true, // Show code lens
            overviewRulerBorder: settings.overviewRulerBorder ?? true, // Show border for the overview ruler
            overviewRulerLanes: settings.overviewRulerLanes || 3, // Number of lanes in the overview ruler

            // MULTIPLE CURSORS
            multiCursorModifier: settings.multiCursorModifier || "alt", // Modifier key for multiple cursors: "ctrlCmd", "alt"
            multiCursorMergeOverlapping:
              settings.multiCursorMergeOverlapping ?? true, // Merge overlapping cursors

            // FIND & REPLACE
            find: {
              autoFindInSelection: "always", // Auto find in selection
            },

            // OTHER SETTINGS
            selectionClipboard: settings.selectionClipboard ?? true, // Copy selection to clipboard
            copyWithSyntaxHighlighting:
              settings.copyWithSyntaxHighlighting ?? true, // Enable syntax highlighting in copied text
            suggestOnTriggerCharacters:
              settings.suggestOnTriggerCharacters ?? true, // Suggest completions on trigger characters
            acceptSuggestionOnEnter: settings.acceptSuggestionOnEnter || "on", // Accept suggestions on Enter: "on", "smart", "off"
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

      // Define a custom dark theme
      monaco.editor.defineTheme("dark", {
        base: "vs-dark", // Use the base dark theme
        inherit: true, // Inherit settings from the base theme
        rules: [
          // Python-specific token colors
          { token: "keyword.python", foreground: "#c586c0" }, // Keywords
          {
            token: "comment.python",
            foreground: "#6a9955",
            fontStyle: "italic",
          }, // Comments
          { token: "string.python", foreground: "#ce9178" }, // Strings
          { token: "number.python", foreground: "#b5cea8" }, // Numbers
          { token: "variable.python", foreground: "#9cdcfe" }, // Variables
          { token: "function.python", foreground: "#dcdcaa" }, // Function names

          // JavaScript-specific token colors
          { token: "keyword.js", foreground: "#569cd6" }, // Keywords
          { token: "comment.js", foreground: "#6a9955", fontStyle: "italic" }, // Comments
          { token: "string.js", foreground: "#d69d85" }, // Strings
          { token: "number.js", foreground: "#b5cea8" }, // Numbers
          { token: "variable.js", foreground: "#9cdcfe" }, // Variables
          { token: "function.js", foreground: "#dcdcaa" }, // Function names

          // HTML-specific token colors
          { token: "tag.html", foreground: "#569cd6" }, // Tags
          { token: "attribute.name.html", foreground: "#9cdcfe" }, // Attribute names
          { token: "attribute.value.html", foreground: "#ce9178" }, // Attribute values
          { token: "comment.html", foreground: "#6a9955", fontStyle: "italic" }, // Comments

          // CSS-specific token colors
          { token: "keyword.css", foreground: "#c586c0" }, // Keywords
          { token: "comment.css", foreground: "#6a9955", fontStyle: "italic" }, // Comments
          { token: "string.css", foreground: "#d69d85" }, // Strings
          { token: "number.css", foreground: "#b5cea8" }, // Numbers
          { token: "attribute.name.css", foreground: "#9cdcfe" }, // Attribute names

          // JSON-specific token colors
          { token: "property.json", foreground: "#9cdcfe" }, // Property names
          { token: "string.value.json", foreground: "#d69d85" }, // String values
          { token: "number.json", foreground: "#b5cea8" }, // Numbers
          { token: "comment.json", foreground: "#6a9955", fontStyle: "italic" }, // Comments
          { token: "keyword.json", foreground: "#c586c0" }, // Keywords
        ],
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

      if (settings.theme === "vs-dark") {
        // Set the theme to "dark"
        monaco.editor.setTheme("dark");
      } else {
        monaco.editor.setTheme("light");
      }

      if (configFile) {
        monaco.languages.registerCompletionItemProvider("python", {
          provideCompletionItems: (model, position) => {
            const wordUntilPosition = model.getWordUntilPosition(position);
            const lineContent = model.getLineContent(position.lineNumber);
            const triggerPattern = ['get_file("', "get_file('"]; // The specific text to trigger suggestions

            // Check if "get_file" has already been inserted in the line
            const isGetFileInserted =
              lineContent.includes('get_file("') ||
              lineContent.includes("get_file('");

            // Initialize an array to store suggestions
            const suggestions = [];

            // Add "get_file" suggestion if it's not inserted yet
            if (!isGetFileInserted) {
              suggestions.push({
                label: "get_file",
                kind: monaco.languages.CompletionItemKind.Function,
                insertText: 'get_file("")',
                documentation:
                  "Function used to get every file path in the directory, Provided by Anantam.",
                range: new monaco.Range(
                  position.lineNumber,
                  wordUntilPosition.startColumn,
                  position.lineNumber,
                  wordUntilPosition.endColumn
                ),
              });
            }

            // If the pattern is matched, add file path suggestions
            if (
              lineContent.includes(triggerPattern[0]) &&
              !lineContent.includes(triggerPattern[1])
            ) {
              const fileSuggestions = files
                .map((file) => ({
                  label: file.name,
                  kind: monaco.languages.CompletionItemKind.File,
                  insertText: `${file.path}\\${file.name}`,
                  documentation:
                    "This is a completion provided by Anantam for file path completions.",
                  range: new monaco.Range(
                    position.lineNumber,
                    wordUntilPosition.startColumn,
                    position.lineNumber,
                    wordUntilPosition.endColumn
                  ),
                }))
                .filter(
                  (suggestion, index, self) =>
                    index ===
                    self.findIndex(
                      (s) => s.insertText === suggestion.insertText
                    ) // Remove duplicates based on insertText
                );

              suggestions.push(...fileSuggestions);
            }

            // Return the suggestions
            return { suggestions };
          },
        });
      }
    },

    [editor_files_ref.current, active_files] // Dependencies for react hook
  );

  const handle_save_file = React.useCallback(
    (data: { path: string; content: string }) => {
      // Remove leading slashes and normalize backslashes to forward slashes
      const fixedPath = data.path.replace(/^\/+/, "").replace(/\\/g, "/");

      // Update the data.path with the fixed path
      data.path = fixedPath;

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
      // monaco.editor.getModels()[target_model_index].dispose();

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
