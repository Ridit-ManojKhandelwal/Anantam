/*---------------------------------------------------------------------------------------------
 *  Copyright (c) MNovus. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import React from "react";
import { useAppSelector } from "../../shared/hooks";

const HeaderSection = React.memo((props: any) => {
  const folder_structure = useAppSelector(
    (state) => state.main.folder_structure
  );

  return (
    <div className="header-section">
      {/* <p className="heading">Anantam</p> */}
      <div className="header-main"></div>
      <div className="icons-container"></div>
    </div>
  );
});

export default HeaderSection;
