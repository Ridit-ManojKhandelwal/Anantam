import React from "react";
import { ReactComponent as RadioTowerIcon } from "../../assets/svg/radio-tower.svg";
import { ReactComponent as BracketErrorIcon } from "../../assets/svg/bracket-error.svg";
import { useAppSelector } from "../../shared/hooks";
import { get_file_types } from "../../shared/functions";

const FooterComponent = React.memo((props: any) => {
  const editor_indent = useAppSelector((state) => state.main.indent);
  const active_file = useAppSelector((state) => state.main.active_file);

  return (
    <div className="footer-section">
      <div>
        <div className="">
          <span>
            {active_file == undefined || "" ? "main" : active_file.name}
          </span>
        </div>
        <div className="">
          <span className="bigger-icon" style={{ marginRight: 5 }}>
            <RadioTowerIcon />
          </span>
          <div>Terminal</div>
        </div>
      </div>
      <div>
        <div className="">
          <div>
            Ln {editor_indent.line}, Col {editor_indent.column}
          </div>
        </div>
        <div className="">
          <div>Spaces: 4</div>
        </div>
        <div className="">
          <div>UTF-8</div>
        </div>
        <div className="">
          <div style={{ textTransform: "capitalize" }}>
            {active_file == undefined ? "" : get_file_types(active_file.name)}
          </div>
        </div>
      </div>
    </div>
  );
});

export default FooterComponent;
