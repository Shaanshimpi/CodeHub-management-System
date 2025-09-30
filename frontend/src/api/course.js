import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || ''

// Configure axios defaults
axios.defaults.baseURL = API_URL

const getCourses = async () => {
  console.debug('[api/course] GET /api/courses request')
  const response = await axios.get(`/api/courses`)
  console.debug('[api/course] GET /api/courses response', Array.isArray(response.data) ? response.data.length : response.data)
  return response.data
}

const getCourse = async (id) => {
  console.debug('[api/course] GET /api/courses/:id request', id)
  const response = await axios.get(`/api/courses/${id}`)
  console.debug('[api/course] GET /api/courses/:id response', response.data?._id)
  return response.data
}

const createCourse = async (courseData) => {
  console.debug('[api/course] POST /api/courses request', courseData)
  const response = await axios.post(`/api/courses`, courseData)
  console.debug('[api/course] POST /api/courses response', response.data?._id)
  return response.data
}

const updateCourse = async ({ id, ...courseData }) => {
  console.debug('[api/course] PUT /api/courses/:id request', id)
  const response = await axios.put(`/api/courses/${id}`, courseData)
  console.debug('[api/course] PUT /api/courses/:id response', response.data?._id)
  return response.data
}

const courseService = {
  getCourses,
  getCourse,
  createCourse,
  updateCourse
}

export default courseService