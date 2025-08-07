import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

const login = async (email, password) => {
  const response = await axios.post(`/api/auth/login`, { email, password })
  return response.data
}

const register = async (userData) => {
  const response = await axios.post(`/api/auth/register`, userData)
  return response.data
}

const updateProfile = async (userData) => {
  const response = await axios.put(`/api/users/profile`, userData)
  return response.data
}

const logout = () => {
  localStorage.removeItem('token')
}

const getProfile = async () => {
  const response = await axios.get(`/api/users/profile`)
  return response.data
}

const authService = {
  login,
  register,
  logout,
  getProfile,
  updateProfile
}

export default authService