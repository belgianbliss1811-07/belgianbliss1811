import api from "./api";

export const getSummary = async () => {
  const res = await api.get("/reports/summary");
  return res.data;
};
