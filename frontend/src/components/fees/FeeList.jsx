import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { DataGrid } from '@mui/x-data-grid'
import { Button, Box, Typography, Chip, Select, MenuItem, FormControl, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'
import { getFees, updateFeeStatus } from '../../store/slices/feeSlice'

const FeeList = () => {
  const dispatch = useDispatch()
  const { fees, loading } = useSelector(state => state.fees)
  const { user } = useSelector(state => state.auth)
  const [statusDialog, setStatusDialog] = useState({ open: false, feeId: null, currentStatus: '' })
  const [newStatus, setNewStatus] = useState('')

  useEffect(() => {
    dispatch(getFees())
  }, [dispatch])

  const handleStatusChange = (feeId, currentStatus) => {
    setStatusDialog({ open: true, feeId, currentStatus })
    setNewStatus(currentStatus)
  }

  const handleStatusUpdate = () => {
    if (newStatus !== statusDialog.currentStatus) {
      dispatch(updateFeeStatus({ id: statusDialog.feeId, status: newStatus }))
    }
    setStatusDialog({ open: false, feeId: null, currentStatus: '' })
    setNewStatus('')
  }

  const columns = [
    { field: 'studentName', headerName: 'Student', width: 200 },
    { field: 'courseName', headerName: 'Course', width: 200 },
    { field: 'amount', headerName: 'Amount', width: 120,
      valueFormatter: (params) => `₹${params.value.toLocaleString()}` },
    { field: 'dueDate', headerName: 'Due Date', width: 150,
      valueFormatter: (params) => new Date(params.value).toLocaleDateString() },
    { field: 'status', headerName: 'Status', width: 150,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip 
            label={params.value} 
            color={
              params.value === 'paid' ? 'success' : 
              params.value === 'overdue' ? 'error' : 'warning'
            } 
          />
          {(user?.role === 'admin' || user?.role === 'sales_person' || user?.role === 'super_admin') && (
            <Button
              size="small"
              variant="outlined"
              onClick={() => handleStatusChange(params.row._id, params.value)}
            >
              Change
            </Button>
          )}
        </Box>
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
    studentName: fee.studentId?.userId?.name || 'N/A',
    courseName: fee.courseId?.name || 'N/A',
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
      
      {/* Status Change Dialog */}
      <Dialog open={statusDialog.open} onClose={() => setStatusDialog({ open: false, feeId: null, currentStatus: '' })}>
        <DialogTitle>Change Fee Status</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <Select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              displayEmpty
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="paid">Paid</MenuItem>
              <MenuItem value="overdue">Overdue</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialog({ open: false, feeId: null, currentStatus: '' })}>
            Cancel
          </Button>
          <Button onClick={handleStatusUpdate} variant="contained">
            Update Status
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default FeeList