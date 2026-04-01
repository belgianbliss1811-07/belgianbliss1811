import api from "./api";

export const getAllInvoices = async () => {
  const res = await api.get("/billing");
  return res.data;
};

export const getInvoiceByOrderId = async (orderId) => {
  const res = await api.get(`/billing/order/${orderId}`);
  return res.data;
};

export const createInvoice = async (invoiceData) => {
  const res = await api.post("/billing", invoiceData);
  return res.data;
};

export const sendInvoiceViaWhatsApp = async (invoiceId) => {
  const res = await api.post(`/billing/${invoiceId}/send-whatsapp`);
  return res.data;
};
