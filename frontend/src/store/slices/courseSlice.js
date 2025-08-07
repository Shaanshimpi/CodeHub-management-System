import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import courseService from '../../api/course'

export const getCourses = createAsyncThunk(
  'courses/getAll',
  async (_, { rejectWithValue }) => {
    try {
      return await courseService.getCourses()
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const getCourse = createAsyncThunk(
  'courses/getOne',
  async (id, { rejectWithValue }) => {
    try {
      return await courseService.getCourse(id)
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const createCourse = createAsyncThunk(
  'courses/create',
  async (courseData, { rejectWithValue }) => {
    try {
      return await courseService.createCourse(courseData)
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const updateCourse = createAsyncThunk(
  'courses/update',
  async ({ id, ...courseData }, { rejectWithValue }) => {
    try {
      return await courseService.updateCourse({ id, ...courseData })
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

const courseSlice = createSlice({
  name: 'courses',
  initialState: {
    courses: [],
    currentCourse: null,
    loading: false,
    error: null
  },
  reducers: {
    clearCourseError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCourses.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getCourses.fulfilled, (state, action) => {
        state.loading = false
        state.courses = action.payload
      })
      .addCase(getCourses.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(getCourse.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getCourse.fulfilled, (state, action) => {
        state.loading = false
        state.currentCourse = action.payload
      })
      .addCase(getCourse.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(createCourse.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createCourse.fulfilled, (state, action) => {
        state.loading = false
        state.courses.push(action.payload)
      })
      .addCase(createCourse.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(updateCourse.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateCourse.fulfilled, (state, action) => {
        state.loading = false
        state.currentCourse = action.payload
        state.courses = state.courses.map(course => 
          course._id === action.payload._id ? action.payload : course
        )
      })
      .addCase(updateCourse.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  }
})

export const { clearCourseError } = courseSlice.actions
export default courseSlice.reducer