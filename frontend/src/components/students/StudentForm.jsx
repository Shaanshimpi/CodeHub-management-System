import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  TextField, Button, Box, Typography, Container, Alert, 
  MenuItem, Select, FormControl, InputLabel, CircularProgress,
  Chip
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { createStudent, updateStudent, getStudent } from '../../store/slices/studentSlice';
import { getCourses } from '../../store/slices/courseSlice';
import { getUsers } from '../../store/slices/userSlice';

const StudentForm = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { courses, loading: coursesLoading } = useSelector(state => state.courses);
  const navigate = useNavigate();
  const { error, currentStudent, loading } = useSelector(state => state.students);
  const { user } = useSelector(state => state.auth);
  const { users } = useSelector(state => state.users);
  
  const trainers = users.filter(user => user.role === 'trainer');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    assignedCourses: [],
    assignedTrainer: '',
    trialStartDate: new Date(),
    trialEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  useEffect(() => {
    dispatch(getUsers());
    dispatch(getCourses());
  }, [dispatch]);

  useEffect(() => {
    if (id) {
      dispatch(getStudent(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (currentStudent && id) {
      setFormData({
        name: currentStudent.userId?.name || '',
        email: currentStudent.userId?.email || '',
        phone: currentStudent.userId?.phone || '',
        password: '',
        assignedCourses: currentStudent.assignedCourses || [],
        assignedTrainer: currentStudent.assignedTrainer || '',
        trialStartDate: new Date(currentStudent.trialStartDate) || new Date(),
        trialEndDate: new Date(currentStudent.trialEndDate) || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });
    }
  }, [currentStudent, id]);

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
      if (id) {
        // Update existing student
        await dispatch(updateStudent({ 
          id, 
          ...formData,
          trialStartDate: formData.trialStartDate.toISOString(),
          trialEndDate: formData.trialEndDate.toISOString()
        }));
      } else {
        // Create new student
        await dispatch(createStudent({
          ...formData,
          trialStartDate: formData.trialStartDate.toISOString(),
          trialEndDate: formData.trialEndDate.toISOString()
        }));
      }

      setFormSuccess(id ? 'Student updated successfully!' : 'Student created successfully!');
      setTimeout(() => navigate('/students'), 1500);
    } catch (err) {
      setFormError(err.message || 'Failed to save student');
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          {id ? 'Edit Student' : 'Create Student'}
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
          <TextField
            margin="normal"
            required
            fullWidth
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            disabled={!!id}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />

          {!id && (
            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
            />
          )}

          <FormControl fullWidth margin="normal">
            <InputLabel>Assigned Courses</InputLabel>
            <Select
              name="assignedCourses"
              multiple
              value={formData.assignedCourses}
              onChange={(e) => setFormData({ ...formData, assignedCourses: e.target.value })}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((courseId) => {
                    const course = courses.find(c => c._id === courseId);
                    return course ? <Chip key={courseId} label={course.name} /> : null;
                  })}
                </Box>
              )}
            >
              {coursesLoading ? (
                <MenuItem disabled>Loading courses...</MenuItem>
              ) : (
                courses.map((course) => (
                  <MenuItem key={course._id} value={course._id}>
                    {course.name}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Assigned Trainer</InputLabel>
            <Select
              name="assignedTrainer"
              value={formData.assignedTrainer}
              onChange={handleChange}
              label="Assigned Trainer"
            >
              {trainers.map((trainer) => (
                <MenuItem key={trainer._id} value={trainer._id}>
                  {trainer.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
            <DatePicker
              label="Trial Start Date"
              value={formData.trialStartDate}
              onChange={(date) => setFormData({ ...formData, trialStartDate: date })}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
            <DatePicker
              label="Trial End Date"
              value={formData.trialEndDate}
              onChange={(date) => setFormData({ ...formData, trialEndDate: date })}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </Box>

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
              onClick={() => navigate('/students')}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default StudentForm;