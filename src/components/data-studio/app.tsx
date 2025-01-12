import React, { useState } from "react";
import PerfectScrollBar from "react-perfect-scrollbar";
import { Button, message, Steps, Table, Input } from "antd";
import XLSX from "xlsx"; // To handle Excel file reading
import { ReactComponent as ExcelIcon } from "../../assets/svg/excel.svg";
import { ReactComponent as CSVIcon } from "../../assets/svg/csv.svg";
import { ReactComponent as SQLIcon } from "../../assets/svg/sql.svg";
import { ReactComponent as PostGreSQLIcon } from "../../assets/svg/postgresql.svg";
import { ReactComponent as MySQLIcon } from "../../assets/svg/mysql.svg";
import { ReactComponent as JSONIcon } from "../../assets/svg/json.svg";
import "./styling/style.css";

const DataStudio = () => {
  const [step, setStep] = useState<number>(0);
  const [currentExcelSteps, setCurrentExcelSteps] = useState<number>(0);
  const [fileData, setFileData] = useState<any[]>([]);
  const [sheetName, setSheetName] = useState<string>("");
  const [skipRows, setSkipRows] = useState<number>(0);
  const [dataType, setDataType] = useState<string>("");

  const handleOptionClick = (type: string) => {
    setDataType(type);
    setStep(3); // Go to the second step where the data type selection is shown
  };

  const columns = [
    {
      title: "Column Name",
      dataIndex: "columnName", // Adjust this based on your data
      key: "columnName",
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
    },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      message.error("Please upload a valid file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = event.target?.result;
        if (!data) {
          throw new Error("Failed to read file data.");
        }

        const workbook = XLSX.read(data, { type: "binary" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]]; // Use first sheet by default
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        setFileData(jsonData);
        setStep(1); // Move to the Preview step after file is loaded
      } catch (error) {
        message.error(`Error reading the file: ${error.message}`);
      }
    };

    reader.onerror = (error) => {
      message.error(`File reading error: ${error}`);
    };

    reader.readAsBinaryString(file); // Read the file as binary string
  };

  const excelSteps = [
    {
      title: "Import",
      content: (
        <div>
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={(e) => handleFileUpload(e)}
            title="Upload Excel File"
          />
        </div>
      ),
    },
    {
      title: "Preview",
      content: (
        <div>
          {fileData ? (
            <Table
              dataSource={fileData}
              columns={columns}
              rowKey={(record) => record.id || Math.random()}
            />
          ) : (
            <p>No data to preview. Please upload a file first.</p>
          )}
        </div>
      ),
    },
    {
      title: "Settings",
      content: (
        <div>
          <div>
            <Input
              placeholder="Sheet Name"
              value={sheetName}
              onChange={(e) => setSheetName(e.target.value)}
              style={{ marginBottom: "16px" }}
            />
          </div>
          <div>
            <Input
              placeholder="Skip Rows"
              value={skipRows}
              onChange={(e: any) => setSkipRows(e.target.value)}
              style={{ marginBottom: "16px" }}
            />
          </div>
        </div>
      ),
    },
  ];

  return (
    <PerfectScrollBar
      style={{
        zIndex: 100,
      }}
    >
      <div className="data-studio">
        {step === 0 && (
          <div
            style={{
              display: "grid",
              gap: "16px",
              overflow: "hidden",
              width: "90vw",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                textAlign: "center",
              }}
            >
              <h1>Welcome to Data Studio</h1>
              <h2>Choose a option to continue.</h2>
            </div>
            <div
              style={{
                display: "flex",
                gap: "16px",
              }}
            >
              <div className="datatype" onClick={() => setStep(1)}>
                <div
                  className="datatype-option"
                  style={{
                    background: "#C8E9D6",
                  }}
                >
                  <ExcelIcon />
                </div>
                <div className="datatype-option-text">Add Data</div>
              </div>
              <div className="datatype" onClick={() => setStep(2)}>
                <div
                  className="datatype-option"
                  style={{
                    background: "#EEF5FB",
                  }}
                >
                  <JSONIcon />
                </div>
                <div className="datatype-option-text">View Data</div>
              </div>
            </div>
          </div>
        )}
        {step === 2 && (
          <div
            style={{
              display: "grid",
              gap: "16px",
              overflow: "hidden",
              width: "90vw",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                textAlign: "center",
              }}
            >
              <h1>Welcome to the world of data!</h1>
            </div>
            <div
              style={{
                display: "flex",
                gap: "16px",
              }}
            >
              <div className="datatype" onClick={() => setStep(1)}>
                <div
                  className="datatype-option"
                  style={{
                    background: "#C8E9D6",
                  }}
                >
                  <ExcelIcon />
                </div>
                <div className="datatype-option-text">Superstore</div>
              </div>
              <div className="datatype" onClick={() => setStep(1)}>
                <div
                  className="datatype-option"
                  style={{
                    background: "#C8E9D6",
                  }}
                >
                  <MySQLIcon />
                </div>
                <div className="datatype-option-text">MYSQL</div>
              </div>
              <div className="datatype" onClick={() => setStep(1)}>
                <div
                  className="datatype-option"
                  style={{
                    background: "#C8E9D6",
                  }}
                >
                  <PostGreSQLIcon />
                </div>
                <div className="datatype-option-text">Post</div>
              </div>
              <div className="datatype" onClick={() => setStep(1)}>
                <div
                  className="datatype-option"
                  style={{
                    background: "#C8E9D6",
                  }}
                >
                  <CSVIcon />
                </div>
                <div className="datatype-option-text">CSV Data</div>
              </div>
            </div>
          </div>
        )}
        {step === 1 && (
          <div className="option-grid">
            <div className="heading-area">
              <h1>Choose data file type.</h1>
            </div>
            <div
              className="option-area"
              style={{
                display: "flex",
              }}
            >
              <div
                className="datatype"
                onClick={() => handleOptionClick("Excel")}
              >
                <div
                  className="datatype-option"
                  style={{
                    background: "#C8E9D6",
                  }}
                >
                  <ExcelIcon />
                </div>
                <div className="datatype-option-text">
                  Import data from Excel
                </div>
              </div>
              <div
                className="datatype"
                onClick={() => handleOptionClick("CSV")}
              >
                <div
                  className="datatype-option"
                  style={{
                    background: "#EEF5FB",
                  }}
                >
                  <CSVIcon />
                </div>
                <div className="datatype-option-text">Import data from CSV</div>
              </div>
              <div
                className="datatype"
                onClick={() => handleOptionClick("JSON")}
              >
                <div
                  className="datatype-option"
                  style={{
                    background: "#EEF5FB",
                  }}
                >
                  <JSONIcon />
                </div>
                <div className="datatype-option-text">
                  Import data from JSON
                </div>
              </div>
              <div
                className="datatype"
                onClick={() => handleOptionClick("SQL")}
              >
                <div
                  className="datatype-option"
                  style={{
                    background: "#FCFCF4",
                  }}
                >
                  <SQLIcon />
                </div>
                <div className="datatype-option-text">Import data from SQL</div>
              </div>
              <div
                className="datatype"
                onClick={() => handleOptionClick("PostgreSQL")}
              >
                <div
                  className="datatype-option"
                  style={{
                    background: "#EEF5FB",
                  }}
                >
                  <PostGreSQLIcon />
                </div>
                <div className="datatype-option-text">
                  Import data from PostgreSQL
                </div>
              </div>
              <div
                className="datatype"
                onClick={() => handleOptionClick("MySQL")}
              >
                <div
                  className="datatype-option"
                  style={{
                    background: "#FCFCF4",
                  }}
                >
                  <MySQLIcon />
                </div>
                <div className="datatype-option-text">
                  Import data from MySQL
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Only display Excel-specific steps if the selected dataType is "Excel" */}
        {dataType === "Excel" && (
          <div>
            <Steps current={currentExcelSteps} items={excelSteps} />
            <div>{excelSteps[currentExcelSteps].content}</div>
            <div style={{ marginTop: 24 }}>
              {currentExcelSteps < excelSteps.length - 1 && (
                <Button
                  type="primary"
                  onClick={() => setCurrentExcelSteps(currentExcelSteps + 1)}
                >
                  Next
                </Button>
              )}
              {currentExcelSteps === excelSteps.length - 1 && (
                <Button
                  type="primary"
                  onClick={() => message.success("Processing complete!")}
                >
                  Done
                </Button>
              )}
              {currentExcelSteps > 0 && (
                <Button
                  style={{ margin: "0 8px" }}
                  onClick={() => setCurrentExcelSteps(currentExcelSteps - 1)}
                >
                  Previous
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Optionally handle other data types like CSV, JSON, etc., in a similar way */}
        {dataType === "CSV" && (
          <div>
            {/* Add CSV-specific content here */}
            <h3>CSV Data Import</h3>
            {/* More content for CSV import */}
          </div>
        )}
        {dataType === "JSON" && (
          <div>
            {/* Add JSON-specific content here */}
            <h3>JSON Data Import</h3>
            {/* More content for JSON import */}
          </div>
        )}
        {dataType === "SQL" && (
          <div>
            {/* Add SQL-specific content here */}
            <h3>SQL Data Import</h3>
            {/* More content for SQL import */}
          </div>
        )}
        {dataType === "PostgreSQL" && (
          <div>
            {/* Add PostgreSQL-specific content here */}
            <h3>PostgreSQL Data Import</h3>
            {/* More content for PostgreSQL import */}
          </div>
        )}
        {dataType === "MySQL" && (
          <div>
            {/* Add MySQL-specific content here */}
            <h3>MySQL Data Import</h3>
            {/* More content for MySQL import */}
          </div>
        )}
      </div>
    </PerfectScrollBar>
  );
};

export default DataStudio;
