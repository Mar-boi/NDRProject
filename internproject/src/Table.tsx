import { useEffect, useState } from "react";
import data from "./assets/data.json";
import Navbar from "./Navbar";
import "./Table.css";
import axios from "axios";
import { Company, Industry } from "./assets/model/model";
import Moment from "moment";

function App() {
  const [company, setCompany] = useState<Company[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const reponse = await axios.get("http://localhost:8080/fetchIPO");
      console.log(reponse);
      setCompany(reponse.data);
    } catch {
      console.log("Fail to fetch");
    }
  };

  const formatDate = (value: Date) => {
    Moment.locale("en");
    return Moment(value).format("yyyy/M/D");
  };

  const [sortConfig, setSortConfig] = useState({
    key: "compID",
    ascending: true,
  });

  const sortTable = (key, type) => {
    const newAscending = sortConfig.key === key ? !sortConfig.ascending : true;
    const sortedData = [...company].sort((a, b) => {
      let valA = key.includes(".")
        ? key.split(".").reduce((o, i) => o[i], a)
        : a[key];
      let valB = key.includes(".")
        ? key.split(".").reduce((o, i) => o[i], b)
        : b[key];

      if (type === "number") return newAscending ? valA - valB : valB - valA;
      if (type === "text")
        return newAscending
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      if (type === "date")
        return newAscending
          ? new Date(valA) - new Date(valB)
          : new Date(valB) - new Date(valA);
    });

    setCompany(sortedData);
    setSortConfig({ key, ascending: newAscending });
  };

  return (
    <>
      <div style={{ justifyItems: "center" }}>
        <div className="setFilter" style={{ marginLeft: 120 }}>
          <span className="fs-4">
            Sort by:{" "}
            {[
              { key: "compID", label: "ID" },
              { key: "name", label: "Company" },
              { key: "symbol", label: "Symbol" },
              { key: "industry.industryName", label: "Industry" },
              { key: "offerDate", label: "Offer Date" },
              { key: "shares", label: "Shares (Millions)" },
              { key: "offerPrice", label: "Offer Price" },
              { key: "firstClose", label: "1st Day Close" },
              { key: "currentPrice", label: "Current Price" },
              { key: "returnRate", label: "Return" },
            ].find((col) => col.key === sortConfig.key)?.label || "None"}
          </span>
          <a href="http://localhost:5173/compare">
            <button className="btn compareBtn" style={{right: 250, position: "absolute"}}>Compare</button>
          </a>
        </div>

        <div className="setTable">
          <table className="table">
            <thead className="headerColumn">
              <tr>
                {[
                  { key: "compID", label: "ID", type: "number" },
                  { key: "name", label: "Company", type: "text" },
                  { key: "symbol", label: "Symbol", type: "text" },
                  {
                    key: "industry.industryName",
                    label: "Industry",
                    type: "text",
                  },
                  { key: "offerDate", label: "Offer Date", type: "date" },
                  { key: "shares", label: "Shares (Millions)", type: "number" },
                  { key: "offerPrice", label: "Offer Price", type: "number" },
                  { key: "firstClose", label: "1st Day Close", type: "number" },
                  {
                    key: "currentPrice",
                    label: "Current Price",
                    type: "number",
                  },
                  { key: "returnRate", label: "Return", type: "number" },
                ].map(({ key, label, type }) => (
                  <th
                    key={key}
                    onClick={() => sortTable(key, type)}
                    className={sortConfig.key === key ? "active-sort" : ""}
                  >
                    {label}{" "}
                    {sortConfig.key === key
                      ? sortConfig.ascending
                        ? "▲"
                        : "▼"
                      : ""}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {company.map((data) => {
                return (
                  <tr className="bodyColumn" key={data.compID}>
                    <td>{data.compID}</td>
                    <td className="celltextalignleft">
                      <a href={data.compLink}>{data.name}</a>
                    </td>
                    <td className="celltextalignleft">{data.symbol}</td>
                    <td className="celltextalignleft">
                      {data.industry.industryName}
                    </td>
                    <td>{formatDate(data.offerDate)}</td>
                    <td>{data.shares}</td>
                    <td>${data.offerPrice}</td>
                    <td>${data.firstClose}</td>
                    <td>${data.currentPrice}</td>
                    <td>{data.returnRate}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default App;
