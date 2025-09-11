import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { DataGrid } from '@mui/x-data-grid'
import { Button, Box, Typography, Chip, FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material'
import { getAttendance } from '../../store/slices/attendanceSlice'

const AttendanceList = () => {
  const dispatch = useDispatch()
  const { attendance, loading } = useSelector(state => state.attendance)
  const { user } = useSelector(state => state.auth)

  const [filters, setFilters] = useState({ batchSlot: '', startDate: '', endDate: '' })

  useEffect(() => {
    const params = { ...filters }
    if (user?.role === 'trainer') {
      params.trainerId = user._id
    }
    dispatch(getAttendance(params))
  }, [dispatch, user, filters])

  const batchOptions = [
    '06:00-07:00','07:00-08:00','08:00-09:00','09:00-10:00','10:00-11:00','11:00-12:00',
    '12:00-13:00','13:00-14:00','14:00-15:00','15:00-16:00','16:00-17:00','17:00-18:00',
    '18:00-19:00','19:00-20:00','20:00-21:00'
  ]

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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
        <Typography variant="h4">Attendance Records</Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel id="batchSlot-label">Batch</InputLabel>
            <Select
              labelId="batchSlot-label"
              value={filters.batchSlot}
              label="Batch"
              onChange={(e) => setFilters((prev) => ({ ...prev, batchSlot: e.target.value }))}
            >
              <MenuItem value=""><em>All Batches</em></MenuItem>
              {batchOptions.map((b) => (
                <MenuItem key={b} value={b}>{b}</MenuItem>
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