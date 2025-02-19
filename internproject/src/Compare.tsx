import Navbar from "./Navbar";
import "./Compare.css";
import React, { useEffect, useState } from "react";
import data from "./assets/comparedate.json";

function Compare() {
  const [newDate, setNewDate] = useState("");
  useEffect(() => {
    let todayDate = new Date(),
      month = "" + (todayDate.getUTCMonth() + 1),
      day = "" + (todayDate.getUTCDay() + 16),
      year = todayDate.getUTCFullYear(),
      hours = todayDate.getHours(),
      minutes = todayDate.getMinutes(),
      seconds = todayDate.getSeconds();
    if (day.length < 2) {
      day = "0" + day;
    }
    if (month.length < 2) {
      month = "0" + month;
    }
    console.log(month, day, year);
    setNewDate([month, day, year].join("-"));
  }, []);
  return (
    <>
      <Navbar />
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
          />
          <span className="fs-3" style={{ marginRight: 50 }}>
            with
          </span>
          <input type="text" className="inputBox" placeholder="Enter Symbol" style={{ marginRight: 100 }}/>
          <button className="btn compareBtn">Compare</button>
        </div>
      </div>
      <div className="setDivTable">
        <table className="setCell">
          <thead>
            <tr className="">
              <th>As of {newDate}</th>
              {data.map((data) => {
                return (
                  <>
                    <th className="setcolright">
                      {data.symbol + " " + data.compName}
                    </th>
                  </>
                );
              })}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Market Value</td>
              {data.map((data) => {
                return (
                  <>
                    <td className="setcolright ">{data.marketValue + "M"}</td>
                  </>
                );
              })}
            </tr>
            <tr>
              <td>Enterprise Value</td>
              {data.map((data) => {
                return (
                  <>
                    <td className="setcolright">
                      {data.enterpriseValue + "M"}
                    </td>
                  </>
                );
              })}
            </tr>
            <tr>
              <td>Price to Earnings</td>
              {data.map((data) => {
                return (
                  <>
                    <td className="setcolright">{data.priceToEearnings}</td>
                  </>
                );
              })}
            </tr>
            <tr>
              <td>Sector</td>
              {data.map((data) => {
                return (
                  <>
                    <td className="setcolright">{data.sector}</td>
                  </>
                );
              })}
            </tr>
            <tr>
              <td>Industry</td>
              {data.map((data) => {
                return (
                  <>
                    <td className="setcolright">{data.industry}</td>
                  </>
                );
              })}
            </tr>
            <tr>
              <td>CEO</td>
              {data.map((data) => {
                return (
                  <>
                    <td className="setcolright">{data.ceo}</td>
                  </>
                );
              })}
            </tr>
          </tbody>
        </table>
        <h2 style={{paddingTop: 30}}>Income Statement</h2>
        <table className="setCell">
          <thead>
            <tr>
              <th>As of {newDate}</th>
              {data.map((data) => {
                return (
                  <>
                    <th className="setcolright">
                      {data.symbol + " " + data.compName}
                    </th>
                  </>
                );
              })}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Revenue</td>
              {data.map((data) => {
                return (
                  <>
                    <td className="setcolright">{data.test}</td>
                  </>
                );
              })}
            </tr>
            <tr>
              <td>Operating Expenses</td>
              {data.map((data) => {
                return (
                  <>
                    <td className="setcolright">{data.test}</td>
                  </>
                );
              })}
            </tr>
            <tr>
              <td>Operating Income</td>
              {data.map((data) => {
                return (
                  <>
                    <td className="setcolright">{data.test}</td>
                  </>
                );
              })}
            </tr>
            <tr>
              <td>Gross Profit</td>
              {data.map((data) => {
                return (
                  <>
                    <td className="setcolright">{data.test}</td>
                  </>
                );
              })}
            </tr>
          </tbody>
        </table>
        <h2 style={{paddingTop: 30}}>Balance Sheet</h2>
        <table className="setCell">
          <thead>
            <tr>
              <th>As of {newDate}</th>
              <th className="setcolright">AZI Autozi Internet Tech</th>
              <th className="setcolright">PTHL Photon Hodings Ltd.</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Inventory</td>
              <td className="setcolright">3.27M</td>
              <td className="setcolright">--</td>
            </tr>
            <tr>
              <td>Accounts Receivable Turnover</td>
              <td className="setcolright">454.42</td>
              <td className="setcolright">--</td>
            </tr>
          </tbody>
        </table>
        <h2 style={{paddingTop: 30}}>Cash Flow</h2>
        <table className="setCell">
          <thead>
            <tr>
              <th>As of {newDate}</th>
              <th className="setcolright">AZI Autozi Internet Tech</th>
              <th className="setcolright">PTHL Photon Hodings Ltd.</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Cash Flow from Operations</td>
              <td className="setcolright">99.81M</td>
              <td className="setcolright">57.79M</td>
            </tr>
            <tr>
              <td>Capital Expenditures</td>
              <td className="setcolright">86.77M</td>
              <td className="setcolright">39.26M</td>
            </tr>
            <tr>
              <td>Cash Flow from Investing Activities</td>
              <td className="setcolright">2.25</td>
              <td className="setcolright">--</td>
            </tr>
            <tr>
              <td>Free Cash Flow</td>
              <td className="setcolright">Consumer Cyclical</td>
              <td className="setcolright">Medical Devices</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Compare;
