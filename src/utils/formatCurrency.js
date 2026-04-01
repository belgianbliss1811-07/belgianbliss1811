/**
 * Rounds a number to exactly 2 decimal places to avoid JS floating point bugs.
 */
export const roundCurrency = (num) => {
  return Math.round((num + Number.EPSILON) * 100) / 100;
};

/**
 * Formats a number to Indian Rupees with proper grouping.
 */
export const formatCurrency = (amount) => {
  const rounded = roundCurrency(amount);
  return `₹${rounded.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};
