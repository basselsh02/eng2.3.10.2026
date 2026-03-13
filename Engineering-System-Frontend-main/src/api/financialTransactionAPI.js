import api from "./axiosInstance";

const API_URL = "/financial-transactions";

export const getAllFinancialTransactions = async (params = {}) => {
  const { data } = await api.get(API_URL, { params });
  return data;
};

export const getFinancialTransactionById = async (id) => {
  const { data } = await api.get(`${API_URL}/${id}`);
  return data;
};

export const createFinancialTransaction = async (transactionData) => {
  const { data } = await api.post(API_URL, transactionData);
  return data;
};

export const updateFinancialTransaction = async (id, transactionData) => {
  const { data } = await api.patch(`${API_URL}/${id}`, transactionData);
  return data;
};

export const deleteFinancialTransaction = async (id) => {
  const { data } = await api.delete(`${API_URL}/${id}`);
  return data;
};
