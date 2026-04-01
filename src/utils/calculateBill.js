import { roundCurrency } from "./formatCurrency";

export const calculateBill = (items) => {
  const total = items.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0
  );
  return roundCurrency(total);
};
