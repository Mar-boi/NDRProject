export type Company = {
    compID: number;
    name: string;
    symbol: string;
    industry: Industry;
    offerDate: Date;
    shares: number;
    offerPrice: number;
    firstClose: number;
    currentPrice: number;
    returnRate: number;
    compLink: string;
  }

export type Industry = {
    industryID: number;
    industryName: string;
  }

 export const days: { [key: number]: string } = {
    0: "Sun",
    1: "Mon",
    2: "Tue",
    3: "Wed",
    4: "Thu",
    5: "Fri",
    6: "Sat",
  };
  export const industries: { [key: number]: string } = {
    1: "Basic Materials",
    2: "Blank Check",
    3: "Consumer Goods",
    4: "Consumer Services",
    5: "Financials",
    6: "Health Care",
    7: "Industrials",
    8: "Oil & Gas",
    9: "Other",
    10: "Technology",
  };