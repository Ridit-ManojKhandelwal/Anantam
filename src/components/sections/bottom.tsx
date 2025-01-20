import { useState } from "react";
import { OutputSection } from "../output-section/output";
import { Terminal } from "../terminal-section/terminal";

let update_active_tab = (tab: number) => {};

export const BottomSection = () => {
  const [section, setSection] = useState<number>(1);
  update_active_tab = (tab: number) => {
    setSection(tab);
  };
  return (
    <div className="bottom-section">
      <div className="tabs">
        <div
          className={`tab ${section === 0 ? "active" : ""}`}
          onClick={() => update_active_tab(0)}
        >
          <p>Output</p>
        </div>
        <div
          className={`tab ${section === 1 ? "active" : ""}`}
          onClick={() => update_active_tab(1)}
        >
          <p>Terminal</p>
        </div>
      </div>
      <div className="tab-content">
        {section === 0 && (
          <div>
            <OutputSection />
          </div>
        )}
        {section === 1 && (
          <div>
            <Terminal />
          </div>
        )}
      </div>
    </div>
  );
};

export default update_active_tab;
