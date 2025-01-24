import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
  IFolderStructure,
  IMainState,
  TActiveFile,
  TIndent,
  TDataStudioActive,
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

  data_studio_active: { active: false } as TDataStudioActive,
  file_cache: {}, // Initialize file_cache as an empty object
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
    update_data_studio_active: (
      state,
      action: PayloadAction<TDataStudioActive>
    ) => {
      state.data_studio_active = action.payload;
    },
    // New reducer for caching file content
    cache_file_content: (
      state,
      action: PayloadAction<{ [filePath: string]: string }>
    ) => {
      state.file_cache = {
        ...state.file_cache,
        ...action.payload, // Merge new content into file_cache
      };
    },
  },
});

export const {
  set_folder_structure,
  update_active_files,
  update_active_file,
  update_indent,
  set_settings_tab,
  update_data_studio_active,
  cache_file_content, // Export new action
} = mainSlice.actions;

export default mainSlice.reducer;
