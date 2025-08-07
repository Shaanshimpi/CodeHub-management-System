import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box, Typography, Paper, Grid } from '@mui/material'
import { getStudents} from '../store/slices/studentSlice'
import { getCourses } from '../store/slices/courseSlice'
import { getFees } from '../store/slices/feeSlice'
import StudentList from '../components/students/StudentList'
import FeeList from '../components/fees/FeeList'

const SalesDashboard = () => {
  const dispatch = useDispatch()
  const { students } = useSelector(state => state.students)
  const { fees } = useSelector(state => state.fees)

  useEffect(() => {
    dispatch(getStudents())
    dispatch(getFees())
  }, [dispatch])

  const trialStudents = students.filter(s => s.status === 'trial').length
  const pendingFees = fees.filter(f => f.status !== 'paid').length
  const totalRevenue = fees.filter(f => f.status === 'paid').reduce((sum, fee) => sum + fee.amount, 0)

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Sales Dashboard</Typography>
      
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Trial Students</Typography>
            <Typography variant="h4">{trialStudents}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Pending Fees</Typography>
            <Typography variant="h4">{pendingFees}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Total Revenue</Typography>
            <Typography variant="h4">₹{totalRevenue.toLocaleString()}</Typography>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '400px' }}>
            <Typography variant="h6" gutterBottom>Recent Enrollments</Typography>
            <StudentList students={students} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '400px' }}>
            <Typography variant="h6" gutterBottom>Fee Status</Typography>
            <FeeList fees={fees} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default SalesDashboard