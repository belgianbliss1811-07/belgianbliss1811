import api from "./api";

export const placeOrder = async (orderData) => {
  const res = await api.post("/orders", orderData);
  return res.data;
};

export const getAllOrders = async () => {
  const res = await api.get("/orders");
  return res.data;
};

export const getOrderById = async (id) => {
  const res = await api.get(`/orders/${id}`);
  return res.data;
};

export const updateOrderStatus = async (id, status) => {
  const res = await api.patch(`/orders/${id}/status`, { status });
  return res.data;
};

export const deleteOrder = async (id) => {
  const res = await api.delete(`/orders/${id}`);
  return res.data;
};

export const updateOrder = async (id, updateData) => {
  const res = await api.put(`/orders/${id}`, updateData);
  return res.data;
};
