import { SetStateAction, useEffect, useState } from "react";
import axios from "axios";
import Moment from "moment";
import "../styles/Table.css";
import importData from "../assets/sampleData.json";
import smaData from "../assets/stock_sma.json";
import Japan from "../components/TableJP";
import US from "../components/TableUS";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  ComposedChart,
} from "recharts";
import { columns, CompanyData } from "../assets/model/model";
import { useTranslation } from "../assets/context/TranslationContext";
import { useSearch } from "../assets/context/SearchContext";
import { formatDate, formatNumber } from "../assets/model/Util";

function Table() {
  const [company, setCompany] = useState<CompanyData>({
    companyUS: [],
    companyJP: [],
  });
  const [filteredCompany, setFilteredCompany] = useState<any>([]);
  const [selectedCompany, setSelectedCompany] = useState<any>([]);
  const [chartData, setChartData] = useState<any[]>([]); // too complex im cooming
  const [loading, setLoading] = useState<boolean>(false);
  const [timeRange, setTimeRange] = useState<string>("7d");
  const { searchTerm, setSearchTerm } = useSearch();
  const [entriesPerPage, setEntriesPerPage] = useState<number>(10);
  const [sortConfig, setSortConfig] = useState({
    key: "offerDate",
    type: "date",
    ascending: false,
  });
  const [previousClosePrice, setPreviousClosePrice] = useState<number | null>(
    null
  );
  const [lineColor, setLineColor] = useState("#2e3e8b");
  const [selectedRange, setSelectedRange] = useState("7d");
  const [isSMA10, setIsSMA10] = useState(true);
  const [isSMA20, setIsSMA20] = useState(true);
  const [isJP, setIsJP] = useState(false);
  const [market, setMarket] = useState<string>("");
  const { translations, language } = useTranslation();

  // Fetching data for the first time
  useEffect(() => {
    fetchData();
  }, []);

  // method for fetching data from DB
  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8080/fetchIPO");
      setCompany(response.data);
      setFilteredCompany(response.data.companyUS);
    } catch {
      alert("Fail to fetch");
      console.log("Fail to fetch");
    }

    // Using sample data
    // setCompany(importData);
    // setFilteredCompany(importData.companyUS);
  };

  // Updating chart
  useEffect(() => {
    if (selectedCompany.symbol) {
      fetchChartData();
      window.scrollTo(0, 0);
    }
  }, [selectedCompany, timeRange]);

  // Method for fetching chart
  const fetchChartData = async () => {
    setLoading(true);
    try {
      let querySymbol = selectedCompany.symbol;
      console.log("Market" + market);

      if (isJP) {
        // For Japanese stocks, append the appropriate suffix based on the symbol's first character
        if (market.startsWith("東")) {
          querySymbol = `${querySymbol}.T`; // Tokyo Stock Exchange (TSE)
        } else if (market.startsWith("名")) {
          querySymbol = `${querySymbol}.N`; // Nagoya Stock Exchange
        } else if (market.startsWith("札")) {
          querySymbol = `${querySymbol}.S`; // Sapporo Stock Exchange
        } else if (market.startsWith("福")) {
          querySymbol = `${querySymbol}.F`; // Fukuoka Stock Exchange
        }
      }

      const response = await axios.get(
        `http://localhost:8000/stockHistory/${querySymbol}?period=${timeRange}`
      );

      setChartData(response.data);
      //setChartData(smaData);

      if (response.data && response.data.length >= 2) {
        const previousPrice = response.data[response.data.length - 2].close;
        setPreviousClosePrice(previousPrice);

        const currentPrice = response.data[response.data.length - 1].close;
        setLineColor(currentPrice > previousPrice ? "green" : "red");
      }

      // if (smaData && smaData.length >= 2) {
      //   const previousPrice = smaData[smaData.length - 2].close;
      //   setPreviousClosePrice(previousPrice);

      //   const currentPrice = smaData[smaData.length - 1].close;
      //   setLineColor(currentPrice > previousPrice ? "green" : "red");
      // }
    } catch {
      console.log("Failed to fetch stock history");
      setChartData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setSearchTerm(e.target.value);
  };

  const handleTimeRangeChange = (range: SetStateAction<string>) => {
    setTimeRange(range);
    setSelectedRange(range);
  };

  const currentColumn = columns.find((col) => col.key === sortConfig.key);

  const closeChart = () => {
    setSelectedCompany([]);
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
          <div id="chart">
            {selectedCompany.symbol && (
              <div style={{ marginTop: 25 }}>
                <div className="mainBgColor" style={{ height: "480px" }}>
                  <div>
                    <div className="d-flex flex-row justify-content-between">
                      <h3
                        style={{
                          paddingLeft: 10,
                          color: "#12216b",
                          paddingTop: 15,
                        }}
                      >
                        {/* Chart Title */} {selectedCompany.name} (
                        {selectedCompany.symbol})
                      </h3>
                      <button
                        type="button"
                        className="btn-close p-4 text-center"
                        onClick={() => closeChart()}
                      ></button>
                    </div>
                    <div className="createTableLine"></div>
                    <div style={{ paddingLeft: 10 }}>
                      {previousClosePrice === null || chartData.length === 0 ? (
                        <div>
                          <p style={{ fontSize: "28px", fontWeight: "bold" }}>
                            {translations["loading2"]}
                          </p>
                        </div>
                      ) : (
                        selectedCompany && (
                          <div className="d-flex flex-column">
                            <p>
                              <div>
                                <span
                                  style={{
                                    fontSize: "28px",
                                    fontWeight: "bold",
                                  }}
                                >
                                  {formatNumber(
                                    previousClosePrice,
                                    selectedCompany.market ? "￥" : undefined
                                  )}
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
                                          chartData[chartData.length - 1]
                                            .close - previousClosePrice
                                        ).toFixed(2)
                                      : (
                                          chartData[chartData.length - 1]
                                            .close - previousClosePrice
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
                              </div>

                            
                              <span style={{ fontSize: 14 }}>
                                {translations["at_close_yesterday"]}
                              </span>

                              <br />
                            
                              <div className="form-switch">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  role="switch"
                                  checked={isSMA10}
                                  onChange={() => setIsSMA10(!isSMA10)}
                                  style={{
                                    backgroundColor: isSMA10
                                      ? "#caa034"
                                      : "white",
                                  }}
                                />
                                <label style={{ marginLeft: 10 }}>SMA 10</label>
                              </div>

                              <div className="form-switch">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  role="switch"
                                  checked={isSMA20}
                                  onChange={() => setIsSMA20(!isSMA20)}
                                />
                                <label style={{ marginLeft: 10 }}>SMA 20</label>
                              </div>

                             
                            </p>
                          </div>
                        )
                      )}
                    </div>

                    <div style={{ paddingLeft: 10, marginTop: 10 }}>
                      <button
                        className="selectChartBtn"
                        onClick={() => handleTimeRangeChange("7d")}
                        style={{
                          backgroundColor:
                            selectedRange === "7d" ? "#2e3e8b" : "",
                          color: selectedRange === "7d" ? "white" : "",
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
                        <p style={{ textAlign: "center" }}>
                          {translations["loading"]}
                        </p>
                      ) : chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={240}>
                          <ComposedChart
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

                                if (timeRange === "7d")
                                  return dateMoment.format("M/DD");
                                if (timeRange === "1mo")
                                  return dateMoment.date() <= 3
                                    ? dateMoment.format("MMM'YY")
                                    : dateMoment.format("DD");
                                if (timeRange === "6mo") {
                                  if (
                                    dateMoment.month() === 0 &&
                                    dateMoment.date() <= 2
                                  )
                                    return dateMoment.format("YYYY");
                                  if (
                                    !prevDate ||
                                    prevDate.month() !== dateMoment.month()
                                  )
                                    return dateMoment.format("MMM");
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
                                name === "close" || name === "SMA 20"
                                  ? formatNumber(
                                      +value,
                                      selectedCompany.market ? "￥" : undefined
                                    )
                                  : value
                              }
                              labelFormatter={(value) =>
                                `Date: ${formatDate(value, language)}`
                              }
                              contentStyle={{
                                backgroundColor: "transparent",
                                color: "black",
                              }}
                            />

                            {/* SMA 20 Line Chart */}
                            {isSMA10 &&
                              chartData.some(
                                (item) => item.sma_10 !== null
                              ) && (
                                <Line
                                  type="monotone"
                                  dataKey="sma_10"
                                  stroke="#caa034"
                                  strokeWidth={1}
                                  dot={false}
                                />
                              )}

                            {/* SMA 50 Line Chart */}
                            {isSMA20 &&
                              chartData.some(
                                (item) => item.sma_20 !== null
                              ) && (
                                <Line
                                  type="monotone"
                                  dataKey="sma_20"
                                  stroke="blue"
                                  strokeWidth={1}
                                  dot={false}
                                />
                              )}

                            {/* Closing Price Area Chart */}
                            <Area
                              type="monotone"
                              dataKey="close"
                              stroke={lineColor}
                              fillOpacity={1}
                              fill="url(#colorClose)"
                              dot={false}
                            />
                          </ComposedChart>
                        </ResponsiveContainer>
                      ) : (
                        <p style={{ textAlign: "center" }}>
                          {translations["no_stock_data"]}
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
                <div>
                  <button
                    className="btn switchTableBtn"
                    style={{ marginLeft: 10 }}
                    onClick={() => setIsJP(!isJP)}
                  >
                    {translations["switch_btn"]}
                    {": "}
                    {translations[!isJP ? "jp" : "us"]}
                  </button>
                </div>
                <div className="" style={{ paddingLeft: 600 }}>
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
                <div
                  className="setTable"
                  style={{ minHeight: 525, minWidth: 1260 }}
                >
                  {isJP ? (
                    <Japan
                      datas={company.companyJP}
                      entriesPerPage={entriesPerPage}
                      sortConfig={sortConfig}
                      setSortConfig={setSortConfig}
                      setSelectedCompany={setSelectedCompany}
                      setMarket={setMarket}
                      filteredCompany={filteredCompany}
                      setFilteredCompany={setFilteredCompany}
                    />
                  ) : (
                    <US
                      datas={company.companyUS}
                      entriesPerPage={entriesPerPage}
                      sortConfig={sortConfig}
                      setSortConfig={setSortConfig}
                      setSelectedCompany={setSelectedCompany}
                      filteredCompany={filteredCompany}
                      setFilteredCompany={setFilteredCompany}
                    />
                  )}
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
