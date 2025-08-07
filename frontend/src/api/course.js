import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

const getCourses = async () => {
  const response = await axios.get(`/api/courses`)
  return response.data
}

const getCourse = async (id) => {
  const response = await axios.get(`/api/courses/${id}`)
  return response.data
}

const createCourse = async (courseData) => {
  const response = await axios.post(`/api/courses`, courseData)
  return response.data
}

const updateCourse = async ({ id, ...courseData }) => {
  const response = await axios.put(`/api/courses/${id}`, courseData)
  return response.data
}

const courseService = {
  getCourses,
  getCourse,
  createCourse,
  updateCourse
}

export default courseService