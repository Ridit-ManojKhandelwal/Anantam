import React, { useEffect, useRef } from "react";
import hljs from "highlight.js";
import "highlight.js/styles/obsidian.css"; // Replace with your preferred theme
import PerfectScrollBar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";

export const OutputSection = () => {
  const codeRef = useRef(null);

  // Highlight code whenever codeRef content changes
  useEffect(() => {
    if (codeRef.current) {
      hljs.highlightBlock(codeRef.current);
    }
  }, [codeRef.current?.innerHTML]); // Run whenever the content changes

  return (
    <PerfectScrollBar>
      <div className="output-container">
        <p className="info-text"></p>
        <pre>
          <code
            ref={codeRef}
            className="output bash"
            style={{
              background: "transparent",
            }}
          ></code>
        </pre>
        <p className="done-text"></p>
      </div>
    </PerfectScrollBar>
  );
};
