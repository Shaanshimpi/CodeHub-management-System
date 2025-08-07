import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box, Typography, Paper, Grid } from '@mui/material'
import { getStudents } from '../store/slices/studentSlice'
import { getFees } from '../store/slices/feeSlice'
import { getUsers } from '../store/slices/userSlice'
import FeeList from '../components/fees/FeeList'
import StudentList from '../components/students/StudentList'

const SuperAdminDashboard = () => {
  const dispatch = useDispatch()
  const { students } = useSelector(state => state.students)
  const { fees } = useSelector(state => state.fees)
  const { users } = useSelector(state => state.users)

  useEffect(() => {
    dispatch(getStudents())
    dispatch(getFees())
    dispatch(getUsers())
  }, [dispatch])

  const activeStudents = students.filter(s => s.status === 'active').length
  const trialStudents = students.filter(s => s.status === 'trial').length
  const totalRevenue = fees.filter(f => f.status === 'paid').reduce((sum, fee) => sum + fee.amount, 0)
  const pendingFees = fees.filter(f => f.status !== 'paid').length

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Super Admin Dashboard</Typography>
      
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Total Users</Typography>
            <Typography variant="h4">{users.length}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Active Students</Typography>
            <Typography variant="h4">{activeStudents}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Trial Students</Typography>
            <Typography variant="h4">{trialStudents}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Total Revenue</Typography>
            <Typography variant="h4">₹{totalRevenue.toLocaleString()}</Typography>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Recent Students</Typography>
            <StudentList students={students} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Pending Fees ({pendingFees})</Typography>
            <FeeList fees={fees} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default SuperAdminDashboard