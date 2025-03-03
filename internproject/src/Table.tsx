import { useEffect, useState } from "react";
import axios from "axios";
import Moment from "moment";
import Navbar from "./Navbar";
import "./Table.css";
import translationsEn from "./assets/en.json";
import translationsJa from "./assets/ja.json";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Legend,
  Bar,
} from "recharts";
import { industries, columns, tableHeader } from "./assets/model/model";
import { useTranslation } from "./TranslationContext"; // Import the context

function Table() {
  const [company, setCompany] = useState([]);
  const [filteredCompany, setFilteredCompany] = useState([]);
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState<string>("7d");
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({
    key: "offerDate",
    ascending: false,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [previousClosePrice, setPreviousClosePrice] = useState<number | null>(
    null
  );
  const [lineColor, setLineColor] = useState("#2e3e8b");
  const [selectedRange, setSelectedRange] = useState("7d");
  const { language } = useTranslation();



  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedSymbol) {
      fetchChartData(selectedSymbol, timeRange);
    }
  }, [selectedSymbol, timeRange]);

  useEffect(() => {
    const filtered = searchTerm
      ? company.filter((item) =>
          item.symbol.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : company;
    setFilteredCompany(filtered);
  }, [searchTerm, company]);

  useEffect(() => {
    fetchStockData("7D");
  }, []);

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

  const fetchChartData = async (symbol: string, period: string) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8000/stockHistory/${symbol}?period=${period}`
      );
      setChartData(response.data);

      if (response.data && response.data.length >= 2) {
        const previousPrice = response.data[response.data.length - 2].close;
        setPreviousClosePrice(previousPrice);

        const currentPrice = response.data[response.data.length - 1].close;
        setLineColor(currentPrice > previousPrice ? "green" : "red");
      }
    } catch {
      console.log("Failed to fetch stock history");
      setChartData([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStockData = async (symbol: string, period: string) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8000/stockHistory/${symbol}?period=${period}`
      );
      setChartData(response.data);
    } catch (error) {
      console.error("Error fetching stock data", error);
    } finally {
      setLoading(false);
    }
  };

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

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
    setSelectedRange(range);
  };

  const currentColumn = columns.find((col) => col.key === sortConfig.key);

  const getIndustryTranslation = (industryID: number, language: string) => {
    const industry = industries[industryID];
    return industry ? industry[language] : "Unknown Industry";
  };

  const { translations } = useTranslation(); // Use the translations from context

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
          <div id="chart">
            {selectedSymbol && (
              <div style={{ marginTop: 25 }}>
                <div className="mainBgColor" style={{ height: "480px" }}>
                  <div>
                    <div>
                      <h3
                        style={{
                          paddingLeft: 10,
                          color: "#12216b",
                          paddingTop: 15,
                        }}
                      >
                        {" "}
                        {
                          filteredCompany.find(
                            (c) => c.symbol === selectedSymbol
                          )?.name
                        }{" "}
                        ({selectedSymbol})
                      </h3>
                    </div>
                    <div className="createTableLine"></div>
                    <div style={{ paddingLeft: 10 }}>
                      {previousClosePrice === null || chartData.length === 0 ? (
                        <div>
                          <p style={{ fontSize: "28px", fontWeight: "bold" }}>
                            Loading...
                          </p>
                        </div>
                      ) : (
                        selectedSymbol && (
                          <div>
                            <p>
                              <span
                                style={{
                                  fontSize: "28px",
                                  fontWeight: "bold",
                                }}
                              >
                                {previousClosePrice}
                              </span>
                              {previousClosePrice && chartData.length > 0 && (
                                <span
                                  style={{
                                    color:
                                      chartData[chartData.length - 1].close >
                                      previousClosePrice
                                        ? "green"
                                        : "red",
                                    fontSize: "24px",
                                    paddingLeft: 5,
                                    fontWeight: "bold",
                                  }}
                                >
                                  {chartData[chartData.length - 1].close >
                                  previousClosePrice
                                    ? "+" +
                                      (
                                        chartData[chartData.length - 1].close -
                                        previousClosePrice
                                      ).toFixed(2)
                                    : (
                                        chartData[chartData.length - 1].close -
                                        previousClosePrice
                                      ).toFixed(2)}
                                  &nbsp; (
                                  {(
                                    ((chartData[chartData.length - 1].close -
                                      previousClosePrice) /
                                      previousClosePrice) *
                                    100
                                  ).toFixed(2)}
                                  %)
                                </span>
                              )}
                              <br />
                              <span style={{ fontSize: 14 }}>
                                {translations["at_close_yesterday"]}
                              </span>
                            </p>
                          </div>
                        )
                      )}
                    </div>

                    <div style={{ paddingLeft: 10, marginTop: 10 }}>
                      <button
                        className="selectChartBtn"
                        onClick={() => handleTimeRangeChange("7D")}
                        style={{
                          backgroundColor:
                            selectedRange === "7D" ? "#2e3e8b" : "",
                          color: selectedRange === "7D" ? "white" : "",
                        }}
                      >
                        {translations["7D"]}
                      </button>
                      <button
                        className="selectChartBtn"
                        style={{
                          marginLeft: 5,
                          backgroundColor:
                            selectedRange === "1mo" ? "#2e3e8b" : "",
                          color: selectedRange === "1mo" ? "white" : "",
                        }}
                        onClick={() => handleTimeRangeChange("1mo")}
                      >
                        {translations["1M"]}
                      </button>
                      <button
                        className="selectChartBtn"
                        style={{
                          marginLeft: 5,
                          backgroundColor:
                            selectedRange === "6mo" ? "#2e3e8b" : "",
                          color: selectedRange === "6mo" ? "white" : "",
                        }}
                        onClick={() => handleTimeRangeChange("6mo")}
                      >
                        {translations["6M"]}
                      </button>
                    </div>
                    <div>
                      {loading ? (
                        <p style={{ textAlign: "center" }}>Loading...</p>
                      ) : chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={240}>
                          <AreaChart
                            data={chartData}
                            margin={{ top: 20, right: 20, left: 80 }}
                          >
                            <defs>
                              <linearGradient
                                id="colorClose"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                              >
                                <stop
                                  offset="0%"
                                  stopColor={lineColor}
                                  stopOpacity={0.5}
                                />
                                <stop
                                  offset="100%"
                                  stopColor={lineColor}
                                  stopOpacity={0}
                                />
                              </linearGradient>
                            </defs>

                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                              dataKey="date"
                              tickFormatter={(date, index) => {
                                const dateMoment = Moment(date, "YYYY/MM/DD");
                                const prevDate = chartData[index - 1]
                                  ? Moment(
                                      chartData[index - 1].date,
                                      "YYYY/MM/DD"
                                    )
                                  : null;

                                if (timeRange === "7d") {
                                  return dateMoment.format("M/DD");
                                }

                                if (timeRange === "1mo") {
                                  return dateMoment.date() <= 3
                                    ? dateMoment.format("MMM'YY")
                                    : dateMoment.format("DD");
                                }

                                if (timeRange === "6mo") {
                                  // Show year only in early January
                                  if (
                                    dateMoment.month() === 0 &&
                                    dateMoment.date() <= 2
                                  ) {
                                    return dateMoment.format("YYYY");
                                  }

                                  // Show month abbreviation only once per month
                                  if (
                                    !prevDate ||
                                    prevDate.month() !== dateMoment.month()
                                  ) {
                                    return dateMoment.format("MMM");
                                  }

                                  return "";
                                }

                                return dateMoment.format("M/DD");
                              }}
                              interval={0}
                            />

                            <YAxis
                              domain={["auto", "auto"]}
                              orientation="right"
                            />
                            <Tooltip
                              formatter={(value, name) =>
                                name === "close" ? `$${value}` : value
                              }
                              labelFormatter={(value) =>
                                `Date: ${Moment(value).format("YYYY/MM/DD")}`
                              }
                              contentStyle={{
                                backgroundColor: "transparent",
                                color: "black",
                              }}
                            />
                            <Area
                              type="monotone"
                              dataKey="close"
                              stroke={lineColor}
                              fillOpacity={1}
                              fill="url(#colorClose)"
                              dot={false}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      ) : (
                        <p style={{ textAlign: "center" }}>
                          No stock data available
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div id="2">
          <div className="setFilter">
            <span className="h2">
              {translations["sort_by"] || "Sort by"}:{" "}
              {currentColumn ? translations[currentColumn.labelKey] : "None"}
            </span>

            <a href="http://localhost:5173/compare" style={{}}>
              <button
                className="btn compareBtn"
                style={{ right: 140, position: "absolute" }}
              >
                {translations["compare"] || "Compare"}{" "}
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
                    style={{
                      backgroundColor: "white",
                      color: "#2e3e8b",
                      borderColor: "black",
                      borderRadius: "5px",
                      fontSize: "16px",
                    }}
                  >
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </select>
                  <label
                    style={{
                      paddingLeft: 10,
                      fontWeight: "bold",
                      color: "#12216b",
                    }}
                  >
                    {translations["entries_per_page"] || "Entries per page"}
                  </label>
                </div>
                <div className="" style={{ paddingLeft: 805 }}>
                  <div className="">
                    <label
                      style={{
                        paddingRight: 14,
                        fontWeight: "bold",
                        color: "#12216b",
                      }}
                    >
                      {translations["search"] || "Search"}:
                    </label>
                    <input
                      className="searchSymbol"
                      type="text"
                      value={searchTerm}
                      onChange={handleSearchChange}
                      placeholder={translations["enter_ticker"]}
                    />
                  </div>
                </div>
              </div>
              <div id="table" style={{ marginTop: 10, marginBottom: 10 }}>
                <div className="setTable">
                  <table className="table">
                    <colgroup>
                      <col data-dt-column="0" style={{ width: 350 }} />
                      <col data-dt-column="1" style={{ width: 110 }} />
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
                        {tableHeader.map(({ key, labelKey, type }) => (
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
                                {translations[labelKey] || labelKey}
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
                            {getIndustryTranslation(
                              data.industry.industryID,
                              language
                            )}
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

export default Table;
