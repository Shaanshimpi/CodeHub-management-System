import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box, Typography, Paper, Grid } from '@mui/material'
import { getStudentAttendance} from '../store/slices/attendanceSlice'
import { getStudentFees } from '../store/slices/feeSlice'
import FeeList from '../components/fees/FeeList'
import AttendanceList from '../components/attendance/AttendanceList'

const StudentDashboard = () => {
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)
  const { currentStudent } = useSelector(state => state.students)
  const { attendance } = useSelector(state => state.attendance)
  const { fees } = useSelector(state => state.fees)

  useEffect(() => {
    if (currentStudent) {
      dispatch(getStudentAttendance(currentStudent._id))
      dispatch(getStudentFees(currentStudent._id))
    }
  }, [dispatch, currentStudent])

  const presentCount = attendance.filter(a => a.status === 'present').length
  const attendancePercentage = attendance.length > 0 
    ? Math.round((presentCount / attendance.length) * 100) 
    : 0
  const pendingFees = fees.filter(f => f.status !== 'paid').length

  return (
    <Box>
      <Typography variant="h4" gutterBottom>My Dashboard</Typography>
      
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">My Status</Typography>
            <Typography variant="h4" sx={{ 
              color: currentStudent?.status === 'active' ? 'success.main' : 
                    currentStudent?.status === 'trial' ? 'warning.main' : 'error.main'
            }}>
              {currentStudent?.status.toUpperCase()}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Attendance</Typography>
            <Typography variant="h4">{attendancePercentage}%</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Pending Fees</Typography>
            <Typography variant="h4">{pendingFees}</Typography>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '400px' }}>
            <Typography variant="h6" gutterBottom>My Attendance</Typography>
            <AttendanceList attendance={attendance} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '400px' }}>
            <Typography variant="h6" gutterBottom>My Fees</Typography>
            <FeeList fees={fees} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default StudentDashboard