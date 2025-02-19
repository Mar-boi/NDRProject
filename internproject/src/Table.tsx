import data from "./assets/data.json";
import Navbar from "./Navbar";
import "./Table.css";

function App() {
  return (
    <>
      <div style={{ justifyItems: "center" }}>
        <div className="setFilter" style={{marginLeft: 120}}>
          <span className="fs-4">
            Filtering by : (Press Company Header to filter)
          </span>
          <a href="http://localhost:5173/compare" style={{ paddingLeft: 575 }}>
          <button className="btn compareBtn">Compare</button>
          </a>
        </div>
        <div className="setTable">
          <table className="table">
            <thead className="headerColumn">
              <tr>
                <th>ID</th>
                <th>Company</th>
                <th>Symbol</th>
                <th>Industry</th>
                <th>Offer Date</th>
                <th>Shares (Millions)</th>
                <th>Offer Price</th>
                <th>1st Day Close</th>
                <th>Current Price</th>
                <th>Return</th>
              </tr>
            </thead>
            <tbody>
              {data.map((data) => {
                return (
                  <tr className="bodyColumn" key={data.compID}>
                    <td>{data.compID}</td>
                    <td className="celltextalignleft">
                      <a href={data.link}>{data.compName}</a>
                    </td>
                    <td className="celltextalignleft">{data.symbol}</td>
                    <td className="celltextalignleft">{data.industryID}</td>
                    <td>{data.offerDate}</td>
                    <td>{data.shares}</td>
                    <td>{data.offerPrice}</td>
                    <td>{data.firstClose}</td>
                    <td>{data.currentPrice}</td>
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
