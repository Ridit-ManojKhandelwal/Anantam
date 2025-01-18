/*---------------------------------------------------------------------------------------------
 *  Copyright (c) MNovus. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// Folder Structure Type
export interface IFolderStructure {
  name: string;
  root: string;
  tree: TFolderTree[];
}

// Folder Tree Type
export type TFolderTree = {
  name: string;
  parentPath: string;
  path: string;
  children?: TFolderTree[];
  is_dir: boolean;
};

// Normal settings
export interface IMainState {
  folder_structure: IFolderStructure;
  active_files: TActiveFile[];
  active_file: TActiveFile;
  settings_tab_active: boolean;
  indent: TIndent;
  settings: TSettings;
  interpreter: TInterpreter;
}

// Active File Type
export type TActiveFile = {
  path: string;
  name: string;
  icon: any;
  is_touched: boolean;
};

// Editor Indent Type
export type TIndent = {
  line: number;
  column: number;
};

// Selected file by Editor (or tab) Type
export type TSelectedFile = {
  name: string;
  path: string;
  content: string;
};

// Anantam Settings Types
export type TSettings = {
  // THEME SETTINGS
  theme?: "vs-dark" | "vs-light"; // Editor theme

  // MINIMAP
  minimap?: boolean; // Minimap visibility
  minimapSide?: "right" | "left"; // Minimap position
  minimapShowSlider?: "always" | "mouseover"; // Slider behavior
  minimapRenderCharacters?: boolean; // Render characters in minimap
  minimapMaxColumn?: number; // Maximum number of columns in minimap

  // CURSOR
  cursorStyle?: "line" | "block" | "underline"; // Cursor style
  cursorAnimation?: boolean; // Enable cursor animation
  smoothTyping?: boolean; // Smooth caret animation

  // EDITOR BEHAVIOR
  autoClosingBracket?: "always" | "languageDefined" | "never"; // Auto close brackets
  autoClosingQuotes?: "always" | "languageDefined" | "never"; // Auto close quotes
  autoSurround?: "brackets" | "quotes" | "never"; // Auto surround text
  tabCompletion?: "on" | "off" | "onlySnippets"; // Enable tab completion
  format?: boolean; // Auto format code
  quickSuggestions?: boolean; // Show inline suggestions
  wordWrap?: "on" | "off" | "bounded" | "wordWrapColumn"; // Word wrap behavior
  wrappingIndent?: "none" | "same" | "indent" | "deepIndent"; // Wrapping indentation
  links?: boolean; // Enable link detection
  linkedEditing?: boolean; // Enable linked editing for HTML/XML

  // INDENTATION
  tabSize?: number; // Tab size in spaces
  insertSpaces?: boolean; // Use spaces instead of tabs
  autoIndent?: "none" | "keep" | "brackets" | "advanced" | "full"; // Auto indentation mode

  // FONT & APPEARANCE
  fontSize?: number; // Font size
  fontFamily?: string; // Font family
  fontLigatures?: boolean; // Enable font ligatures
  lineNumbers?: "on" | "off" | "relative" | "interval"; // Line numbers mode
  lineDecorationsWidth?: number | string; // Width for line decorations
  lineHeight?: number; // Line height
  glyphMargin?: boolean; // Show glyph margin

  // SCROLLING & ANIMATIONS
  smoothScrolling?: boolean; // Enable smooth scrolling
  scrollBeyondLastLine?: boolean; // Allow scrolling beyond the last line
  scrollbar?: {
    vertical?: "auto" | "visible" | "hidden"; // Vertical scrollbar visibility
    horizontal?: "auto" | "visible" | "hidden"; // Horizontal scrollbar visibility
    useShadows?: boolean; // Enable scrollbar shadows
    verticalScrollbarSize?: number; // Vertical scrollbar size
    horizontalScrollbarSize?: number; // Horizontal scrollbar size
  };

  // HIGHLIGHTING & TOKENIZATION
  renderWhitespace?: "none" | "boundary" | "selection" | "all"; // Render whitespace visibility
  renderControlCharacters?: boolean; // Render control characters
  renderIndentGuides?: boolean; // Show indent guides
  renderLineHighlight?: "none" | "gutter" | "line" | "all"; // Line highlight mode
  highlightActiveIndentGuide?: boolean; // Highlight active indent guide

  // CODE LENS & OVERVIEWS
  codeLens?: boolean; // Enable code lens
  overviewRulerBorder?: boolean; // Show border in the overview ruler
  overviewRulerLanes?: number; // Number of overview ruler lanes

  // MULTIPLE CURSORS
  multiCursorModifier?: "ctrlCmd" | "alt"; // Modifier key for multiple cursors
  multiCursorMergeOverlapping?: boolean; // Merge overlapping cursors

  // FIND & REPLACE
  find?: {
    addExtraSpaceOnTop?: boolean; // Add extra space for the find widget
    autoFindInSelection?: "never" | "always" | "multiline"; // Auto find in selection
  };

  // OTHER SETTINGS
  selectionClipboard?: boolean; // Copy selection to clipboard
  copyWithSyntaxHighlighting?: boolean; // Enable syntax highlighting in copied text
  suggestOnTriggerCharacters?: boolean; // Suggest completions on trigger characters
  acceptSuggestionOnEnter?: "on" | "smart" | "off"; // Accept suggestions on Enter
};

export type TInterpreter = {
  path: string;
  pip_path: string;
};

// Main Context Functions Type
export interface IMainContext {
  handle_set_editor: Function;
  handle_remove_editor: Function;
  handle_save_file: Function;
}
