/*---------------------------------------------------------------------------------------------
 *  Copyright (c) MNovus. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import PerfectScrollbar from "react-perfect-scrollbar";

import { Terminal } from "./terminal";

export const MultiInstance = () => {
  return (
    <PerfectScrollbar className="scroller">
      <div className="multi-container">
        <Terminal key={Date.now().toString()} />
      </div>
    </PerfectScrollbar>
  );
};
