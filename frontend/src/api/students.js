import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

const getStudents = async () => {
  const response = await axios.get(`/api/students`)
  return response.data
}

const getStudent = async (id) => {
  const response = await axios.get(`/api/students/${id}`)
  return response.data
}

const createStudent = async (studentData) => {
  const response = await axios.post(`/api/students`, studentData)
  return response.data
}

const updateStudent = async ({ id, ...studentData }) => {
  const response = await axios.put(`/api/students/${id}`, studentData)
  return response.data
}

const handleTrialDecision = async (id, decision) => {
  const response = await axios.post(`/api/students/${id}/trial-decision`, { decision })
  return response.data
}

const studentService = {
  getStudents,
  getStudent,
  createStudent,
  updateStudent,
  handleTrialDecision
}

export default studentService