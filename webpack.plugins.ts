/*---------------------------------------------------------------------------------------------
 *  Copyright (c) MNovus. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type IForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import MonacoWebpackPlugin from "monaco-editor-webpack-plugin";

import CopyPlugin from "copy-webpack-plugin";
import HtmlPlugin from "html-webpack-plugin";
import NodePlugin from "node-polyfill-webpack-plugin";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ForkTsCheckerWebpackPlugin: typeof IForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

export const plugins = [
  new ForkTsCheckerWebpackPlugin({
    logger: "webpack-infrastructure",
  }),
  new MonacoWebpackPlugin(),
  new HtmlPlugin({
    template: "src/index.html",
    chunks: ["main"],
  }),
  new CopyPlugin({
    patterns: [{ context: "src", from: "components/python/lib/**/*" }],
  }),
  new NodePlugin(),
];
