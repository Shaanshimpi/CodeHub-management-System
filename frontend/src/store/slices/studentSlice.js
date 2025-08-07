import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import studentService from '../../api/students'

export const getStudents = createAsyncThunk(
  'students/getAll',
  async (_, { rejectWithValue }) => {
    try {
      return await studentService.getStudents()
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const getStudent = createAsyncThunk(
  'students/getOne',
  async (id, { rejectWithValue }) => {
    try {
      return await studentService.getStudent(id)
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const createStudent = createAsyncThunk(
  'students/create',
  async (studentData, { rejectWithValue }) => {
    try {
      return await studentService.createStudent(studentData)
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const updateStudent = createAsyncThunk(
  'students/update',
  async ({ id, ...studentData }, { rejectWithValue }) => {
    try {
      return await studentService.updateStudent({ id, ...studentData })
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const handleTrialDecision = createAsyncThunk(
  'students/trialDecision',
  async ({ id, decision }, { rejectWithValue }) => {
    try {
      return await studentService.handleTrialDecision(id, decision)
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

const studentSlice = createSlice({
  name: 'students',
  initialState: {
    students: [],
    currentStudent: null,
    loading: false,
    error: null
  },
  reducers: {
    clearStudentError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getStudents.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getStudents.fulfilled, (state, action) => {
        state.loading = false
        state.students = action.payload
      })
      .addCase(getStudents.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(getStudent.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getStudent.fulfilled, (state, action) => {
        state.loading = false
        state.currentStudent = action.payload
      })
      .addCase(getStudent.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(createStudent.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createStudent.fulfilled, (state, action) => {
        state.loading = false
        state.students.push(action.payload)
      })
      .addCase(createStudent.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(updateStudent.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateStudent.fulfilled, (state, action) => {
        state.loading = false
        state.currentStudent = action.payload
        state.students = state.students.map(student => 
          student._id === action.payload._id ? action.payload : student
        )
      })
      .addCase(updateStudent.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(handleTrialDecision.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(handleTrialDecision.fulfilled, (state, action) => {
        state.loading = false
        state.currentStudent = action.payload
        state.students = state.students.map(student => 
          student._id === action.payload._id ? action.payload : student
        )
      })
      .addCase(handleTrialDecision.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  }
})

export const { clearStudentError } = studentSlice.actions
export default studentSlice.reducer