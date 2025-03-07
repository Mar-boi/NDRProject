import React, { SetStateAction, useEffect, useState, Dispatch, useMemo } from "react";
import Moment, { lang } from "moment";
import { useTranslation } from "../assets/context/TranslationContext";
import {
  CompanyUS,
  industries,
  Language,
  tableHeaderUS,
} from "../assets/model/model";
import { useSearch } from "../assets/context/SearchContext";
import { formatDate, formatNumber } from "../assets/model/Util";

interface TableUSProps {
  datas: CompanyUS[];
  entriesPerPage: number;
  sortConfig: any;
  setSortConfig: Dispatch<SetStateAction<any>>;
  setSelectedCompany: Dispatch<SetStateAction<any>>;
  filteredCompany: CompanyUS[];
  setFilteredCompany: Dispatch<SetStateAction<CompanyUS[]>>;
}

export default function TableUS({
  datas,
  entriesPerPage,
  sortConfig,
  setSortConfig,
  setSelectedCompany,
  filteredCompany,
  setFilteredCompany,
}: TableUSProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const { language, translations } = useTranslation();
  const { searchTerm } = useSearch();

  useEffect(() => {
    setFilteredCompany(datas || []);
  }, [datas]);




  ///////////////// CONSTRUCTION ZONE ////////////////////

  useEffect(() => {
    if (!datas.some((item) => item.hasOwnProperty(sortConfig.key))) {
      setSortConfig({
        key: "offerDate", // Reset to default column
        type: "date",
        ascending: false,
      });
    }
  }, [datas]);

  const filteredData = useMemo(() => {
    return searchTerm
      ? datas.filter((item) =>
          item.symbol.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : datas;
  }, [searchTerm, datas]);
  
  useEffect(() => {

    // Apply sorting to filtered data
    let { key, ascending, type } = sortConfig;
    console.log("header");
    const header = tableHeaderUS.find(item => item.key === key);
     
      if(header === undefined) { 
        key = "offerDate";
        ascending = false;
        type = "date";
      }

    const sortedData = [...filteredData].sort((a: Record<string, any>, b: Record<string, any>) => {
      
      let valA = key.includes(".")
        ? key.split(".").reduce((o: { [x: string]: any; }, i: string | number) => o[i], a)
        : a[key];
      let valB = key.includes(".")
        ? key.split(".").reduce((o: { [x: string]: any; }, i: string | number) => o[i], b)
        : b[key];
  
      if (type === "number") return ascending ? valA - valB : valB - valA;
      if (type === "text") return ascending ? valA.localeCompare(valB) : valB.localeCompare(valA);
      if (type === "date") return ascending ? new Date(valA).getTime() - new Date(valB).getTime() : new Date(valB).getTime() - new Date(valA).getTime();
  
      return 0;
    });
  
    setFilteredCompany(sortedData);
  }, [filteredData, sortConfig]); // Depend only on filtered data & sorting config
  
  const sortTable = (key: string, type: "number" | "text" | "date") => {
    const newAscending = sortConfig.key === key ? !sortConfig.ascending : true;
    setSortConfig({ key, type, ascending: newAscending });
  };
  
  
    ///////////////// CONSTRUCTION ZONE ////////////////////

  const totalPages = Math.ceil(filteredCompany.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const paginatedData = filteredCompany.slice(
    startIndex,
    startIndex + entriesPerPage
  );

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  useEffect(() => {
    if(currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [entriesPerPage])

  const getIndustryTranslation = (industryID: number, language: Language) => {
    const industry = industries[industryID];
    return industry ? industry[language] : "Unknown Industry";
  };

  return (
    <div>
      <div id="table" style={{ marginTop: 10, marginBottom: 10 }}>
        <div className="setTable" style={{ minHeight: 525, minWidth: 1260 }}>
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
                {tableHeaderUS.map(({ key, labelKey, type }) => (
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
                            sortConfig.key === key && sortConfig.ascending
                              ? "active"
                              : ""
                          }`}
                          style={{ marginBottom: "-2px" }} // Adjust spacing between ▲ and ▼
                        >
                          ▲
                        </span>
                        <span
                          className={`arrow ${
                            sortConfig.key === key && !sortConfig.ascending
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
                  onClick={() => setSelectedCompany(data)}
                  className="bodyColumn"
                >
                  <td className="celltextalignleft">
                    <a href={data.compLink}>{data.name}</a>
                  </td>
                  <td className="celltextalignleft">{data.symbol}</td>
                  <td className="celltextalignleft">
                    {getIndustryTranslation(data.industry.industryID, language)}
                  </td>
                  <td>{formatDate(data.offerDate, language)}</td>
                  <td>{data.shares}</td>
                  <td>{formatNumber(data.offerPrice)}</td>
                  <td>{formatNumber(data.firstClose)}</td>
                  <td>{formatNumber(data.currentPrice)}</td>
                  <td>{data.returnRate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div id="selectpage" style={{ marginTop: 10, marginBottom: 10 }}>
        <div className="setSelectPageBtn">
          <button onClick={() => goToPage(1)} disabled={currentPage === 1}>
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
  );
}
