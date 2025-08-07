import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { DataGrid } from '@mui/x-data-grid'
import { Box, Typography } from '@mui/material'
import { getStudentFees } from '../../store/slices/feeSlice'

const StudentFees = ({ studentId }) => {
  const dispatch = useDispatch()
  const { fees, loading } = useSelector(state => state.fees)

  useEffect(() => {
    dispatch(getStudentFees(studentId))
  }, [dispatch, studentId])

  const columns = [
    { field: 'courseName', headerName: 'Course', width: 200 },
    { field: 'amount', headerName: 'Amount', width: 120,
      valueFormatter: (params) => `₹${params.value.toLocaleString()}` },
    { field: 'dueDate', headerName: 'Due Date', width: 150,
      valueFormatter: (params) => new Date(params.value).toLocaleDateString() },
    { field: 'status', headerName: 'Status', width: 120,
      renderCell: (params) => (
        <Box
          sx={{
            color: params.value === 'paid' ? 'success.main' : 
                  params.value === 'overdue' ? 'error.main' : 'warning.main',
            fontWeight: 'bold'
          }}
        >
          {params.value}
        </Box>
      ) },
    { field: 'paidDate', headerName: 'Paid Date', width: 150,
      valueFormatter: (params) => params.value ? new Date(params.value).toLocaleDateString() : '-' },
  ]

  const rows = fees.map(fee => ({
    id: fee._id,
    courseName: fee.courseId.name,
    amount: fee.amount,
    dueDate: fee.dueDate,
    status: fee.status,
    paidDate: fee.paidDate
  }))

  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <Typography variant="h6" gutterBottom>Fee Records</Typography>
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

export default StudentFees