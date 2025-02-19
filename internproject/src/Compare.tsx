
import "./Compare.css";
import React, { useEffect, useState } from "react";

const StockDataFetcher = () => {
  const [symbolA, setSymbolA] = useState("");
  const [symbolB, setSymbolB] = useState("");
  const [dataA, setDataA] = useState(null);
  const [dataB, setDataB] = useState(null);

  const formatNumber = (value: number) => {
    if (value >= 1_000_000_000_000) {
      return "$" + (value / 1_000_000_000_000).toFixed(1) + "T"; // Tillion
    } else if (value >= 1_000_000_000) {
      return "$" + (value / 1_000_000_000).toFixed(1) + "B"; // Billion
    } else if (value >= 1_000_000) {
      return "$" + (value / 1_000_000).toFixed(1) + "M"; // Million
    } else if (value >= 1_000) {
      return "$" + value.toString(); // Simply return as a string with thousands (e.g., 1000, 2500)
    } else {
      return "$" + value.toFixed(2); // For values less than 1000, return with 2 decimal places
    }
  };

  const handleInputChange1 = (event) => {
    setSymbolA(event.target.value);
  };

  const handleInputChange2 = (event) => {
    setSymbolB(event.target.value);
  };

  const fetchStockData = async () => {
    if (!symbolA || !symbolB) {
      alert("Please enter both tickers!");
      return;
    }

    try {
      // Fetch data for both tickers
      const getResponseA = await fetch(
        `http://localhost:8000/get_stock_data/${symbolA}`
      );
      const sentDataA = await getResponseA.json();
      setDataA(sentDataA); // Store data for ticker 1

      const getResponseB = await fetch(
        `http://localhost:8000/get_stock_data/${symbolB}`
      );
      const sentDataB = await getResponseB.json();
      setDataB(sentDataB); // Store data for ticker 2
    } catch (error) {
      console.error("Error fetching stock data:", error);
    }
  };

  return (
    <>
      <div className="setCompareBar">
        <div style={{ display: "flex" }}>
          <span className="fs-3" style={{ marginRight: 50 }}>
            Comparing
          </span>
          <input
            type="text"
            className="inputBox"
            placeholder="Enter Symbol"
            style={{ marginRight: 50 }}
            value={symbolA}
            onChange={handleInputChange1}
          />
          <span className="fs-3" style={{ marginRight: 50 }}>
            with
          </span>
          <input
            type="text"
            className="inputBox"
            placeholder="Enter Symbol"
            style={{ marginRight: 100 }}
            value={symbolB}
            onChange={handleInputChange2}
          />
          <button className="btn compareBtn" onClick={fetchStockData}>
            Compare
          </button>
        </div>
      </div>
      <div>
        {dataA && dataB && (
          <div>
            <div className="setDivTable">
              <table className="setCell">
                <thead>
                  <tr className="">
                    <th>As of {dataA.extracted_at}</th>
                    <th className="setcolright">{dataA.ticker}</th>
                    <th className="setcolright">{dataB.ticker}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Market Value</td>

                    <td className="setcolright ">
                      {formatNumber(dataA.marketcap)}
                    </td>
                    <td className="setcolright ">
                      {formatNumber(dataB.marketcap)}
                    </td>
                  </tr>
                  <tr>
                    <td>Enterprise Value</td>
                    <td className="setcolright ">
                      {formatNumber(dataA.enterprisevalue)}
                    </td>
                    <td className="setcolright">
                      {formatNumber(dataB.enterprisevalue)}
                    </td>
                  </tr>
                  <tr>
                    <td>Price to Earnings</td>
                    <td className="setcolright ">--</td>
                    <td className="setcolright">--</td>
                  </tr>
                  <tr>
                    <td>Sector</td>
                    <td className="setcolright">{dataA.sector}</td>
                    <td className="setcolright">{dataB.sector}</td>
                  </tr>
                  <tr>
                    <td>Industry</td>
                    <td className="setcolright ">{dataA.industry}</td>
                    <td className="setcolright">{dataB.industry}</td>
                  </tr>
                  <tr>
                    <td>CEO</td>
                    <td className="setcolright ">{dataA.ceo_name}</td>
                    <td className="setcolright">{dataB.ceo_name}</td>
                  </tr>
                </tbody>
              </table>
              <h2 style={{ paddingTop: 30 }}>Income Statement</h2>
              <table className="setCell">
                <thead>
                  <tr>
                    <th>As of {dataA.extracted_at}</th>
                    <td className="setcolright "></td>
                    <th className="setcolright"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Revenue</td>
                    <td className="setcolright ">{dataA.revenue}</td>
                    <td className="setcolright">{dataB.revenue}</td>
                  </tr>
                  <tr>
                    <td>Operating Expenses</td>

                    <td className="setcolright"></td>
                  </tr>
                  <tr>
                    <td>Operating Income</td>

                    <td className="setcolright"></td>
                  </tr>
                  <tr>
                    <td>Gross Profit</td>

                    <td className="setcolright"></td>
                  </tr>
                </tbody>
              </table>
              <h2 style={{ paddingTop: 30 }}>Balance Sheet</h2>
              <table className="setCell">
                <thead>
                  <tr>
                    <th>As of {dataA.extracted_at}</th>
                    <th className="setcolright"></th>
                    <th className="setcolright"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Inventory</td>
                    <td className="setcolright"></td>
                    <td className="setcolright"></td>
                  </tr>
                  <tr>
                    <td>Accounts Receivable Turnover</td>
                    <td className="setcolright"></td>
                    <td className="setcolright"></td>
                  </tr>
                </tbody>
              </table>
              <h2 style={{ paddingTop: 30 }}>Cash Flow</h2>
              <table className="setCell">
                <thead>
                  <tr>
                    <th>As of {dataA.extracted_at}</th>
                    <th className="setcolright"></th>
                    <th className="setcolright"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Cash Flow from Operations</td>
                    <td className="setcolright"></td>
                    <td className="setcolright"></td>
                  </tr>
                  <tr>
                    <td>Capital Expenditures</td>
                    <td className="setcolright"></td>
                    <td className="setcolright"></td>
                  </tr>
                  <tr>
                    <td>Cash Flow from Investing Activities</td>
                    <td className="setcolright"></td>
                    <td className="setcolright"></td>
                  </tr>
                  <tr>
                    <td>Free Cash Flow</td>
                    <td className="setcolright"></td>
                    <td className="setcolright"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default StockDataFetcher;
