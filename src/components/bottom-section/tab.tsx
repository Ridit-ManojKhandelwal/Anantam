import { useState } from "react";
import { Tools } from "../tools";
import { Terminal } from "../terminal-section/terminal";

import PerfectScrollbar from "react-perfect-scrollbar";
import { ExportOutlined, ImportOutlined } from "@ant-design/icons/lib";
import { useAppDispatch, useAppSelector } from "../../shared/hooks";
import { update_tools_window_state } from "../../shared/rdx-slice";
import { Tabs } from "../../anantui/index";

export const BottomTabs = () => {
  const [currentTab, setCurrentTab] = useState<number>(0);
  const tabs = [
    {
      key: 0,
      name: "Tools",
      content: <Tools />,
      closable: false,
      onTabClick: () => setCurrentTab(0),
    },
    {
      key: 1,
      name: "Terminal",
      content: <Terminal />,
      closable: false,
      onTabClick: () => setCurrentTab(1),
    },
  ];
  const tools_in_a_window = useAppSelector(
    (state) => state.main.tools_in_a_window
  );
  const dispatch = useAppDispatch();

  return (
    <PerfectScrollbar>
      <div className="bottom-wrapper">
        <Tabs
          items={tabs}
          customButtons={
            currentTab === 0 && [
              <button
                onClick={() =>
                  dispatch(
                    update_tools_window_state(tools_in_a_window ? false : true)
                  )
                }
              >
                {tools_in_a_window ? <ImportOutlined /> : <ExportOutlined />}
              </button>,
            ]
          }
          customButtonsTooltip={currentTab === 0 && ["Open In a New Window"]}
          defaultTabActive={0}
        />
        <div className="tab-content">
          {tabs.map((tab) => tab.key === currentTab && tab.content)}
        </div>
      </div>
    </PerfectScrollbar>
  );
};
