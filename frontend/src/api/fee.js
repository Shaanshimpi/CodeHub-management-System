import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '';

// Configure axios defaults
axios.defaults.baseURL = API_URL;

const getFees = async () => {
  console.debug('[api/fees] GET /api/fees request');
  const response = await axios.get(`/api/fees`);
  console.debug('[api/fees] GET /api/fees response', Array.isArray(response.data) ? response.data.length : response.data);
  return response.data;
};

const getStudentFees = async (studentId) => {
  console.debug('[api/fees] GET /api/students/:studentId/fees request', studentId);
  const response = await axios.get(`/api/students/${studentId}/fees`);
  console.debug('[api/fees] GET /api/students/:studentId/fees response', Array.isArray(response.data) ? response.data.length : response.data);
  return response.data;
};

const createFee = async (feeData) => {
  console.debug('[api/fees] POST /api/fees request', feeData);
  const response = await axios.post(`/api/fees`, feeData);
  console.debug('[api/fees] POST /api/fees response', response.data?._id);
  return response.data;
};

const feeService = { getFees, getStudentFees, createFee };

export default feeService;
