import axios from "axios";

const API_URL = "/api/financial-transactions";

export const getAllFinancialTransactions = async (params = {}) => {
  const { data } = await axios.get(API_URL, { params });
  return data;
};

export const getFinancialTransactionById = async (id) => {
  const { data } = await axios.get(`${API_URL}/${id}`);
  return data;
};

export const createFinancialTransaction = async (transactionData) => {
  const { data } = await axios.post(API_URL, transactionData);
  return data;
};

export const updateFinancialTransaction = async (id, transactionData) => {
  const { data } = await axios.patch(`${API_URL}/${id}`, transactionData);
  return data;
};

export const deleteFinancialTransaction = async (id) => {
  const { data } = await axios.delete(`${API_URL}/${id}`);
  return data;
};