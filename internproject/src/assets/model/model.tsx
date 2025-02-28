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

export const days: { [key: number]: { en: string; ja: string } } = {
  0: {en: "Sun", ja : "日"},
  1: {en: "Mon", ja : "月"},
  2: {en: "Tue", ja : "火"},
  3: {en: "Wed", ja : "水"},
  4: {en: "Thu", ja : "木"},
  5: {en: "Fri", ja : "金"},
  6: {en: "Sat", ja : "土"}
};

// export const industries: { [key: number]: string } = {
//   1: "Basic Materials",
//   2: "Blank Check",
//   3: "Consumer Goods",
//   4: "Consumer Services",
//   5: "Financials",
//   6: "Health Care",
//   7: "Industrials",
//   8: "Oil & Gas",
//   9: "Other",
//   10: "Technology",
// };

export const industries: { [key: number]: { en: string; ja: string } } = {
  1: { en: "Basic Materials", ja: "素材" },
  2: { en: "Blank Check", ja: "ブランクチェック" },
  3: { en: "Consumer Goods", ja: "消費財" },
  4: { en: "Consumer Services", ja: "消費者向けサービス" },
  5: { en: "Financials", ja: "金融" },
  6: { en: "Health Care", ja: "ヘルスケア" },
  7: { en: "Industrials", ja: "産業" },
  8: { en: "Oil & Gas", ja: "石油・ガス" },
  9: { en: "Other", ja: "その他" },
  10: { en: "Technology", ja: "テクノロジー" },
};

export const columns = [
{ key: "name", labelKey: "company" },
{ key: "symbol", labelKey: "symbol" },
{ key: "industry.industryName", labelKey: "industry" },
{ key: "offerDate", labelKey: "offer_date" },
{ key: "shares", labelKey: "shares_millions" },
{ key: "offerPrice", labelKey: "offer_price" },
{ key: "firstClose", labelKey: "first_day_close" },
{ key: "currentPrice", labelKey: "current_price" },
{ key: "returnRate", labelKey: "return" },
];

export const tableHeader = [
{ key: "name", labelKey: "company", type: "text" },
{ key: "symbol", labelKey: "symbol", type: "text" },
{ key: "industry.industryName", labelKey: "industry", type: "text" },
{ key: "offerDate", labelKey: "offer_date", type: "date" },
{ key: "shares", labelKey: "shares_millions", type: "number" },
{ key: "offerPrice", labelKey: "offer_price", type: "number" },
{ key: "firstClose", labelKey: "first_day_close", type: "number" },
{ key: "currentPrice", labelKey: "current_price", type: "number" },
{ key: "returnRate", labelKey: "return", type: "number" },
];