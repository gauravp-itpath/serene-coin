export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export const formatLargeNumber = (value: number): string => {
  if (value >= 1e9) {
    return `$${(value / 1e9).toFixed(2)} B`;
  }
  if (value >= 1e6) {
    return `$${(value / 1e6).toFixed(2)} M`;
  }
  return formatCurrency(value);
};

export const formatVolumeNumber = (value: number): string => {
  if (value >= 1000000000) {
    return `${(value / 1000000000).toFixed(2)} B`; // Format as billions
  }

  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(2)} M`; // Format as millions
  }

  if (value >= 1000) {
    return `${(value / 1000).toFixed(2)} K`; // Format as thousands
  }

  return value.toString(); // Return the value as it is for smaller numbers
};
