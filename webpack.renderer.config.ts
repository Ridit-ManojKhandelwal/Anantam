/*---------------------------------------------------------------------------------------------
 *  Copyright (c) MNovus. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { Configuration } from "webpack";

import { rules } from "./webpack.rules";
import { plugins } from "./webpack.plugins";

rules.push({
  test: /\.css$/,
  use: [{ loader: "style-loader" }, { loader: "css-loader" }],
});

rules.push({
  test: /\.svg$/,
  use: ["@svgr/webpack", "url-loader"],
});

export const rendererConfig: Configuration = {
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
    extensions: [".js", ".ts", ".jsx", ".tsx", ".css"],
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
