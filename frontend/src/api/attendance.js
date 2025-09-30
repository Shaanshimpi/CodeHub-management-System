import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || ''

// Configure axios defaults
axios.defaults.baseURL = API_URL

const getAttendance = async (filters = {}) => {
  console.debug('[api/attendance] GET /api/attendance request', filters)
  const response = await axios.get(`/api/attendance`, { params: filters })
  console.debug('[api/attendance] GET /api/attendance response', Array.isArray(response.data) ? response.data.length : response.data)
  return response.data
}

const getAttendanceRecord = async (id) => {
  console.debug('[api/attendance] GET /api/attendance/:id request', id)
  const response = await axios.get(`/api/attendance/${id}`)
  console.debug('[api/attendance] GET /api/attendance/:id response', response.data?._id)
  return response.data
}

const createAttendance = async (attendanceData) => {
  console.debug('[api/attendance] POST /api/attendance request', attendanceData)
  const response = await axios.post(`/api/attendance`, attendanceData)
  console.debug('[api/attendance] POST /api/attendance response', response.data?._id)
  return response.data
}

const updateAttendance = async ({ id, ...attendanceData }) => {
  console.debug('[api/attendance] PUT /api/attendance/:id request', id)
  const response = await axios.put(`/api/attendance/${id}`, attendanceData)
  console.debug('[api/attendance] PUT /api/attendance/:id response', response.data?._id)
  return response.data
}

const getStudentAttendance = async (studentId) => {
  console.debug('[api/attendance] GET /api/attendance/student/:studentId request', studentId)
  const response = await axios.get(`/api/attendance/student/${studentId}`)
  console.debug('[api/attendance] GET /api/attendance/student/:studentId response', Array.isArray(response.data) ? response.data.length : response.data)
  return response.data
}

const createBulkAttendance = async (payload) => {
  console.debug('[api/attendance] POST /api/attendance/bulk request', payload)
  const response = await axios.post(`/api/attendance/bulk`, payload)
  console.debug('[api/attendance] POST /api/attendance/bulk response', Array.isArray(response.data) ? response.data.length : response.data)
  return response.data
}

const attendanceService = {
  getAttendance,
  getAttendanceRecord,
  createAttendance,
  updateAttendance,
  getStudentAttendance,
  createBulkAttendance
}

export default attendanceService