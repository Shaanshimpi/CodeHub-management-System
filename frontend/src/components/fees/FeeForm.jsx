import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  TextField, Button, Box, Typography, Container, Alert, 
  MenuItem, Select, FormControl, InputLabel, CircularProgress
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { createFee, updateFee, getFee } from '../../store/slices/feeSlice';

const FeeForm = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentFee, loading, error } = useSelector(state => state.fees);
  const { students } = useSelector(state => state.students);
  const { courses } = useSelector(state => state.courses);
  
  const [formData, setFormData] = useState({
    studentId: '',
    courseId: '',
    amount: 0,
    dueDate: new Date(),
    notes: ''
  });

  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  useEffect(() => {
    if (id) {
      dispatch(getFee(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (currentFee && id) {
      setFormData({
        studentId: currentFee.studentId?._id || '',
        courseId: currentFee.courseId?._id || '',
        amount: currentFee.amount || 0,
        dueDate: new Date(currentFee.dueDate) || new Date(),
        notes: currentFee.notes || ''
      });
    }
  }, [currentFee, id]);

  useEffect(() => {
    if (error) {
      setFormError(typeof error === 'string' ? error : error.message || 'An error occurred');
    } else {
      setFormError('');
    }
  }, [error]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    try {
      const feeData = {
        ...formData,
        dueDate: formData.dueDate.toISOString()
      };
      
      if (id) {
        await dispatch(updateFee({ id, ...feeData }));
      } else {
        await dispatch(createFee(feeData));
      }

      if (!error) {
        setFormSuccess(id ? 'Fee updated successfully!' : 'Fee created successfully!');
        setTimeout(() => navigate('/fees'), 1500);
      }
    } catch (err) {
      setFormError(err.message || 'Failed to save fee');
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          {id ? 'Edit Fee Record' : 'Create Fee Record'}
        </Typography>
        
        {formError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {formError}
          </Alert>
        )}
        
        {formSuccess && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {formSuccess}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Student</InputLabel>
            <Select
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              label="Student"
              required
            >
              {students.map(student => (
                <MenuItem key={student._id} value={student._id}>
                  {student.userId?.name} - {student.studentId}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Course</InputLabel>
            <Select
              name="courseId"
              value={formData.courseId}
              onChange={handleChange}
              label="Course"
              required
            >
              {courses.map(course => (
                <MenuItem key={course._id} value={course._id}>
                  {course.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            margin="normal"
            required
            fullWidth
            type="number"
            label="Amount (₹)"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            inputProps={{ min: 0 }}
          />

          <DatePicker
            label="Due Date"
            value={formData.dueDate}
            onChange={(date) => setFormData({ ...formData, dueDate: date })}
            renderInput={(params) => (
              <TextField 
                {...params} 
                fullWidth 
                margin="normal" 
                required 
              />
            )}
          />

          <TextField
            margin="normal"
            fullWidth
            label="Notes"
            name="notes"
            multiline
            rows={4}
            value={formData.notes}
            onChange={handleChange}
          />

          <Box sx={{ mt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{ mr: 2 }}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {loading ? 'Processing...' : 'Save'}
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/fees')}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default FeeForm;