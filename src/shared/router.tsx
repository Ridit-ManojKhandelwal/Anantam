/*---------------------------------------------------------------------------------------------
 *  Copyright (c) MNovus. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createBrowserRouter, createHashRouter } from "react-router-dom";
import MainComponent from "../components/main";
import ExplorerRoute from "../components/sidebar-routes/navigator";
import SidebarIndexRoute from "../components/sidebar-routes/sidebarIndex";

export default createHashRouter([
  {
    path: "/main_window",
    element: <MainComponent />,
    errorElement: <MainComponent />,
    children: [
      {
        path: "/main_window",
        element: <ExplorerRoute />,
        index: true,
      },
    ],
  },
]);
