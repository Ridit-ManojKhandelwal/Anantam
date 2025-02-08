/*---------------------------------------------------------------------------------------------
 *  Copyright (c) MNovus. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { Configuration } from "webpack";

import { rules } from "./webpack.rules";
import { plugins } from "./webpack.plugins";

import path from "path";

export const mainConfig: Configuration = {
  entry: "./src/index.ts",
  // output: {
  //   globalObject: "self",
  //   filename: "[name].js",
  //   path: path.resolve(__dirname, ".webpack"),
  //   publicPath: "/",
  // },

  module: {
    rules,
  },
  plugins,
  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx", ".css", ".json"],
  },
};
