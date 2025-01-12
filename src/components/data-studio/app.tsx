import React, { useState } from "react";
import PerfectScrollBar from "react-perfect-scrollbar";

import "./styling/style.css";
import { DataTypesSection } from "./components/sections/datatypes-section";
import { ChooseStepSection } from "./components/sections/choose-step-section";
import { ViewDataSection } from "./components/sections/view-data-section";
import { ExcelSection } from "./components/data-type-section/excel-section";
import { CSVSection } from "./components/data-type-section/csv-section";
import { JSONSection } from "./components/data-type-section/json-section";

const DataStudio = () => {
  const [step, setStep] = useState<number>(0);
  const [fileData, setFileData] = useState<any[]>([]);
  const [sheetName, setSheetName] = useState<string>("");
  const [skipRows, setSkipRows] = useState<number>(0);
  const [dataType, setDataType] = useState<string>("");
  const [currentExcelSteps, setCurrentExcelSteps] = useState<number>(0);

  const handleOptionClick = (type: string) => {
    setDataType(type);
    setStep(3);
  };

  return (
    <PerfectScrollBar
      style={{
        zIndex: 100,
      }}
    >
      <div className="data-studio">
        {step === 0 && <ChooseStepSection setStep={setStep} />}
        {step === 1 && (
          <DataTypesSection handleOptionClick={handleOptionClick} />
        )}
        {step === 2 && <ViewDataSection setStep={setStep} />}

        {dataType === "Excel" && (
          <ExcelSection
            fileData={fileData}
            setSheetName={setSheetName}
            setSkipRows={setSkipRows}
            sheetName={sheetName}
            skipRows={skipRows}
            setFileData={setFileData}
            setCurrentExcelStep={setCurrentExcelSteps}
            currentExcelSteps={currentExcelSteps}
          />
        )}

        {dataType === "CSV" && <CSVSection />}
        {dataType === "JSON" && <JSONSection />}
        {dataType === "SQL" && (
          <div>
            <h3>SQL Data Import</h3>
          </div>
        )}
        {dataType === "PostgreSQL" && (
          <div>
            <h3>PostgreSQL Data Import</h3>
          </div>
        )}
        {dataType === "MySQL" && <h3>MySQL Data Import</h3>}
      </div>
    </PerfectScrollBar>
  );
};

export default DataStudio;
