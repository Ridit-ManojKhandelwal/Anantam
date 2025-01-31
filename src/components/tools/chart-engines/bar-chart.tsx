import React, { useState, useEffect } from "react";
import { Bar } from "@ant-design/charts";

export const BarChart = ({ data }: any) => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [xField, setXField] = useState<string | undefined>(undefined);
  const [yField, setYField] = useState<string | undefined>(undefined);

  // Function to load the data from the main process (Electron)
  const loadExcelData = async (filePath: string, skipRows: number) => {
    try {
      const jsonData = await window.electron.readExcelFile(filePath, skipRows);
      console.log(jsonData);
      if (jsonData.length > 0) {
        const columns = jsonData[0];
        setXField(columns[0]); // Assuming first column as xField
        setYField(columns[1]); // Assuming second column as yField

        // Convert the rest of the rows into objects with keys from the header
        const processedData = jsonData.slice(1).map((row: any) => {
          const rowData: any = {};
          row.forEach((value: any, index: number) => {
            rowData[columns[index]] = value;
          });
          return rowData;
        });

        setChartData(processedData); // Set the chart data
      }
    } catch (error) {
      console.error("Error loading Excel data:", error);
    }
  };

  useEffect(() => {
    if (data.path) {
      // Load the Excel file using the path and skip rows
      loadExcelData(data.path, data.skip_rows);
    }
  }, [data]);

  const config = {
    data: chartData,
    height: 400,
    xField: xField || "x", // Default to "x" if xField is not determined
    yField: yField || "y", // Default to "y" if yField is not determined
    theme: "dark",
  };

  return (
    <div className="bar-chart-container">
      <Bar {...config} />
    </div>
  );
};
