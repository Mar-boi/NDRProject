import data from "./assets/data.json";
import "./Table.css";

function App() {
  return (
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
                <td className="celltextalignleft"><a href={data.link}>{data.compName}</a></td>
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
  );
}

export default App;
