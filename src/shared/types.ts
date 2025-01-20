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
  interpreter: TInterpreter;
  data_studio_active: TDataStudioActive;
}

export type TDataStudioActive = {
  active: boolean;
};

// Active File Type
export type TActiveFile = {
  path: string;
  name: string;
  icon: string;
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
