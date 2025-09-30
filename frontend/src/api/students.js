import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || ''

// Configure axios defaults
axios.defaults.baseURL = API_URL

const getStudents = async () => {
  console.debug('[api/students] GET /api/students request')
  const response = await axios.get(`/api/students`)
  console.debug('[api/students] GET /api/students response', Array.isArray(response.data) ? response.data.length : response.data)
  return response.data
}

const getStudent = async (id) => {
  console.debug('[api/students] GET /api/students/:id request', id)
  const response = await axios.get(`/api/students/${id}`)
  console.debug('[api/students] GET /api/students/:id response', response.data?._id)
  return response.data
}

const createStudent = async (studentData) => {
  console.debug('[api/students] POST /api/students request', studentData)
  const response = await axios.post(`/api/students`, studentData)
  console.debug('[api/students] POST /api/students response', response.data?._id)
  return response.data
}

const updateStudent = async ({ id, ...studentData }) => {
  console.debug('[api/students] PUT /api/students/:id request', id)
  const response = await axios.put(`/api/students/${id}`, studentData)
  console.debug('[api/students] PUT /api/students/:id response', response.data?._id)
  return response.data
}

const handleTrialDecision = async (id, decision) => {
  console.debug('[api/students] POST /api/students/:id/trial-decision request', id, decision)
  const response = await axios.post(`/api/students/${id}/trial-decision`, { decision })
  console.debug('[api/students] POST /api/students/:id/trial-decision response', response.data)
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