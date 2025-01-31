/*---------------------------------------------------------------------------------------------
 *  Copyright (c) MNovus. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import router from "./shared/router";
import { useAppDispatch } from "./shared/hooks";
import { IFolderStructure } from "./shared/types";
import { set_folder_structure } from "./shared/rdx-slice";
import { ConfigProvider, theme } from "antd/es";
import { PrimeReactProvider } from "primereact/api";

const App = React.memo((props: any) => {
  const dispatch = useAppDispatch();

  const get_folder = React.useCallback(async () => {
    const folder = (await window.electron.get_folder()) as IFolderStructure;
    folder != undefined && dispatch(set_folder_structure(folder));
  }, []);

  React.useLayoutEffect(() => {
    get_folder();
  }, []);

  return (
    <PrimeReactProvider>
      <ConfigProvider
        theme={{
          algorithm: [theme.darkAlgorithm, theme.compactAlgorithm],
        }}
      >
        <RouterProvider router={router} />
      </ConfigProvider>
    </PrimeReactProvider>
  );
});

export default App;
