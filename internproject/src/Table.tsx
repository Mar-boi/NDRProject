import { SetStateAction, useEffect, useState } from "react";
import axios from "axios";
import Moment from "moment";
import "./Table.css";
import importData from "./assets/sampleData.json";
import Japan from "./TableJP";
import US from "./TableUS";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { columns } from "./assets/model/model";
import { useTranslation } from "./assets/context/TranslationContext";
import { useSearch } from "./assets/context/SearchContext";
import { CompanyJP, CompanyUS } from "./assets/model/model";

interface CompanyData {
  companyUS: CompanyUS[];
  companyJP: CompanyJP[];
}

function Table() {
  const [company, setCompany] = useState<CompanyData>({
    companyUS: [],
    companyJP: [],
  });
  const [filteredCompany, setFilteredCompany] = useState<any>([]);
  const [selectedSymbol, setSelectedSymbol] = useState<string>("");
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [timeRange, setTimeRange] = useState<string>("7d");
  const { searchTerm, setSearchTerm } = useSearch();
  const [entriesPerPage, setEntriesPerPage] = useState<number>(10);
  const [sortConfig, setSortConfig] = useState({
    key: "offerDate",
    ascending: false,
  });
  const [previousClosePrice, setPreviousClosePrice] = useState<number | null>(
    null
  );
  const [lineColor, setLineColor] = useState("#2e3e8b");
  const [selectedRange, setSelectedRange] = useState("7d");
  const [isJP, setIsJP] = useState(false);
  const [market, setMarket] = useState<string>("");
  const { translations } = useTranslation();


  // Fetching data for the first time
  useEffect(() => {
    fetchData();
  }, []);

  // method for fetching data from DB
  const fetchData = async () => {
    // try {
    //   const response = await axios.get("http://localhost:8080/fetchIPO");
    //   setCompany(response.data);
    //   setFilteredCompany(response.data);
    // } catch {
    //   console.log("Fail to fetch");
    // }
    setCompany(importData);
    setFilteredCompany(importData.companyUS);
  };

    // Update filtered company on changing country I don't think this is needed becauses each table sets the filteredCompany to its data automatically where there is no search term
    // useEffect(() => {
    //   if (company.companyUS.length > 0 || company.companyJP.length > 0) {
    //     setFilteredCompany(isJP ? company.companyJP : company.companyUS);
    //   }
    // }, [isJP, company]);

  // Updating chart
  useEffect(() => {
    if (selectedSymbol) {
      fetchChartData();
    }
  }, [selectedSymbol, timeRange]);


  // Method for fetching chart
  const fetchChartData = async () => {
    setLoading(true);
    try {
      let marketSymbol = selectedSymbol;
      console.log("Market" + market);

      if (isJP) {
        // For Japanese stocks, append the appropriate suffix based on the symbol's first character
        if (market.startsWith("東")) {
          marketSymbol = `${selectedSymbol}.T`; // Tokyo Stock Exchange (TSE)
        } else if (market.startsWith("名")) {
          marketSymbol = `${selectedSymbol}.N`; // Nagoya Stock Exchange
        } else if (market.startsWith("札")) {
          marketSymbol = `${selectedSymbol}.S`; // Sapporo Stock Exchange
        } else if (market.startsWith("福")) {
          marketSymbol = `${selectedSymbol}.F`; // Fukuoka Stock Exchange
        }
      }

      // console.log(marketSymbol)

      const response = await axios.get(
        `http://localhost:8000/stockHistory/${marketSymbol}?period=${timeRange}`
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

  // const fetchStockData = async (symbol: string, period: string) => {
  //   setLoading(true);
  //   try {
  //     const response = await axios.get(
  //       `http://localhost:8000/stockHistory/${symbol}?period=${period}`
  //     );
  //     setChartData(response.data);
  //   } catch (error) {
  //     console.error("Error fetching stock data", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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

  const formatNumber = (value: number) => {
    if (value === null || value === undefined) return "-";

    const isNegative = value < 0;
    const positiveValue = Math.abs(value);
    let formattedValue = "";

    if (positiveValue >= 1_000_000_000_000) {
      formattedValue = (positiveValue / 1_000_000_000_000).toFixed(1) + "T";
    } else if (positiveValue >= 1_000_000_000) {
      formattedValue = (positiveValue / 1_000_000_000).toFixed(1) + "B";
    } else if (positiveValue >= 1_000_000) {
      formattedValue = (positiveValue / 1_000_000).toFixed(1) + "M";
    } else if (positiveValue >= 1_000) {
      formattedValue = (positiveValue / 1)
        .toFixed(0)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } else {
      formattedValue = positiveValue.toFixed();
    }

    const formatText = isNegative
      ? "$-" + formattedValue
      : "$" + formattedValue;

    return isJP ? formatText.replace("$", "￥") : formatText;
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
                        {/* Chart Title */}
                        {/* Find the name of a company whose symbol matches the selected one */}
                        {" "}
                        {
                          filteredCompany.find(
                            (c:CompanyJP|CompanyUS) => c.symbol === selectedSymbol
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
                                {formatNumber(previousClosePrice)}
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
                <div>
                  <button
                    className="btn switchTableBtn"
                    style={{ marginLeft: 10 }}
                    onClick={() => setIsJP(!isJP)}
                  >
                    {translations["switch_btn"]}
                    {": "}
                    {translations[isJP ? "jp" : "us"]}
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
                      setSelectedSymbol={setSelectedSymbol}
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
                      setSelectedSymbol={setSelectedSymbol}
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
