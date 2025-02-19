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