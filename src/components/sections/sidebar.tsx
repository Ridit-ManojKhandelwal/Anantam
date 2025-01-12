/*---------------------------------------------------------------------------------------------
 *  Copyright (c) MNovus. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import React from "react";
import { ReactComponent as FileIcon } from "../../assets/svg/files.svg";
import { ReactComponent as SettingsIcon } from "../../assets/svg/settings.svg";
import { ReactComponent as InformationIcon } from "../../assets/svg/extensions.svg";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../shared/hooks";
import { set_settings_tab } from "../../shared/rdx-slice"; // Import your action

const SidebarSection = React.memo((props: any) => {
  const route = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Select the settings_tab_active state
  const isSettingsTabActive = useAppSelector(
    (state) => state.main.settings_tab_active
  );

  const handleSettingsOpen = () => {
    if (!isSettingsTabActive) {
      dispatch(set_settings_tab(true)); // Dispatch action to set it to true
    }
  };

  React.useEffect(() => {
    console.log("route", route);
  }, [route]);

  React.useEffect(() => {
    // If no route is selected, navigate to the default route
    if (route.pathname === "/") {
      navigate("/main_window");
    }
  }, [route.pathname, navigate]);

  return (
    // <SidebarContext.Provider value={{handle_set_editor}}>
    <div className="sidebar-section">
      <div className="icon-list">
        <div>
          <Link
            to={"/main_window"}
            className={
              "icon" + (route.pathname == "/main_window" ? " active" : "")
            }
          >
            <FileIcon />
            <div className="tooltip">Navigator</div>
          </Link>
          <Link
            to={"/main_window/information"} // Correct path
            className={
              "icon" +
              (route.pathname == "/main_window/information" ? " active" : "")
            }
          >
            <InformationIcon />
            <div className="tooltip">Information</div>
          </Link>
        </div>

        <div>
          <Link
            to=""
            className={
              "icon" +
              (route.pathname == "/main_window/settings" ? " active" : "")
            }
            onClick={handleSettingsOpen}
          >
            <SettingsIcon />
            <div className="tooltip">Settings</div>
          </Link>
        </div>
      </div>
      <div className="explorer-list">{<Outlet />}</div>
    </div>
    // </SidebarContext.Provider>
  );
});

export default SidebarSection;
