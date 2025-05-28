import { getLineByCode } from "./api/oasa_requests";
import { useState } from "react";

const Overlay = () => {
  const [lineNum, setLineNum] = useState("");

  const [lineInfo, setLineInfo] = useState({});
  const [lineCode, setLineCode] = useState("");
  const [lines, setLines] = useState([]);

  const getLines = async (e) => {
    e.preventDefault();
    if (lineNum) {
      const res = await getLineByCode(lineNum);
      setLines(res);
    }
  };

  return (
    <div
      style={{
        position: "absolute",
        width: "280px",
        height: "400px",
        background: "#ffffff",
        right: 20,
        bottom: 20,
        opacity: 0.9,
      }}
    >
      <form onSubmit={getLines}>
        <input value={lineNum} onChange={(e) => setLineNum(e.target.value)} />
        <button type="submit">Get lines</button>
        <br />
        {lines && lines.length && (
          <select
            value={lineInfo}
            onChange={(e) => {
              setLineInfo(e.target.value);
              setLineCode(lines.filter((elem) => elem.LineDescr === lineInfo)[0]);
            }}
            style={{ width: "100%" }}
          >
            {lines.map((itm) => {
              return (
                <option key={itm.LineDescr} value={itm.LineDescr}>
                  {itm.LineDescr}
                </option>
              );
            })}
          </select>
        )}
      </form>
      {/* LineCode: {lineCode} */}
    </div>
  );
};

export default Overlay;
