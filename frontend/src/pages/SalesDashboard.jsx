import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import { getStudents } from '../store/slices/studentSlice';
import { getFees } from '../store/slices/feeSlice';
import StudentList from '../components/students/StudentList';

const SalesDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { students } = useSelector(state => state.students);
  const { fees } = useSelector(state => state.fees);

  useEffect(() => {
    if (user) {
      dispatch(getStudents({ salesPerson: user._id }));
      dispatch(getFees({ salesPerson: user._id }));
    }
  }, [dispatch, user]);

  const totalLeads = students.length;
  const activeStudents = students.filter(s => s.status === 'active').length;
  const trialStudents = students.filter(s => s.status === 'trial').length;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Sales Dashboard</Typography>
      
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Total Leads</Typography>
              <Typography variant="h5">{totalLeads}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Active Students</Typography>
              <Typography variant="h5">{activeStudents}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Trial Students</Typography>
              <Typography variant="h5">{trialStudents}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>My Leads</Typography>
          <StudentList />
        </CardContent>
      </Card>
    </Box>
  );
};

export default SalesDashboard;