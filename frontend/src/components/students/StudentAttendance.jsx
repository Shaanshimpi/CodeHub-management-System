import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { DataGrid } from '@mui/x-data-grid'
import { Box, Typography } from '@mui/material'
import { getStudentAttendance } from '../../store/slices/attendanceSlice'

const StudentAttendance = ({ studentId }) => {
  const dispatch = useDispatch()
  const { attendance, loading } = useSelector(state => state.attendance)

  useEffect(() => {
    dispatch(getStudentAttendance(studentId))
  }, [dispatch, studentId])

  const columns = [
    { field: 'date', headerName: 'Date', width: 150,
      valueFormatter: (params) => new Date(params.value).toLocaleDateString() },
    { field: 'courseName', headerName: 'Course', width: 200 },
    { field: 'status', headerName: 'Status', width: 120,
      renderCell: (params) => (
        <Box
          sx={{
            color: params.value === 'present' ? 'success.main' : 
                  params.value === 'late' ? 'warning.main' : 'error.main',
            fontWeight: 'bold'
          }}
        >
          {params.value}
        </Box>
      ) },
    { field: 'trainerName', headerName: 'Trainer', width: 200 },
    { field: 'notes', headerName: 'Notes', width: 300 },
  ]

  const rows = attendance.map(record => ({
    id: record._id,
    date: record.date,
    courseName: record.courseId.name,
    status: record.status,
    trainerName: record.trainerId.name,
    notes: record.notes
  }))

  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <Typography variant="h6" gutterBottom>Attendance Records</Typography>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5, 10, 25]}
        loading={loading}
      />
    </Box>
  )
}

export default StudentAttendance