/*---------------------------------------------------------------------------------------------
 *  Copyright (c) MNovus. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { Configuration } from "webpack";

import { rules } from "./webpack.rules";
import { plugins } from "./webpack.plugins";

import path from "path";

export const mainConfig: Configuration = {
  entry: {
    main: "./src/index.ts",
    "editor.worker": "monaco-editor-core/esm/vs/editor/editor.worker.js",
    "python.ls.worker": "./src/language/python/worker.ts",
  },

  output: {
    path: path.join(__dirname, ".webpack"),
    filename: "[name].min.js",
  },
  module: {
    rules,
  },
  plugins,
  resolve: {
    alias: {
      "monaco-languages": "monaco-languages/release/esm/monaco.contribution",
      // required for monaco language client
      vscode: "monaco-languageclient/lib/vscode-compatibility",
      // required for monaco-yaml
      "monaco-editor": "monaco-editor-core",
    },
    extensions: [".js", ".ts", ".jsx", ".tsx", ".css", ".json"],
    fallback: {
      // required for pyodide
      fs: false,
      path: false,
      // required for vscode-languageserver
      net: false,
      child_process: false,
    },
  },
};
