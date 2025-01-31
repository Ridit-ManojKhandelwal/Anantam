import { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";

import { Table } from "./chart-engines/table";
import { BarChart } from "./chart-engines/bar-chart";
import { PieChart } from "./chart-engines/pie-chart";
import { LineChart } from "./chart-engines/line-chart";

import { useAppDispatch, useAppSelector } from "../../shared/hooks";

import "./styling/index.css";
import "./styling/table.css";
import {
  BarChartOutlined,
  ImportOutlined,
  LineChartOutlined,
  PieChartOutlined,
  TableOutlined,
  AreaChartOutlined,
  RadarChartOutlined,
  StockOutlined,
  FundOutlined,
} from "@ant-design/icons/lib";
import { update_tools_window_state } from "../../shared/rdx-slice";

export const ToolsWindow = () => {
  const data = useAppSelector((state) => state.main.toolsdata);
  const dispatch = useAppDispatch();

  const [tools, setTools] = useState<any[]>([
    "table",
    "bar_chart",
    "line_chart",
    "pie_chart",
    "area_chart",
    "radar_chart",
    "stock_chart",
    "fund_chart",
  ]);

  const toolsIcon: any = {
    table: <TableOutlined style={{ color: "#1890ff" }} />,
    bar_chart: <BarChartOutlined style={{ color: "#ff4d4f" }} />,
    line_chart: <LineChartOutlined style={{ color: "#52c41a" }} />,
    pie_chart: <PieChartOutlined style={{ color: "#faad14" }} />,
    area_chart: <AreaChartOutlined style={{ color: "#13c2c2" }} />,
    radar_chart: <RadarChartOutlined style={{ color: "#2f54eb" }} />,
    stock_chart: <StockOutlined style={{ color: "#722ed1" }} />,
    fund_chart: <FundOutlined style={{ color: "#eb2f96" }} />,
  };

  const [toolsContent, setToolsContent] = useState<any[]>([
    {
      table: <Table data={data} />,
      bar_chart: <BarChart data={data} />,
      line_chart: <LineChart data={data} />,
      pie_chart: <PieChart data={data} />,
      area_chart: <div>Area Chart</div>,
      radar_chart: <div>Radar Chart</div>,
      stock_chart: <div>Stock Chart</div>,
      fund_chart: <div>Fund Chart</div>,
    },
  ]);

  const [currentTool, setCurrentTool] = useState<string>("table");

  window.electron.ipcRenderer.on(
    "update-tools-data",
    (event: any, data: any) => {
      console.log(data);
    }
  );

  return (
    <div className="tools-wrapper">
      <div className="tools">
        <div className="tools-content">
          <p>{currentTool.toLocaleUpperCase()}</p>
          {toolsContent.map((toolContent) => toolContent[currentTool])}
        </div>
        <ul className="tools-list">
          {tools.map((tool, index) => (
            <div className="tool-container" key={tool}>
              <li
                className={`tool ${currentTool === tool && "tool-active"}`}
                id={tool}
                onClick={() => setCurrentTool(tool)}
                style={{
                  height: "40px",
                }}
              >
                <div className="tool-icon">{toolsIcon[tool]}</div>
              </li>
              {(index + 1) % 2 === 0 && <div className="line-break"></div>}
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
};
