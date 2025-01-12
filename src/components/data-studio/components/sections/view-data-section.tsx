import { ReactComponent as ExcelIcon } from "../../../../assets/svg/excel.svg";
import { ReactComponent as CSVIcon } from "../../../../assets/svg/csv.svg";
import { ReactComponent as SQLIcon } from "../../../..//assets/svg/sql.svg";
import { ReactComponent as PostGreSQLIcon } from "../../../../assets/svg/postgresql.svg";
import { ReactComponent as MySQLIcon } from "../../../../assets/svg/mysql.svg";
import { ReactComponent as JSONIcon } from "../../../../assets/svg/json.svg";

interface ViewDataSectionProps {
  setStep: (step: number) => void;
}

export const ViewDataSection = ({ setStep }: ViewDataSectionProps) => {
  return (
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
  );
};
