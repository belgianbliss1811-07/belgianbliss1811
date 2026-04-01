import api from "./api";

export const getMenuItems = async () => {
  const res = await api.get("/menu");
  return res.data;
};

export const getMenuItemById = async (id) => {
  const res = await api.get(`/menu/${id}`);
  return res.data;
};

export const createMenuItem = async (itemData) => {
  const res = await api.post("/menu", itemData);
  return res.data;
};

export const updateMenuItem = async (id, itemData) => {
  const res = await api.put(`/menu/${id}`, itemData);
  return res.data;
};

export const deleteMenuItem = async (id) => {
  const res = await api.delete(`/menu/${id}`);
  return res.data;
};