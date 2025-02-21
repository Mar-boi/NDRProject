import "./Compare.css";
import React, { useEffect, useState } from "react";

const StockDataFetcher = () => {
  const [symbolA, setSymbolA] = useState("");
  const [symbolB, setSymbolB] = useState("");
  const [dataA, setDataA] = useState(null);
  const [dataB, setDataB] = useState(null);

  const formatNumber = (value: number) => {
    // Check if the value is negative and store the absolute value
    const isNegative = value < 0;
    const positiveValue = Math.abs(value);

    // Format the number as before, but maintain the negative sign if needed
    let formattedValue = "";

    if (positiveValue >= 1_000_000_000_000) {
      formattedValue = (positiveValue / 1_000_000_000_000).toFixed(1) + "T"; // Trillion
    } else if (positiveValue >= 1_000_000_000) {
      formattedValue = (positiveValue / 1_000_000_000).toFixed(1) + "B"; // Billion
    } else if (positiveValue >= 1_000_000) {
      formattedValue = (positiveValue / 1_000_000).toFixed(1) + "M"; // Million
    } else if (positiveValue >= 1_000) {
      formattedValue = (positiveValue / 1_000).toFixed(2); // Thousand
    } else {
      formattedValue = positiveValue.toFixed(2); // Less than a thousand
    }

    // If the value was negative, add the minus sign
    return isNegative ? "$-" + formattedValue : "$" + formattedValue;
  };

  const handleInputChange1 = (event: any) => {
    setSymbolA(event.target.value);
  };

  const handleInputChange2 = (event: any) => {
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

      {
        (dataA === null && dataB === null) && (
          <div className="setDivTable" style = {{display:"flex", justifyContent: "center", alignItems: "center", height: "30rem", border: "grey 2px solid", borderRadius: 30}}>
           Type in companies symbol to start comparing!
          </div>
        )
      }

      <div>
        {dataA && dataB && (
          <div>
            <div className="setDivTable">
              <table className="setCompareTable">
                <thead>
                  <tr>
                    <th>As of {dataA.extracted_at}</th>
                    <th className="setCompareCell">
                      {dataA.ticker} {dataA.longName}
                    </th>
                    <th className="setCompareCell ">
                      {dataB.ticker} {dataB.longName}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Market Value</td>
                    <td className="setCompareCell ">
                      {formatNumber(dataA.marketcap)}
                    </td>
                    <td className="setCompareCell ">
                      {formatNumber(dataB.marketcap)}
                    </td>
                  </tr>
                  <tr>
                    <td>Enterprise Value</td>
                    <td className="setCompareCell ">
                      {formatNumber(dataA.enterprisevalue)}
                    </td>
                    <td className="setCompareCell">
                      {formatNumber(dataB.enterprisevalue)}
                    </td>
                  </tr>
                  <tr>
                    <td>Price to Earnings</td>
                    <td className="setCompareCell ">--</td>
                    <td className="setCompareCell">--</td>
                  </tr>
                  <tr>
                    <td>Sector</td>
                    <td className="setCompareCell">{dataA.sector}</td>
                    <td className="setCompareCell">{dataB.sector}</td>
                  </tr>
                  <tr>
                    <td>Industry</td>
                    <td className="setCompareCell ">{dataA.industry}</td>
                    <td className="setCompareCell">{dataB.industry}</td>
                  </tr>
                  <tr>
                    <td>CEO</td>
                    <td className="setCompareCell ">{dataA.ceo_name}</td>
                    <td className="setCompareCell">{dataB.ceo_name}</td>
                  </tr>
                </tbody>
              </table>
              <h2 style={{ paddingTop: 30 }}>Income Statement</h2>
              <table className="setCompareTable">
                <thead>
                  <tr>
                    <th>As of {dataA.extracted_at}</th>
                    <th className="setCompareCell">
                      {dataA.ticker} {dataA.longName}
                    </th>
                    <th className="setCompareCell">
                      {dataB.ticker} {dataB.longName}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Revenue</td>
                    <td className="setCompareCell ">
                      {formatNumber(dataA.revenue)}
                    </td>
                    <td className="setCompareCell">
                      {formatNumber(dataB.revenue)}
                    </td>
                  </tr>
                  <tr>
                    <td>Operating Expenses</td>

                    <td className="setCompareCell">--</td>
                    <td className="setCompareCell">--</td>
                  </tr>
                  <tr>
                    <td>Operating Income</td>

                    <td className="setCompareCell">--</td>
                    <td className="setCompareCell">--</td>
                  </tr>
                  <tr>
                    <td>Gross Profit</td>
                    <td className="setCompareCell">
                      {formatNumber(dataA.grossProfits)}
                    </td>
                    <td className="setCompareCell">
                      {formatNumber(dataB.grossProfits)}
                    </td>
                  </tr>
                </tbody>
              </table>
              <h2 style={{ paddingTop: 30 }}>Balance Sheet</h2>
              <table className="setCompareTable">
                <thead>
                  <tr>
                    <th>As of {dataA.extracted_at}</th>
                    <th className="setCompareCell">
                      {dataA.ticker} {dataA.longName}
                    </th>
                    <th className="setCompareCell">
                      {dataB.ticker} {dataB.longName}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Inventory</td>
                    <td className="setCompareCell">{dataA.inventory}--</td>
                    <td className="setCompareCell">{dataB.inventory}--</td>
                  </tr>
                  <tr>
                    <td>Equity</td>
                    <td className="setCompareCell">--</td>
                    <td className="setCompareCell">--</td>
                  </tr>
                </tbody>
              </table>
              <h2 style={{ paddingTop: 30 }}>Cash Flow</h2>
              <table className="setCompareTable">
                <thead>
                  <tr>
                    <th>As of {dataA.extracted_at}</th>
                    <th className="setCompareCell">
                      {dataA.ticker} {dataA.longName}
                    </th>
                    <th className="setCompareCell">
                      {dataB.ticker} {dataB.longName}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Cash Flow from Operations</td>
                    <td className="setCompareCell">
                      {formatNumber(dataA.operatingCashflow)}
                    </td>
                    <td className="setCompareCell">
                      {formatNumber(dataB.operatingCashflow)}
                    </td>
                  </tr>
                  <tr>
                    <td>Capital Expenditures</td>
                    <td className="setCompareCell">--</td>
                    <td className="setCompareCell">--</td>
                  </tr>
                  <tr>
                    <td>Cash Flow from Investing Activities</td>
                    <td className="setCompareCell">--</td>
                    <td className="setCompareCell">--</td>
                  </tr>
                  <tr>
                    <td>Free Cash Flow</td>
                    <td className="setCompareCell">
                      {formatNumber(dataA.freeCashflow)}
                    </td>
                    <td className="setCompareCell">
                      {formatNumber(dataB.freeCashflow)}
                    </td>
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
