import "../styles/Compare.css";
import React, { useEffect, useState } from "react";
import { useTranslation } from "../assets/context/TranslationContext";
import { formatNumber } from "../assets/model/Util";

const Compare = () => {
  const [symbolA, setSymbolA] = useState("");
  const [symbolB, setSymbolB] = useState("");
  const [dataA, setDataA] = useState<any>(null);
  const [dataB, setDataB] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { translations } = useTranslation();

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"success" | "danger" | "warning">(
    "success"
  );

  const formatString = (value: string) => (value === null ? "N/A" : value);


  const handleInputChange1 = (event: any) => {
    setSymbolA(event.target.value);
  };

  const handleInputChange2 = (event: any) => {
    setSymbolB(event.target.value);
  };

  const handleKeyDown = (event: any) => {
    if (event.key === "Enter") {
      fetchStockData();
    }
  };

  const fetchStockData = async () => {
    if (!symbolA || !symbolB) {
      showAlert("Please enter both ticker!", "danger");
      return;
    }

    // Reset the data immediately to hide the previous comparison
    setDataA(null);
    setDataB(null);

    // Then set loading state to show loading spinner or message
    setLoading(true);
    setError("");

    try {
      const getResponseA = await fetch(
        `http://localhost:8000/get_stock_data/${symbolA}`
      );
      if (!getResponseA.ok) {
        throw new Error("Failed to fetch data for Symbol A");
      }
      const sentDataA = await getResponseA.json();
      setDataA(sentDataA);

      const getResponseB = await fetch(
        `http://localhost:8000/get_stock_data/${symbolB}`
      );
      if (!getResponseB.ok) {
        throw new Error("Failed to fetch data for Symbol B");
      }
      const sentDataB = await getResponseB.json();
      setDataB(sentDataB);
    } catch (error) {
      console.error("Error fetching stock data:", error);
      setError(translations["error_fetch_stock_data"]);
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (
    message: string,
    type: "success" | "danger" | "warning"
  ) => {
    setAlertMessage(message);
    setAlertType(type);
    setAlertVisible(false); // Reset visibility to allow re-trigger
    setTimeout(() => setAlertVisible(true), 10); // Small delay to re-trigger Bootstrap's animation
  };

  return (
    <>
      {/* alert message  */}
      <div
        className="position-fixed bottom-0 end-0 p-3"
        style={{ zIndex: 1050 }}
      >
        {alertVisible && (
          <div
            className={`alert alert-${alertType} alert-dismissible fade show`}
            role="alert"
          >
            <button
              type="button"
              className="btn-close"
              onClick={() => setAlertVisible(false)} // Correctly update state on dismiss
            ></button>
            {alertMessage}
          </div>
        )}
      </div>

      <div style={{ paddingBottom: 50 }}>
        <div className="setCompareBar">
          <div style={{ display: "flex" }}>
            <span
              className="fs-3"
              style={{ marginRight: 50, fontWeight: "bold", color: "#12216b" }}
            >
              {translations["comparing"]}
            </span>
            <input
              type="text"
              className="inputBox"
              placeholder={translations["enter_code"]}
              style={{ marginRight: 50 }}
              value={symbolA}
              onChange={handleInputChange1}
              onKeyDown={handleKeyDown}
            />
            <span
              className="fs-3"
              style={{ marginRight: 50, fontWeight: "bold", color: "#12216b" }}
            >
              {translations["with"]}
            </span>
            <input
              type="text"
              className="inputBox"
              placeholder={translations["enter_code"]}
              style={{ marginRight: 100 }}
              value={symbolB}
              onChange={handleInputChange2}
              onKeyDown={handleKeyDown}
            />
            <button className="btn compareBtn" onClick={fetchStockData}>
              {translations["compare"]}
            </button>
          </div>
        </div>
        {loading && (
          <div
            className="setDivBeforeCompare"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {translations["loading"]}
          </div>
        )}

        {error && (
          <div
            className="setDivBeforeCompare"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "red",
            }}
          >
            {error}
          </div>
        )}
        {dataA === null && dataB === null && !loading && (
          <div
            className="setDivBeforeCompare"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {translations["type_in_companies_info"]}
          </div>
        )}

        <div>
          {dataA && dataB && (
            <div>
              <div className="setDivTable">
                <table className="setCompareTable">
                  <thead>
                    <tr>
                      <th>
                        {translations["as_of_date"]} {dataA.extracted_at}
                      </th>
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
                      <td>{translations["market_value"]}</td>
                      <td className="setCompareCell ">
                        {formatNumber(dataA.marketcap)}
                      </td>
                      <td className="setCompareCell ">
                        {formatNumber(dataB.marketcap)}
                      </td>
                    </tr>
                    <tr>
                      <td>{translations["enterprise_value"]}</td>
                      <td className="setCompareCell ">
                        {formatNumber(dataA.enterprisevalue)}
                      </td>
                      <td className="setCompareCell">
                        {formatNumber(dataB.enterprisevalue)}
                      </td>
                    </tr>
                    <tr>
                      <td>{translations["price_to_earnings"]}</td>
                      <td className="setCompareCell ">
                        {formatNumber(dataA.priceEpsCurrentYear)}
                      </td>
                      <td className="setCompareCell">
                        {formatNumber(dataB.priceEpsCurrentYear)}
                      </td>
                    </tr>
                    <tr>
                      <td>{translations["sector"]}</td>
                      <td className="setCompareCell">{dataA.sector}</td>
                      <td className="setCompareCell">{dataB.sector}</td>
                    </tr>
                    <tr>
                      <td>{translations["industry_td"]}</td>
                      <td className="setCompareCell ">{dataA.industry}</td>
                      <td className="setCompareCell">{dataB.industry}</td>
                    </tr>
                    <tr>
                      <td>{translations["ceo"]}</td>
                      <td className="setCompareCell ">
                        {formatString(dataA.ceo_name)}
                      </td>
                      <td className="setCompareCell">
                        {formatString(dataB.ceo_name)}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <h2 style={{ paddingTop: 30, color: "#2e3e8b" }}>
                  {translations["income_statement"]}
                </h2>
                <table className="setCompareTable">
                  <thead>
                    <tr>
                      <th>
                        {translations["as_of_date"]} {dataA.extracted_at}
                      </th>
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
                      <td>{translations["revenue"]}</td>
                      <td className="setCompareCell ">
                        {formatNumber(dataA.revenue)}
                      </td>
                      <td className="setCompareCell">
                        {formatNumber(dataB.revenue)}
                      </td>
                    </tr>
                    <tr>
                      <td>{translations["gross_profit"]}</td>

                      <td className="setCompareCell">
                        {formatNumber(dataA.grossProfits)}
                      </td>
                      <td className="setCompareCell">
                        {formatNumber(dataB.grossProfits)}
                      </td>
                    </tr>
                    <tr>
                      <td>{translations["operating_expenses"]}</td>

                      <td className="setCompareCell">
                        {formatNumber(dataA.operatingExpense)}
                      </td>
                      <td className="setCompareCell">
                        {formatNumber(dataB.operatingExpense)}
                      </td>
                    </tr>
                    <tr>
                      <td>{translations["operating_income"]}</td>
                      <td className="setCompareCell">
                        {formatNumber(dataA.operatingIncome)}
                      </td>
                      <td className="setCompareCell">
                        {formatNumber(dataB.operatingIncome)}
                      </td>
                    </tr>
                    <tr>
                      <td>{translations["net_income"]}</td>
                      <td className="setCompareCell">
                        {formatNumber(dataA.netIncome)}
                      </td>
                      <td className="setCompareCell">
                        {formatNumber(dataB.netIncome)}
                      </td>
                    </tr>
                    <tr>
                      <td>{translations["net_income_margin"]}</td>
                      <td className="setCompareCell">
                        {(formatNumber(dataA.netIncomeMargin,"-"))}%
                      </td>
                      <td className="setCompareCell">
                        {(formatNumber(dataB.netIncomeMargin,"-"))}%
                      </td>
                    </tr>
                  </tbody>
                </table>
                <h2 style={{ paddingTop: 30, color: "#2e3e8b" }}>
                  {translations["balance_sheet"]}
                </h2>
                <table className="setCompareTable">
                  <thead>
                    <tr>
                      <th>
                        {translations["as_of_date"]} {dataA.extracted_at}
                      </th>
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
                      <td>{translations["inventory"]}</td>
                      <td className="setCompareCell">
                        {formatNumber(dataA.inventory)}
                      </td>
                      <td className="setCompareCell">
                        {formatNumber(dataB.inventory)}
                      </td>
                    </tr>
                    <tr>
                      <td>{translations["total_assets"]}</td>
                      <td className="setCompareCell">
                        {formatNumber(dataA.totalAssets)}
                      </td>
                      <td className="setCompareCell">
                        {formatNumber(dataB.totalAssets)}
                      </td>
                    </tr>
                    <tr>
                      <td>{translations["total_liabilities"]}</td>
                      <td className="setCompareCell">
                        {formatNumber(dataA.totalLiabilities)}
                      </td>
                      <td className="setCompareCell">
                        {formatNumber(dataB.totalLiabilities)}
                      </td>
                    </tr>
                    <tr>
                      <td>{translations["equity"]}</td>
                      <td className="setCompareCell">
                        {formatNumber(dataA.stakeholdersEquity)}
                      </td>
                      <td className="setCompareCell">
                        {formatNumber(dataB.stakeholdersEquity)}
                      </td>
                    </tr>
                    <tr>
                      <td>{translations["deb_to_equity"]}</td>
                      <td className="setCompareCell">
                        {(formatNumber(dataA.debToEquity, "-"))}
                      </td>
                      <td className="setCompareCell">
                        {(formatNumber(dataB.debToEquity, "-"))}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <h2 style={{ paddingTop: 30, color: "#2e3e8b" }}>
                  {translations["cash_flow"]}
                </h2>
                <table className="setCompareTable">
                  <thead>
                    <tr>
                      <th>
                        {translations["as_of_date"]} {dataA.extracted_at}
                      </th>
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
                      <td>{translations["cash_flow_operations"]}</td>
                      <td className="setCompareCell">
                        {formatNumber(dataA.operatingCashflow)}
                      </td>
                      <td className="setCompareCell">
                        {formatNumber(dataB.operatingCashflow)}
                      </td>
                    </tr>
                    <tr>
                      <td>{translations["cash_flow_financing"]}</td>
                      <td className="setCompareCell">
                        {formatNumber(dataA.financingCashflow)}
                      </td>
                      <td className="setCompareCell">
                        {formatNumber(dataB.financingCashflow)}
                      </td>
                    </tr>
                    <tr>
                      <td>{translations["cash_flow_investing"]}</td>
                      <td className="setCompareCell">
                        {formatNumber(dataA.investingCashflow)}
                      </td>
                      <td className="setCompareCell">
                        {formatNumber(dataB.investingCashflow)}
                      </td>
                    </tr>
                    <tr>
                      <td>{translations["free_cash_flow"]}</td>
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
      </div>
    </>
  );
};

export default Compare;
