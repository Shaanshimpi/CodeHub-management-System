import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { setAuthToken, removeAuthToken } from '../../utils/auth'

const API_URL = import.meta.env.VITE_API_URL || ''

// Configure axios defaults
axios.defaults.baseURL = API_URL

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/api/auth/login`, { email, password })
      console.log('Login response:', response.data)
      setAuthToken(response.data.token)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)
  

export const getProfile = createAsyncThunk(
  'auth/getProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/auth/profile`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const updateUserProfile = createAsyncThunk(
  'auth/updateUserProfile',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/users/profile`, userData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/api/auth/register`, userData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        return rejectWithValue('No token found')
      }
      setAuthToken(token)
      const response = await axios.get(`/api/users/profile`)
      return { user: response.data, token }
    } catch (error) {
      removeAuthToken()
      return rejectWithValue(error.response.data)
    }
  }
)

export const logout = createAsyncThunk('auth/logout', () => {
  removeAuthToken()
})

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null
  },
  reducers: {
  clearError: (state) => {
    state.error = null
  },
  resetAuthState: (state) => {
    state.user = null
    state.token = null
    state.isAuthenticated = false
    state.error = null
  }
},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        console.log('Login successful:', action)
        state.user = action.payload
        state.token = action.payload.token
        localStorage.setItem('user', JSON.stringify(action.payload))
        localStorage.setItem('token', action.payload.token)
        localStorage.setItem('isAuthenticated', 'true')
        localStorage.setItem('allowedRoles', [action.payload.role])
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        console.error('Login error:', action)
        state.isAuthenticated = false
        state.error = action.payload || 'Login failed'
      })
      .addCase(register.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Registration failed'
      })
      .addCase(checkAuth.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.user = action.payload.user
        state.token = action.payload.token
      })
      .addCase(checkAuth.rejected, (state) => {
        state.loading = false
        state.isAuthenticated = false
        state.user = null
        state.token = null
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false
        state.user = null
        state.token = null
      })
  }
})

export const { clearError } = authSlice.actions
export default authSlice.reducer