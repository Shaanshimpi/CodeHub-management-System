import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box, Typography, Paper, Grid, Button } from '@mui/material'
import { Link } from 'react-router-dom'
import { getStudents } from '../store/slices/studentSlice'
import { getAttendance } from '../store/slices/attendanceSlice'
import StudentList from '../components/students/StudentList'
import AttendanceList from '../components/attendance/AttendanceList'

const TrainerDashboard = () => {
  const dispatch = useDispatch()
  const { students } = useSelector(state => state.students)
  const { attendance } = useSelector(state => state.attendance)
  const { user } = useSelector(state => state.auth)

  useEffect(() => {
    if (user) {
      dispatch(getStudents({ trainerId: user._id }))
      dispatch(getAttendance({ trainerId: user._id }))
    }
  }, [dispatch, user])

  const assignedStudents = students.length
  const today = new Date().toISOString().split('T')[0]
  const todaysAttendance = attendance.filter(a => 
    new Date(a.date).toISOString().split('T')[0] === today
  ).length

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Trainer Dashboard</Typography>
      
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Assigned Students</Typography>
            <Typography variant="h4">{assignedStudents}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Today's Attendance</Typography>
            <Typography variant="h4">{todaysAttendance}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h6" gutterBottom>Quick Actions</Typography>
            <Button 
              component={Link} 
              to="/attendance/new" 
              variant="contained" 
              fullWidth
              sx={{ mb: 1 }}
            >
              Mark Attendance
            </Button>
            <Button 
              component={Link} 
              to="/attendance/bulk" 
              variant="outlined" 
              fullWidth
            >
              Bulk Attendance
            </Button>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '400px' }}>
            <Typography variant="h6" gutterBottom>My Students</Typography>
            <StudentList students={students} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '400px' }}>
            <Typography variant="h6" gutterBottom>Recent Attendance</Typography>
            <AttendanceList attendance={attendance} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default TrainerDashboard