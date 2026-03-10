import axios from "axios";

const API_URL = "/api/financial-flows";

export const getAllFinancialFlows = async (params = {}) => {
  const { data } = await axios.get(API_URL, { params });
  return data;
};

export const getFinancialFlowById = async (id) => {
  const { data } = await axios.get(`${API_URL}/${id}`);
  return data;
};

export const createFinancialFlow = async (flowData) => {
  const { data } = await axios.post(API_URL, flowData);
  return data;
};

export const updateFinancialFlow = async (id, flowData) => {
  const { data } = await axios.patch(`${API_URL}/${id}`, flowData);
  return data;
};

export const deleteFinancialFlow = async (id) => {
  const { data } = await axios.delete(`${API_URL}/${id}`);
  return data;
};