import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { getStudent, updateStudent } from '../../store/slices/studentSlice'
import { Button, Box, Typography, Paper, Chip, Alert, Divider, Tab, Tabs } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import StudentAttendance from './StudentAttendance'
import StudentFees from './StudentFees'

const StudentDetail = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { currentStudent, loading, error } = useSelector(state => state.students)
  const { user } = useSelector(state => state.auth)
  const [activeTab, setActiveTab] = useState(0)
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState({
    status: '',
    assignedTrainer: '',
    trialEndDate: null
  })

  useEffect(() => {
    dispatch(getStudent(id))
  }, [id, dispatch])

  useEffect(() => {
    if (currentStudent) {
      setFormData({
        status: currentStudent.status,
        assignedTrainer: currentStudent.assignedTrainer,
        trialEndDate: new Date(currentStudent.trialEndDate)
      })
    }
  }, [currentStudent])

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async () => {
    await dispatch(updateStudent({ 
      id, 
      status: formData.status,
      assignedTrainer: formData.assignedTrainer,
      trialEndDate: formData.trialEndDate
    }))
    setEditMode(false)
  }

  const handleTrialDecision = async (decision) => {
    await dispatch(updateStudent({ 
      id, 
      decision 
    }))
  }

  if (!currentStudent) return <Typography>Loading...</Typography>

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4">
          {currentStudent.userId.name} - {currentStudent.studentId}
        </Typography>
        <Box>
          <Button onClick={() => navigate(-1)} sx={{ mr: 1 }}>Back</Button>
          {user?.role === 'sales_person' && (
            <Button 
              onClick={() => setEditMode(!editMode)}
              variant="contained"
            >
              {editMode ? 'Cancel' : 'Edit'}
            </Button>
          )}
        </Box>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
          <Box>
            <Typography variant="subtitle1">Contact Info</Typography>
            <Typography>Email: {currentStudent.userId.email}</Typography>
            <Typography>Phone: {currentStudent.userId.phone}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle1">Status</Typography>
            <Chip 
              label={currentStudent.status.toUpperCase()} 
              color={
                currentStudent.status === 'active' ? 'success' : 
                currentStudent.status === 'trial' ? 'warning' : 'error'
              } 
            />
          </Box>
          <Box>
            <Typography variant="subtitle1">Registration Fee</Typography>
            <Typography>
              {currentStudent.registrationFee.paid ? 'Paid' : 'Pending'}
              {currentStudent.registrationFee.paidDate && (
                ` on ${new Date(currentStudent.registrationFee.paidDate).toLocaleDateString()}`
              )}
            </Typography>
          </Box>
        </Box>

        {editMode && (
          <Box sx={{ mt: 3, p: 2, border: '1px solid #eee', borderRadius: 1 }}>
            <Typography variant="h6" gutterBottom>Edit Student</Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <DatePicker
                label="Trial End Date"
                value={formData.trialEndDate}
                onChange={(date) => setFormData({ ...formData, trialEndDate: date })}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              <Button onClick={() => setEditMode(false)}>Cancel</Button>
              <Button onClick={handleSubmit} variant="contained" disabled={loading}>
                Save Changes
              </Button>
            </Box>
          </Box>
        )}

        {currentStudent.status === 'trial' && currentStudent.registrationFee.paid && (
          <Box sx={{ mt: 3, p: 2, border: '1px solid #eee', borderRadius: 1 }}>
            <Typography variant="h6" gutterBottom>Trial Decision</Typography>
            <Typography sx={{ mb: 2 }}>
              Trial ends on {new Date(currentStudent.trialEndDate).toLocaleDateString()}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button 
                variant="contained" 
                color="success"
                onClick={() => handleTrialDecision('continue')}
              >
                Continue Enrollment
              </Button>
              <Button 
                variant="contained" 
                color="error"
                onClick={() => handleTrialDecision('discontinue')}
              >
                Discontinue
              </Button>
            </Box>
          </Box>
        )}
      </Paper>

      <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 2 }}>
        <Tab label="Attendance" />
        <Tab label="Fees" />
        <Tab label="Courses" />
      </Tabs>
      <Divider sx={{ mb: 3 }} />

      {activeTab === 0 && <StudentAttendance studentId={id} />}
      {activeTab === 1 && <StudentFees studentId={id} />}
      {activeTab === 2 && (
        <Box>
          <Typography variant="h6">Assigned Courses</Typography>
          {/* Course list implementation */}
        </Box>
      )}
    </Box>
  )
}

export default StudentDetail