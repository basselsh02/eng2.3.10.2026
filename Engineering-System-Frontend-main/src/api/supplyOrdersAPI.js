import api from "./axiosInstance";

export const getSupplyOrderById = async (id) => {
  const res = await api.get(`/supply-orders/${id}`);
  return res.data;
};

export const getSupplyOrders = async (filters) => {
  const res = await api.get("/supply-orders", { params: filters });
  return res.data;
};
