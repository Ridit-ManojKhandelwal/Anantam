import React, { useEffect, useState } from "react";
import { types } from "../../backend/types";
import * as XLSX from "xlsx";

import "../../../tools/styling/table.css";

export const VarInfo = ({ data }: any) => {
  const [tableData, setTableData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const onPageChange = (page: number, pageSize: number) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  useEffect(() => {
    if (data.type === "excel" && data.path) {
      fetchExcelData(data.path);
    }
  }, [data.path]);

  const fetchExcelData = (filePath: string) => {
    window.electron
      .get_file_content(filePath)
      .then((buffer) => {
        console.log("Buffer:", buffer);
        const workbook = XLSX.read(buffer, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        console.log("Sheet Name:", sheetName);
        console.log("Sheet Object:", sheet);

        if (!sheet["!ref"]) {
          sheet["!ref"] = "A1:Z100";
        }

        console.log("Sheet !ref:", sheet["!ref"]);

        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        console.log("JSON Data:", jsonData);

        if (jsonData.length > 0) {
          const columnKeys = Object.keys(jsonData[0]);
          setColumns(
            columnKeys.slice(0, 5).map((key) => ({
              title: key,
              dataIndex: key,
              key: key,
            }))
          );
          setTableData(jsonData.slice(0, pageSize));
        } else {
          console.warn("JSON Data is empty!");
        }
      })
      .catch((error) => {
        console.error("Error reading Excel file:", error);
      });
  };

  const paginatedData = tableData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="var-info-wrapper">
      <div onContextMenu={() => window.electron.varinfo_contextmenu(data)}>
        <nav>
          <span>{types.map((type: any) => type[data.type])}</span>
          <p
            style={{
              fontFamily: '"Jetbrains", monospace',
              fontSize: "24px",
            }}
          >
            {data.name}
          </p>
        </nav>
        <p>`{data.path}`</p>
      </div>

      <div>
        <ul>
          <li>
            <p>Type</p>
            <p>{data.type}</p>
          </li>
          <li>
            <p>Is Excel</p>
            <p>{data.type === "excel" ? "Yes" : "No"}</p>
          </li>
          <li>
            <p>Tools Support</p>
            <p>{data.type === "excel" ? "Yes" : "No"}</p>
          </li>
          {data.type === "excel" && (
            <li>
              <p>Tools Available</p>
              <p>Table, Charts, Data Cleaning.</p>
            </li>
          )}
          <ul>
            <p>Info</p>
            {data.type === "excel" && (
              <ul>
                <li>
                  <p>Skip Rows</p>
                  <p>{data.skip_rows}</p>
                </li>
                <li>
                  <p>Sheet Name</p>
                  <p>{data.sheet}</p>
                </li>
              </ul>
            )}
          </ul>
        </ul>
      </div>

      <div>
        <h2>Preview</h2>
        {data.type === "excel" ? <div></div> : <p>no excel</p>}
      </div>
    </div>
  );
};
