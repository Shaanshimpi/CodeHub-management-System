import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { DataGrid } from '@mui/x-data-grid'
import { Button, Box, Typography, Chip } from '@mui/material'
import { getAttendance } from '../../store/slices/attendanceSlice'

const AttendanceList = () => {
  const dispatch = useDispatch()
  const { attendance, loading } = useSelector(state => state.attendance)
  const { user } = useSelector(state => state.auth)

  useEffect(() => {
    if (user?.role === 'trainer') {
      dispatch(getAttendance({ trainerId: user._id }))
    } else {
      dispatch(getAttendance())
    }
  }, [dispatch, user])

  const columns = [
    { field: 'date', headerName: 'Date', width: 150,
      valueFormatter: (params) => new Date(params.value).toLocaleDateString() },
    { field: 'studentName', headerName: 'Student', width: 200 },
    { field: 'courseName', headerName: 'Course', width: 200 },
    { field: 'status', headerName: 'Status', width: 120,
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          color={
            params.value === 'present' ? 'success' : 
            params.value === 'late' ? 'warning' : 'error'
          } 
        />
      ) },
    { field: 'trainerName', headerName: 'Trainer', width: 200 },
    { field: 'notes', headerName: 'Notes', width: 250 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <Button
          component={Link}
          to={`/attendance/${params.row._id}`}
          size="small"
          variant="outlined"
        >
          Edit
        </Button>
      ),
    },
  ]
  

  const rows = attendance.map(record => ({
    _id: record._id,
    date: record.date,
    studentName: record.studentId.studentId,
    courseName: record.courseId.name,
    status: record.status,
    trainerName: record.trainerId.name,
    notes: record.notes
  }))

  console.log("attendance", attendance)

  return (
    <Box sx={{ height: 600, width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4">Attendance Records</Typography>
        {user?.role === 'trainer' && (
          <Box>
            <Button component={Link} to="/attendance/new" variant="contained" sx={{ mr: 2 }}>
              Add Record
            </Button>
            <Button component={Link} to="/attendance/bulk" variant="outlined">
              Bulk Add
            </Button>
          </Box>
        )}
      </Box>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10, 25, 50]}
        loading={loading}
        getRowId={(row) => row._id}
      />
    </Box>
  )
}

export default AttendanceList