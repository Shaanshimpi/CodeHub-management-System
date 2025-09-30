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
  CircularProgress,
  Checkbox,
  ListItemText
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { createAttendance, updateAttendance, getAttendanceRecord, createBulkAttendance } from '../../store/slices/attendanceSlice';
import batchService from '../../api/batches';
import { getStudents } from '../../store/slices/studentSlice';
import { getCourses } from '../../store/slices/courseSlice';

const AttendanceForm = ({ bulk }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentRecord, loading, error } = useSelector(state => state.attendance);
  const { user } = useSelector(state => state.auth);
  const [studentCourses, setStudentCourses] = useState([]);
  const { students } = useSelector(state => state.students);
  const [batchId, setBatchId] = useState('');
  const [batches, setBatches] = useState([]);
  const { courses } = useSelector(state => state.courses);

  useEffect(() => {
    dispatch(getStudents())
    dispatch(getCourses())
    ;(async () => {
      try {
        const all = await batchService.getBatches();
        setBatches(all);
      } catch (e) {
        console.error('[AttendanceForm] failed to fetch batches', e);
      }
    })()
  }, [dispatch]);

  const [formData, setFormData] = useState({
    studentId: [],
    courseId: '',
    date: new Date(),
    status: 'present',
    notes: ''
  });

  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  useEffect(() => {
    if (id && !bulk) {
      dispatch(getAttendanceRecord(id));
    }
  }, [id, dispatch, bulk]);

  useEffect(() => {
    if (currentRecord && id && !bulk) {
      setFormData({
        studentId: [currentRecord.studentId?._id || ''],
        courseId: currentRecord.courseId?._id || '',
        date: new Date(currentRecord.date),
        status: currentRecord.status || 'present',
        notes: currentRecord.notes || ''
      });
    }
  }, [currentRecord, id, bulk]);

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
    const { target: { value } } = e;
    const selectedStudentIds = typeof value === 'string' ? value.split(',') : value;

    let commonCourses = [];
    if (selectedStudentIds.length > 0) {
        const firstStudent = students.find(s => s._id === selectedStudentIds[0]);
        if (firstStudent) {
            commonCourses = firstStudent.assignedCourses;
            for (let i = 1; i < selectedStudentIds.length; i++) {
                const nextStudent = students.find(s => s._id === selectedStudentIds[i]);
                if (nextStudent) {
                    commonCourses = commonCourses.filter(course => nextStudent.assignedCourses.some(nc => nc._id === course._id));
                }
            }
        }
    }
    setStudentCourses(commonCourses);

    setFormData({
      ...formData,
      studentId: selectedStudentIds
    });
  }

  const filteredStudents = students.filter((s) => {
    const isTrainer = user?.role === 'trainer';
    const trainerMatch = isTrainer
      ? (!s.assignedTrainer || s.assignedTrainer === user._id || s.assignedTrainer?._id === user._id)
      : true;
    const batchMatch = !batchId || (s.batchId && (s.batchId === batchId || s.batchId?._id === batchId))
    return trainerMatch && batchMatch
  })

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    try {
      if (bulk) {
        const bulkData = {
          batchId: batchId,
          courseId: formData.courseId,
          date: formData.date,
          status: formData.status,
          notes: formData.notes
        };
        await dispatch(createBulkAttendance(bulkData));
      } else if (id) {
        const attendanceData = {
          ...formData,
          studentId: formData.studentId[0],
          trainerId: user._id
        };
        await dispatch(updateAttendance({ id, ...attendanceData }));
      } else {
        const records = formData.studentId.map(studentId => ({ studentId }));
        await dispatch(createBulkAttendance({
            records,
            courseId: formData.courseId,
            date: formData.date,
            status: formData.status,
            notes: formData.notes
        }));
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
          {bulk ? (
            <>
              <FormControl fullWidth margin="normal">
                <InputLabel>Batch</InputLabel>
                <Select
                  name="batchId"
                  value={batchId}
                  onChange={(e) => setBatchId(e.target.value)}
                  label="Batch"
                  required
                >
                  {batches.map((b) => (
                    <MenuItem key={b._id} value={b._id}>{b.name} ({b.slot})</MenuItem>
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
            </>
          ) : (
            <>
              <FormControl fullWidth margin="normal">
                <InputLabel>Batch</InputLabel>
                <Select
                  name="batchId"
                  value={batchId}
                  onChange={(e) => setBatchId(e.target.value)}
                  label="Batch"
                >
                  <MenuItem value=""><em>All Batches</em></MenuItem>
                  {batches.map((b) => (
                    <MenuItem key={b._id} value={b._id}>{b.name} ({b.slot})</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel>Student</InputLabel>
                <Select
                  name="studentId"
                  multiple
                  value={formData.studentId}
                  onChange={handleStudentChange}
                  label="Student"
                  required
                  renderValue={(selected) => selected.map(id => students.find(s => s._id === id)?.userId.name).join(', ' )}
                >
                  {filteredStudents.length === 0 && (
                    <MenuItem value="" disabled>
                      No students available for selected filter
                    </MenuItem>
                  )}
                  {filteredStudents.map(student => (
                    <MenuItem key={student._id} value={student._id}>
                      <Checkbox checked={formData.studentId.indexOf(student._id) > -1} />
                      <ListItemText primary={student.userId.name} />
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