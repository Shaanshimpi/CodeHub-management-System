import { Box, Typography } from '@mui/material'
import { useSelector } from 'react-redux'
import StudentDashboard from './StudentDashboard'
import TrainerDashboard from './TrainerDashboard'
import SuperAdminDashboard from './SuperAdminDashboard'
import AdminDashboard from './AdminDashboard'
import SalesDashboard from './SalesDashboard'
import Drawer from '../components/common/MainDrawer'
import { useState } from 'react'

const Dashboard = () => {
  const { user } = useSelector(state => state.auth)
  
const [mobileOpen, setMobileOpen] = useState(false)
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const getDashboardContent = () => {
    switch(user?.role) {
      case 'super_admin':
        return <Typography variant="h5">Welcome Super Admin! Access all system features from the sidebar.<SuperAdminDashboard /></Typography>
      case 'admin':
        return <Typography variant="h5">Welcome Admin! Manage courses, students, and view reports.<AdminDashboard /></Typography>
      case 'sales_person':
        return <Typography variant="h5">Welcome Sales Person! Manage student enrollments and fee collections.<SalesDashboard /></Typography>
      case 'trainer':
        return <Typography variant="h5">Welcome Trainer! Mark attendance and track student progress.<TrainerDashboard /></Typography>
      case 'student':
        return <Typography variant="h5">Welcome Student! View your attendance and fee status.<StudentDashboard /></Typography>
      default:
        return <Typography variant="h5">Welcome to CodeHub ERP System</Typography>
    }
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Dashboard</Typography>
      {getDashboardContent()}
    </Box>
  )
}

export default Dashboard