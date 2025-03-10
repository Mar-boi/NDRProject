import moment from "moment";
import { useTranslation } from "../context/TranslationContext";
import { Language } from "./model";

export const formatNumber = (value: number, currency?: string) => {
  if (value === null || value === undefined) return "-";

  const isNegative = value < 0;
  const positiveValue = Math.abs(value);
  let formattedValue = "";

  if (positiveValue >= 1_000_000_000_000) {
    formattedValue = (positiveValue / 1_000_000_000_000).toFixed(1) + "T";
  } else if (positiveValue >= 1_000_000_000) {
    formattedValue = (positiveValue / 1_000_000_000).toFixed(1) + "B";
  } else if (positiveValue >= 1_000_000) {
    formattedValue = (positiveValue / 1_000_000).toFixed(1) + "M";
  } else if (positiveValue >= 1_000) {
    formattedValue = (positiveValue / 1)
      .toFixed(2)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  } else {
    formattedValue = positiveValue.toFixed(2);
  }

  let formatText = isNegative ? "$-" + formattedValue : "$" + formattedValue;
  if (currency) {
    formatText = formatText.replace("$", currency);
  }

  return formatText;
};


 export const formatDate = (value: string, language: Language): string => {
    const fomateDateLanguage = language === "ja" ? "YYYY/MM/DD" : "DD/MM/YYYY";
    return moment(value).format(fomateDateLanguage);
  };
