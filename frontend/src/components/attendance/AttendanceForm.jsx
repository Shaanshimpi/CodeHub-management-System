import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  TextField, 
  Button, 
  Box, 
  Typography, 
  Container, 
  Alert, 
  MenuItem, 
  Select, 
  FormControl, 
  InputLabel,
  CircularProgress
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { createAttendance, updateAttendance, getAttendanceRecord } from '../../store/slices/attendanceSlice';
import { getStudent, getStudents } from '../../store/slices/studentSlice';

const AttendanceForm = ({ bulk }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentRecord, loading, error } = useSelector(state => state.attendance);
  const { user } = useSelector(state => state.auth);
  const [studentCourses, setStudentCourses] = useState([]);
  const { students } = useSelector(state => state.students);
  const [batchSlot, setBatchSlot] = useState('');
  const { courses } = useSelector(state => state.courses);

  useEffect(() => {
    dispatch(getStudents())
  }, [dispatch]);
  console.log("ssssss",students);
  const [formData, setFormData] = useState({
    studentId: '',
    courseId: '',
    date: new Date(),
    status: 'present',
    notes: ''
  });

  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  useEffect(() => {
    if (id) {
      dispatch(getAttendanceRecord(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (currentRecord && id) {
      setFormData({
        studentId: currentRecord.studentId?._id || '',
        courseId: currentRecord.courseId?._id || '',
        date: new Date(currentRecord.date),
        status: currentRecord.status || 'present',
        notes: currentRecord.notes || ''
      });
    }
  }, [currentRecord, id]);

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

  const handleStudentChange = (e) => {
    const selectedStudent = students.find(student => student._id === e.target.value);
    console.log("selectedStudent", selectedStudent);  
    setStudentCourses(selectedStudent?.assignedCourses || []);
    console.log("studentCourses", studentCourses);
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }

  const filteredStudents = students.filter((s) => {
    const trainerMatch = !user?._id || !s.assignedTrainer || s.assignedTrainer === user._id || s.assignedTrainer?._id === user._id
    const batchMatch = !batchSlot || s.batchSlot === batchSlot
    return trainerMatch && batchMatch
  })

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    try {
      const attendanceData = {
        ...formData,
        trainerId: user._id
      };

      if (id) {
        await dispatch(updateAttendance({ id, ...attendanceData }));
      } else {
        await dispatch(createAttendance(attendanceData));
      }

      if (!error) {
        setFormSuccess(id ? 'Attendance updated successfully!' : 'Attendance created successfully!');
        setTimeout(() => navigate('/attendance'), 1500);
      }
    } catch (err) {
      setFormError(err.message || 'Failed to save attendance');
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          {id ? 'Edit Attendance' : bulk ? 'Bulk Add Attendance' : 'Add Attendance'}
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
          {!bulk && (
            <>
              <FormControl fullWidth margin="normal">
                <InputLabel>Batch</InputLabel>
                <Select
                  name="batchSlot"
                  value={batchSlot}
                  onChange={(e) => setBatchSlot(e.target.value)}
                  label="Batch"
                >
                  <MenuItem value=""><em>All Batches</em></MenuItem>
                  {['06:00-07:00','07:00-08:00','08:00-09:00','09:00-10:00','10:00-11:00','11:00-12:00','12:00-13:00','13:00-14:00','14:00-15:00','15:00-16:00','16:00-17:00','17:00-18:00','18:00-19:00','19:00-20:00','20:00-21:00'].map((b) => (
                    <MenuItem key={b} value={b}>{b}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel>Student</InputLabel>
                <Select
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleStudentChange}
                  label="Student"
                  required
                >
                  {filteredStudents.map(student => (
                    <MenuItem key={student._id} value={student._id}>
                      {student.userId.name}
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
                >{console.log("studentCourses",studentCourses)}
                  {studentCourses.map(course => (
                    <MenuItem key={course._id} value={course._id}>
                      {course.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </>
          )}

          <DatePicker
            label="Date"
            value={formData.date}
            onChange={(date) => setFormData({ ...formData, date })}
            renderInput={(params) => (
              <TextField 
                {...params} 
                fullWidth 
                margin="normal" 
                required 
              />
            )}
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={formData.status}
              onChange={handleChange}
              label="Status"
              required
            >
              <MenuItem value="present">Present</MenuItem>
              <MenuItem value="absent">Absent</MenuItem>
              <MenuItem value="late">Late</MenuItem>
            </Select>
          </FormControl>

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
              onClick={() => navigate('/attendance')}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default AttendanceForm;