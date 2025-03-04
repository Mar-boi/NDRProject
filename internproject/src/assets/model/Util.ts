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
      .toFixed(0)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  } else {
    formattedValue = positiveValue.toFixed();
  }

  let formatText = isNegative ? "$-" + formattedValue : "$" + formattedValue;
  if(currency) {
    formatText = formatText.replace("$", currency);
  }
 
  return formatText;
};
