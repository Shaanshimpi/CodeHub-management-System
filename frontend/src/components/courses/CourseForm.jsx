import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { TextField, Button, Box, Typography, Container, Alert, MenuItem, Select, FormControl, InputLabel, Chip } from '@mui/material'
import { createCourse, updateCourse, getCourse } from '../../store/slices/courseSlice'

const CourseForm = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { currentCourse, loading, error } = useSelector(state => state.courses)
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: 12,
    totalFees: 0,
    installments: [],
    isActive: true
  })
  const [installment, setInstallment] = useState({
    amount: 0,
    dueWeek: 1
  })

  useEffect(() => {
    if (id) {
      dispatch(getCourse(id))
    }
  }, [id, dispatch])

  useEffect(() => {
    if (currentCourse && id) {
      setFormData({
        name: currentCourse.name,
        description: currentCourse.description,
        duration: currentCourse.duration,
        totalFees: currentCourse.totalFees,
        installments: currentCourse.installments,
        isActive: currentCourse.isActive
      })
    }
  }, [currentCourse, id])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleInstallmentChange = (e) => {
    setInstallment({
      ...installment,
      [e.target.name]: Number(e.target.value)
    })
  }

  const addInstallment = () => {
    if (installment.amount > 0 && installment.dueWeek > 0) {
      setFormData({
        ...formData,
        installments: [...formData.installments, installment]
      })
      setInstallment({ amount: 0, dueWeek: 1 })
    }
  }

  const removeInstallment = (index) => {
    const newInstallments = [...formData.installments]
    newInstallments.splice(index, 1)
    setFormData({
      ...formData,
      installments: newInstallments
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (id) {
      await dispatch(updateCourse({ id, ...formData }))
    } else {
      await dispatch(createCourse(formData))
    }
    
    if (!error) {
      navigate('/courses')
    }
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          {id ? 'Edit Course' : 'Create Course'}
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Course Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Description"
            name="description"
            multiline
            rows={4}
            value={formData.description}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            type="number"
            label="Duration (weeks)"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            type="number"
            label="Total Fees (₹)"
            name="totalFees"
            value={formData.totalFees}
            onChange={handleChange}
          />
          
          <Typography variant="h6" sx={{ mt: 3 }}>Installments</Typography>
          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <TextField
              label="Amount"
              name="amount"
              type="number"
              value={installment.amount}
              onChange={handleInstallmentChange}
            />
            <TextField
              label="Due Week"
              name="dueWeek"
              type="number"
              value={installment.dueWeek}
              onChange={handleInstallmentChange}
            />
            <Button 
              variant="outlined" 
              onClick={addInstallment}
              sx={{ height: '56px' }}
            >
              Add Installment
            </Button>
          </Box>
          
          <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {formData.installments.map((inst, index) => (
              <Chip
                key={index}
                label={`₹${inst.amount} at week ${inst.dueWeek}`}
                onDelete={() => removeInstallment(index)}
              />
            ))}
          </Box>
          
          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select
              name="isActive"
              value={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.value })}
              label="Status"
            >
              <MenuItem value={true}>Active</MenuItem>
              <MenuItem value={false}>Inactive</MenuItem>
            </Select>
          </FormControl>
          
          <Box sx={{ mt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{ mr: 2 }}
            >
              {loading ? 'Saving...' : 'Save'}
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/courses')}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  )
}

export default CourseForm