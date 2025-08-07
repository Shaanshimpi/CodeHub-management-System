import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box, Typography, Paper, Grid } from '@mui/material'
import { getStudents } from '../store/slices/studentSlice'
import { getCourses } from '../store/slices/courseSlice'
const AdminDashboard = () => {
  const dispatch = useDispatch()
  const { students } = useSelector(state => state.students)
  const { courses } = useSelector(state => state.courses)

  useEffect(() => {
    dispatch(getStudents())
    dispatch(getCourses())
  }, [dispatch])

  const activeStudents = students.filter(s => s.status === 'active').length
  const activeCourses = courses.filter(c => c.isActive).length

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Admin Dashboard</Typography>
      
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Total Students</Typography>
            <Typography variant="h4">{students.length}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Active Students</Typography>
            <Typography variant="h4">{activeStudents}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Active Courses</Typography>
            <Typography variant="h4">{activeCourses}</Typography>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '400px' }}>
            <Typography variant="h6" gutterBottom>Recent Students</Typography>
            {/* Student list component */}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '400px' }}>
            <Typography variant="h6" gutterBottom>Course Status</Typography>
            {/* Course status chart */}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default AdminDashboard