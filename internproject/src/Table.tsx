import { useEffect, useState } from "react";
import axios from "axios";
import Moment from "moment";
import Navbar from "./Navbar";
import "./Table.css";
import {
  ResponsiveContainer,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Line,
  Area,
} from "recharts";

function App() {
  const [company, setCompany] = useState([]);
  const [filteredCompany, setFilteredCompany] = useState([]);
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({
    key: "offerDate",
    ascending: false,
  });
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedSymbol) {
      fetchChartData(selectedSymbol);
    }
  }, [selectedSymbol]);

  useEffect(() => {
    const filtered = searchTerm
      ? company.filter((item) =>
          item.symbol.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : company;
    setFilteredCompany(filtered);
  }, [searchTerm, company]);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8080/fetchIPO");
      setCompany(response.data);
      setFilteredCompany(response.data);
    } catch {
      console.log("Fail to fetch");
    }
  };

  const formatDate = (value: string) => {
    return Moment(value).format("yyyy/MM/DD");
  };

  const fetchChartData = async (symbol: string) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8000/stockHistory/${symbol}`
      );
      setChartData(response.data);
    } catch {
      console.log("Failed to fetch stock history");
      setChartData([]);
    } finally {
      setLoading(false);
    }
  };

  const sortTable = (key, type) => {
    const newAscending = sortConfig.key === key ? !sortConfig.ascending : true;

    // Sort the company data, not filteredCompany, to retain sorting across search terms
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

    const sortedFilteredData = [...filteredCompany].sort((a, b) => {
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

    setFilteredCompany(sortedFilteredData);
  };

  const totalPages = Math.ceil(filteredCompany.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const paginatedData = filteredCompany.slice(
    startIndex,
    startIndex + entriesPerPage
  );

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <>
      <div
        id="main"
        style={{
          marginLeft: 200,
          marginRight: 200,
          paddingBottom: 50,
          paddingLeft: 10,
          paddingRight: 10,
        }}
      >
        <div id="1">
          <div>
            {selectedSymbol && (
              <div style={{ marginTop: "50px" }}>
                <h2 style={{ textAlign: "center" }}>
                  {"Stock price of "}
                  {
                    filteredCompany.find((c) => c.symbol === selectedSymbol)
                      ?.name
                  }{" "}
                  ({selectedSymbol})
                </h2>

                <div className="mainBgColor" style={{ height: "350px" }}>
                  {loading ? (
                    <p style={{ textAlign: "center" }}>Loading...</p>
                  ) : chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart
                        data={chartData}
                        margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" tickFormatter={formatDate} />
                        <YAxis domain={["auto", "auto"]} />
                        <Tooltip />
                        <Area
                          type="monotone"
                          dataKey="close"
                          stroke="#007bff"
                          fill="#007bff30"
                        />
                        <Line
                          type="monotone"
                          dataKey="close"
                          stroke="#2e3e8b"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <p style={{ textAlign: "center" }}>
                      No stock data available
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <div id="2">
          <div className="setFilter">
            <span className="h2">
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
            <a href="http://localhost:5173/compare" style={{}}>
              <button
                className="btn compareBtn"
                style={{ right: 140, position: "absolute" }}
              >
                Compare
              </button>
            </a>
          </div>
        </div>
        <div id="3" className="mainBgColor">
          <div id="3-1" style={{ padding: 20 }}>
            <div id="main-3">
              <div id="page-search" style={{ marginTop: 10, display: "flex" }}>
                <div>
                  <select
                    value={entriesPerPage}
                    onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                  >
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </select>
                  <label style={{ paddingLeft: 10, fontWeight: "bold" }}>
                    Entries per page
                  </label>
                </div>
                <div className="" style={{ paddingLeft: 835 }}>
                  <div className="">
                    <label style={{ paddingRight: 14, fontWeight: "bold" }}>
                      Search:
                    </label>
                    <input
                      className="searchSymbol"
                      type="text"
                      value={searchTerm}
                      onChange={handleSearchChange}
                      placeholder="Please Enter Ticker"
                    />
                  </div>
                </div>
              </div>
              <div id="table" style={{ marginTop: 10, marginBottom: 10 }}>
                <div className="setTable">
                  <table className="table">
                    <colgroup>
                      <col data-dt-column="0" style={{ width: 350 }} />
                      <col data-dt-column="1" style={{ width: 90 }} />
                      <col data-dt-column="2" style={{ width: 100 }} />
                      <col data-dt-column="3" style={{ width: 120 }} />
                      <col data-dt-column="4" style={{ width: 100 }} />
                      <col data-dt-column="5" style={{ width: 135 }} />
                      <col data-dt-column="6" style={{ width: 150 }} />
                      <col data-dt-column="7" style={{ width: 130 }} />
                      <col data-dt-column="8" style={{ width: 100 }} />
                    </colgroup>
                    <thead className="headerColumn">
                      <tr>
                        {[
                          { key: "name", label: "Company", type: "text" },
                          { key: "symbol", label: "Symbol", type: "text" },
                          {
                            key: "industry.industryName",
                            label: "Industry",
                            type: "text",
                          },
                          {
                            key: "offerDate",
                            label: "Offer Date",
                            type: "date",
                          },
                          {
                            key: "shares",
                            label: "Shares (Millions)",
                            type: "number",
                          },
                          {
                            key: "offerPrice",
                            label: "Offer Price",
                            type: "number",
                          },
                          {
                            key: "firstClose",
                            label: "1st Day Close",
                            type: "number",
                          },
                          {
                            key: "currentPrice",
                            label: "Current Price",
                            type: "number",
                          },
                          {
                            key: "returnRate",
                            label: "Return",
                            type: "number",
                          },
                        ].map(({ key, label, type }) => (
                          <th
                            key={key}
                            onClick={() => sortTable(key, type)}
                            className={sortConfig.key === key ? "sorted" : ""}
                            style={{
                              textAlign: "center",
                              verticalAlign: "middle",
                              position: "relative",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: "100%",
                              }}
                            >
                              <span style={{ flex: 1, textAlign: "center" }}>
                                {label}
                              </span>
                              <span
                                className="arrows"
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                  marginLeft: 8, // Space between text and arrows
                                }}
                              >
                                <span
                                  className={`arrow ${
                                    sortConfig.key === key &&
                                    sortConfig.ascending
                                      ? "active"
                                      : ""
                                  }`}
                                  style={{ marginBottom: "-2px" }} // Adjust spacing between ▲ and ▼
                                >
                                  ▲
                                </span>
                                <span
                                  className={`arrow ${
                                    sortConfig.key === key &&
                                    !sortConfig.ascending
                                      ? "active"
                                      : ""
                                  }`}
                                  style={{ marginTop: "-2px" }} // Adjust spacing between ▲ and ▼
                                >
                                  ▼
                                </span>
                              </span>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedData.map((data) => (
                        <tr
                          key={data.symbol}
                          onClick={() => setSelectedSymbol(data.symbol)}
                          className="bodyColumn"
                        >
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
                          <td>{data.returnRate}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div id="selectpage" style={{ marginTop: 10, marginBottom: 10 }}>
                <div className="setSelectPageBtn">
                  <button
                    onClick={() => goToPage(1)}
                    disabled={currentPage === 1}
                  >
                    «
                  </button>
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    ‹
                  </button>
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToPage(index + 1)}
                      className={currentPage === index + 1 ? "active" : ""}
                    >
                      {index + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    ›
                  </button>
                  <button
                    onClick={() => goToPage(totalPages)}
                    disabled={currentPage === totalPages}
                  >
                    »
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
