import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'

export const setAuthToken = (token) => {
  console.log('Setting auth token:', token)
  if (token) {
    localStorage.setItem('token', token)
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }
}

export const removeAuthToken = () => {
  localStorage.removeItem('token')
  delete axios.defaults.headers.common['Authorization']
}

export const checkAuthToken = () => {
  const token = localStorage.getItem('token')
  if (token) {
    setAuthToken(token)
    return true
  }
  return false
}