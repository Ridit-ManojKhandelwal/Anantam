import { useState } from "react";
import { OutputSection } from "../output-section/output";
import { Terminal } from "../terminal-section/terminal";

import "./bottom.css";

export const BottomSection = () => {
  const [section, setSection] = useState<number>(1);
  return (
    <div className="bottom-section">
      <div className="tabs">
        <div
          className={`tab ${section === 0 ? "active" : ""}`}
          onClick={() => setSection(0)}
        >
          <p>Output</p>
        </div>
        <div
          className={`tab ${section === 1 ? "active" : ""}`}
          onClick={() => setSection(1)}
        >
          <p>Terminal</p>
        </div>
      </div>
      <div className="tab-content">
        {section === 0 && (
          <div>
            <h3>Output</h3>
            <OutputSection />
          </div>
        )}
        {section === 1 && (
          <div>
            <h3>Terminal</h3>
            <Terminal />
          </div>
        )}
      </div>
    </div>
  );
};
