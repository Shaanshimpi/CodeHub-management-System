import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import attendanceService from '../../api/attendance'

export const getAttendance = createAsyncThunk(
  'attendance/getAll',
  async (filters, { rejectWithValue }) => {
    try {
      return await attendanceService.getAttendance(filters)
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const getAttendanceRecord = createAsyncThunk(
  'attendance/getOne',
  async (id, { rejectWithValue }) => {
    try {
      return await attendanceService.getAttendanceRecord(id)
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const createAttendance = createAsyncThunk(
  'attendance/create',
  async (attendanceData, { rejectWithValue }) => {
    try {
      return await attendanceService.createAttendance(attendanceData)
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const updateAttendance = createAsyncThunk(
  'attendance/update',
  async ({ id, ...attendanceData }, { rejectWithValue }) => {
    try {
      return await attendanceService.updateAttendance({ id, ...attendanceData })
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const getStudentAttendance = createAsyncThunk(
  'attendance/getStudentAttendance',
  async (studentId, { rejectWithValue }) => {
    try {
      return await attendanceService.getStudentAttendance(studentId)
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const createBulkAttendance = createAsyncThunk(
  'attendance/createBulk',
  async (data, { rejectWithValue }) => {
    try {
      return await attendanceService.createBulkAttendance(data)
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState: {
    attendance: [],
    currentRecord: null,
    loading: false,
    error: null
  },
  reducers: {
    clearAttendanceError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAttendance.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getAttendance.fulfilled, (state, action) => {
        state.loading = false
        state.attendance = action.payload
      })
      .addCase(getAttendance.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(getAttendanceRecord.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getAttendanceRecord.fulfilled, (state, action) => {
        state.loading = false
        state.currentRecord = action.payload
      })
      .addCase(getAttendanceRecord.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(createAttendance.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createAttendance.fulfilled, (state, action) => {
        state.loading = false
        state.attendance.push(action.payload)
      })
      .addCase(createAttendance.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(updateAttendance.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateAttendance.fulfilled, (state, action) => {
        state.loading = false
        state.currentRecord = action.payload
        state.attendance = state.attendance.map(record => 
          record._id === action.payload._id ? action.payload : record
        )
      })
      .addCase(updateAttendance.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(getStudentAttendance.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getStudentAttendance.fulfilled, (state, action) => {
        state.loading = false
        state.attendance = action.payload
      })
      .addCase(getStudentAttendance.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(createBulkAttendance.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createBulkAttendance.fulfilled, (state, action) => {
        state.loading = false
        state.attendance.push(...action.payload)
      })
      .addCase(createBulkAttendance.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  }
})

export const { clearAttendanceError } = attendanceSlice.actions
export default attendanceSlice.reducer