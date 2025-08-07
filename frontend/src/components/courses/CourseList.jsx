import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { DataGrid } from '@mui/x-data-grid'
import { Button, Box, Typography, Chip } from '@mui/material'
import { getCourses } from '../../store/slices/courseSlice'

const CourseList = () => {
  const dispatch = useDispatch()
  const { courses, loading } = useSelector(state => state.courses)
  const { user } = useSelector(state => state.auth)

  useEffect(() => {
    dispatch(getCourses())
  }, [dispatch])

  const columns = [
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'duration', headerName: 'Duration (weeks)', width: 150 },
    { field: 'totalFees', headerName: 'Total Fees', width: 150,
      valueFormatter: (params) => `₹${params.value.toLocaleString()}` },
    { field: 'installments', headerName: 'Installments', width: 150,
      valueFormatter: (params) => params.value.length },
    { field: 'isActive', headerName: 'Status', width: 120,
      renderCell: (params) => (
        <Chip 
          label={params.value ? 'Active' : 'Inactive'} 
          color={params.value ? 'success' : 'error'} 
        />
      ) },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <Button
          component={Link}
          to={`/courses/${params.row._id}`}
          size="small"
          variant="outlined"
        >
          Edit
        </Button>
      ),
    },
  ]

  return (
    <Box sx={{ height: 600, width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4">Courses</Typography>
        {['super_admin', 'admin'].includes(user?.role) && (
          <Button component={Link} to="/courses/new" variant="contained">
            Add Course
          </Button>
        )}
      </Box>
      <DataGrid
        rows={courses}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10, 25, 50]}
        loading={loading}
        getRowId={(row) => row._id}
      />
    </Box>
  )
}

export default CourseList