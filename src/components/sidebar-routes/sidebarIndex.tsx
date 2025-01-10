/*---------------------------------------------------------------------------------------------
 *  Copyright (c) MNovus. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import React from "react";
import { Outlet } from "react-router-dom";

const SidebarIndexRoute = React.memo((props: any) => {
  return <Outlet />;
});

export default SidebarIndexRoute;
