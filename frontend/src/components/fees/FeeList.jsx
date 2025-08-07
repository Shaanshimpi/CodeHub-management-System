import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { DataGrid } from '@mui/x-data-grid'
import { Button, Box, Typography, Chip } from '@mui/material'
import { getFees } from '../../store/slices/feeSlice'

const FeeList = () => {
  const dispatch = useDispatch()
  const { fees, loading } = useSelector(state => state.fees)
  const { user } = useSelector(state => state.auth)

  useEffect(() => {
    dispatch(getFees())
  }, [dispatch])

  const columns = [
    { field: 'studentName', headerName: 'Student', width: 200 },
    { field: 'courseName', headerName: 'Course', width: 200 },
    { field: 'amount', headerName: 'Amount', width: 120,
      valueFormatter: (params) => `₹${params.value.toLocaleString()}` },
    { field: 'dueDate', headerName: 'Due Date', width: 150,
      valueFormatter: (params) => new Date(params.value).toLocaleDateString() },
    { field: 'status', headerName: 'Status', width: 120,
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          color={
            params.value === 'paid' ? 'success' : 
            params.value === 'overdue' ? 'error' : 'warning'
          } 
        />
      ) },
    { field: 'paidDate', headerName: 'Paid Date', width: 150,
      valueFormatter: (params) => params.value ? new Date(params.value).toLocaleDateString() : '-' },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        params.row.status !== 'paid' && user?.role === 'sales_person' ? (
          <Button
            component={Link}
            to={`/fees/${params.row._id}/pay`}
            size="small"
            variant="contained"
          >
            Pay
          </Button>
        ) : null
      ),
    },
  ]

  const rows = fees.map(fee => ({
    _id: fee._id,
    studentName: fee.studentId.name,
    courseName: fee.courseId.name,
    amount: fee.amount,
    dueDate: fee.dueDate,
    status: fee.status,
    paidDate: fee.paidDate
  }))

  return (
    <Box sx={{ height: 600, width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4">Fee Records</Typography>
        {user?.role === 'sales_person' && (
          <Button component={Link} to="/fees/new" variant="contained">
            Add Fee Record
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

export default FeeList