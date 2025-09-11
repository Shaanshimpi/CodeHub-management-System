import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

const getAttendance = async (filters = {}) => {
  const response = await axios.get(`/api/attendance`, { params: filters })
  return response.data
}

const getAttendanceRecord = async (id) => {
  const response = await axios.get(`/api/attendance/${id}`)
  return response.data
}

const createAttendance = async (attendanceData) => {
  const response = await axios.post(`/api/attendance`, attendanceData)
  return response.data
}

const updateAttendance = async ({ id, ...attendanceData }) => {
  const response = await axios.put(`/api/attendance/${id}`, attendanceData)
  return response.data
}

const getStudentAttendance = async (studentId) => {
  const response = await axios.get(`/api/attendance/student/${studentId}`)
  return response.data
}

const createBulkAttendance = async (payload) => {
  const response = await axios.post(`/api/attendance/bulk`, payload)
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