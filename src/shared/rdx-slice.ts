/*---------------------------------------------------------------------------------------------
 *  Copyright (c) MNovus. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
  IFolderStructure,
  IMainState,
  TActiveFile,
  TIndent,
  TSettings,
} from "./types";

// Define the initial state using that type
const initialState: IMainState = {
  folder_structure: {} as IFolderStructure,
  active_files: [],
  active_file: {} as TActiveFile,
  indent: {
    column: 0,
    line: 0,
  } as TIndent,
  settings_tab_active: false,
  settings: {
    theme: "vs-dark",
    minimap: false,
    smoothTyping: true,
    cursorAnimation: true,
    format: true,
  } as TSettings,
};

export const mainSlice = createSlice({
  name: "main",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    set_folder_structure: (state, action: PayloadAction<IFolderStructure>) => {
      state.folder_structure = action.payload;
    },
    update_active_files: (state, action: PayloadAction<TActiveFile[]>) => {
      state.active_files = action.payload;
    },
    update_active_file: (state, action: PayloadAction<TActiveFile>) => {
      state.active_file = action.payload;
    },
    update_indent: (state, action: PayloadAction<TIndent>) => {
      state.indent = action.payload;
    },
    set_settings_tab: (state, action: PayloadAction<boolean>) => {
      state.settings_tab_active = action.payload;
    },
    set_settings: (state, action: PayloadAction<TSettings>) => {
      state.settings = action.payload;
    },
  },
});

export const {
  set_folder_structure,
  update_active_files,
  update_active_file,
  update_indent,
  set_settings_tab,
  set_settings,
} = mainSlice.actions;

export default mainSlice.reducer;
