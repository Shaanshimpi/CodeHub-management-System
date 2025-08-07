import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

const getFees = async () => {
  const response = await axios.get(`/api/fees`)
  return response.data
}

const getFee = async (id) => {
  const response = await axios.get(`/api/fees/${id}`)
  return response.data
}

const createFee = async (feeData) => {
  const response = await axios.post(`/api/fees`, feeData)
  return response.data
}

const updateFee = async ({ id, ...feeData }) => {
  const response = await axios.put(`/api/fees/${id}`, feeData)
  return response.data
}

const recordPayment = async (paymentData) => {
  const response = await axios.post(`/api/fees/payment`, paymentData)
  return response.data
}

const getStudentFees = async (studentId) => {
  const response = await axios.get(`/api/students/${studentId}/fees`)
  return response.data
}

const feeService = {
  getFees,
  getFee,
  createFee,
  updateFee,
  recordPayment,
  getStudentFees
}

export default feeService;