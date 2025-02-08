import { Splitter } from "antd";

import FooterComponent from "./sections/footer";
import ContentSection from "./sections/content";

import { BottomTabs } from "./bottom-section/tab";

import Navigator from "./sidebar-sections/navigator";
import Enviornment from "./sidebar-sections/enviornment";

import { useAppSelector } from "../shared/hooks";

export const App = () => {
  const sidebarActive = useAppSelector((state) => state.main.sidebar_active);
  const terminalActive = useAppSelector((state) => state.main.terminal_active);

  return (
    <div
      className={`wrapper-component `}
      style={{ height: "100vh", display: "flex", flexDirection: "column" }}
    >
      <FooterComponent />
      <div className="middle-section" style={{ flex: 1, display: "flex" }}>
        <Splitter
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "row",
          }}
        >
          {sidebarActive ? (
            <Splitter.Panel defaultSize="20%" min="10%" max="95%">
              <Splitter
                layout="vertical"
                style={{
                  height: "100vh",
                  boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Splitter.Panel>
                  <Navigator />
                </Splitter.Panel>

                <Splitter.Panel>
                  <Enviornment />
                </Splitter.Panel>
              </Splitter>
            </Splitter.Panel>
          ) : (
            ""
          )}
          <Splitter.Panel>
            <Splitter layout="vertical">
              <Splitter.Panel>
                <ContentSection />
                <div id="#editor"></div>
              </Splitter.Panel>
              {terminalActive ? (
                <Splitter.Panel
                  defaultSize="30%"
                  min="10%"
                  max="95%"
                  className="terminal"
                >
                  <BottomTabs />
                </Splitter.Panel>
              ) : (
                ""
              )}
            </Splitter>
          </Splitter.Panel>
        </Splitter>
      </div>
    </div>
  );
};
