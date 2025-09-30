import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { DataGrid } from '@mui/x-data-grid'
import { Button, Box, Typography, ButtonGroup } from '@mui/material'
import { getStudents } from '../../store/slices/studentSlice'

const StudentList = () => {
  const dispatch = useDispatch()
  const { students, loading } = useSelector(state => state.students)
  const { user } = useSelector(state => state.auth)

  useEffect(() => {
    dispatch(getStudents())
  }, [dispatch])

  const columns = [
    { field: 'studentId', headerName: 'Student ID', width: 150 },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'email', headerName: 'Email', width: 250 },
    { field: 'phone', headerName: 'Phone', width: 150 },
    { field: 'status', headerName: 'Status', width: 120 },
    { field: 'trialEndDate', headerName: 'Trial End', width: 150, 
      valueFormatter: (params) => new Date(params.value).toLocaleDateString() },
    { field: 'registrationFee', headerName: 'Fee Paid', width: 120,
      valueFormatter: (params) => params.value.paid ? 'Yes' : 'No' },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 250,
      renderCell: (params) => {
        const allowedRoles = ['super_admin', 'admin', 'sales_person', 'trainer'];
        const canViewAttendance = allowedRoles.includes(user?.role);

        return (
          <ButtonGroup variant="outlined" size="small">
            <Button
              component={Link}
              to={`/students/${params.row._id}`}
            >
              View
            </Button>
            {canViewAttendance && (
              <Button
                component={Link}
                to={`/attendance/student/${params.row._id}`}
              >
                Attendance
              </Button>
            )}
          </ButtonGroup>
        )
      },
    },
  ]

  const rows = students.map(student => ({
    _id: student._id,
    studentId: student.studentId,
    name: student.userId.name,
    email: student.userId.email,
    phone: student.userId.phone,
    status: student.status,
    trialEndDate: student.trialEndDate,
    registrationFee: student.registrationFee
  }))

  return (
    <Box sx={{ height: 600, width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4">Students</Typography>
        {user?.role === 'sales_person' && (
          <Button component={Link} to="/students/new" variant="contained">
            Add Student
          </Button>
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

export default StudentList;