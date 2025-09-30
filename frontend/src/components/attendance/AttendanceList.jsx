import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { DataGrid } from '@mui/x-data-grid'
import { Button, Box, Typography, Chip, FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material'
import { getAttendance } from '../../store/slices/attendanceSlice'
import batchService from '../../api/batches'

const AttendanceList = () => {
  const dispatch = useDispatch()
  const { attendance, loading } = useSelector(state => state.attendance)
  const { user } = useSelector(state => state.auth)

  const [filters, setFilters] = useState({ batchId: '', startDate: '', endDate: '' })
  const [batches, setBatches] = useState([])

  useEffect(() => {
    const params = { ...filters }
    if (user?.role === 'trainer') {
      params.trainerId = user._id
    }
    dispatch(getAttendance(params))
  }, [dispatch, user, filters])

  useEffect(() => {
    (async () => {
      try {
        const all = await batchService.getBatches()
        setBatches(all)
      } catch (e) {}
    })()
  }, [])

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
  

  const rows = (attendance || []).map(record => ({
    _id: record._id,
    date: record.date,
    studentName: record.studentId?.studentId || 'N/A',
    courseName: record.courseId?.name || 'N/A',
    status: record.status,
    trainerName: record.trainerId?.name || 'N/A',
    notes: record.notes
  }))

  console.log("attendance", attendance)

  return (
    <Box sx={{ height: 600, width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
        <Typography variant="h4">Attendance Records</Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 220 }}>
            <InputLabel id="batchId-label">Batch</InputLabel>
            <Select
              labelId="batchId-label"
              value={filters.batchId}
              label="Batch"
              onChange={(e) => setFilters((prev) => ({ ...prev, batchId: e.target.value }))}
            >
              <MenuItem value=""><em>All Batches</em></MenuItem>
              {batches.map((b) => (
                <MenuItem key={b._id} value={b._id}>{b.name} ({b.slot})</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            type="date"
            size="small"
            label="From"
            InputLabelProps={{ shrink: true }}
            value={filters.startDate}
            onChange={(e) => setFilters((prev) => ({ ...prev, startDate: e.target.value }))}
          />
          <TextField
            type="date"
            size="small"
            label="To"
            InputLabelProps={{ shrink: true }}
            value={filters.endDate}
            onChange={(e) => setFilters((prev) => ({ ...prev, endDate: e.target.value }))}
          />
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

export default AttendanceList;