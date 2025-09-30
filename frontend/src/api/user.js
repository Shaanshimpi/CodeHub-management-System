import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || ''

// Configure axios defaults
axios.defaults.baseURL = API_URL

const getUsers = async () => {
  const response = await axios.get(`/api/users`)
  return response.data
}

const getUser = async (id) => {
  const response = await axios.get(`/api/users/${id}`)
  return response.data
}

const createUser = async (userData) => {
  const response = await axios.post(`/api/users`, userData)
  return response.data
}

const updateUser = async ({ id, ...userData }) => {
  const response = await axios.put(`/api/users/${id}`, userData)
  return response.data
}

const userService = {
  getUsers,
  getUser,
  createUser,
  updateUser
}

export default userService