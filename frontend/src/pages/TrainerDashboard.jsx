import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Paper, Grid, Button, Card, CardContent, List, ListItem, ListItemText, Divider } from '@mui/material';
import { Link } from 'react-router-dom';
import { getStudents } from '../store/slices/studentSlice';
import { getBatches } from '../store/slices/batchSlice';

const TrainerDashboard = () => {
  const dispatch = useDispatch();
  const { students } = useSelector(state => state.students);
  const { batches } = useSelector(state => state.batches);
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    if (user) {
      dispatch(getStudents({ trainerId: user._id }));
      dispatch(getBatches({ trainerId: user._id }));
    }
  }, [dispatch, user]);

  const assignedStudentsCount = students.length;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Trainer Dashboard</Typography>
      
      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Assigned Students</Typography>
              <Typography variant="h5">{assignedStudentsCount}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Assigned Batches</Typography>
              <Typography variant="h5">{batches.length}</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Quick Actions</Typography>
              <Button 
                component={Link} 
                to="/attendance/new" 
                variant="contained" 
                fullWidth
                sx={{ mb: 1 }}
              >
                Mark Attendance
              </Button>
              <Button 
                component={Link} 
                to="/attendance/bulk" 
                variant="outlined" 
                fullWidth
              >
                Bulk Attendance
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* My Batches List */}
        <Grid item xs={12} md={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>My Batches</Typography>
              <List>
                {batches.map((batch, index) => (
                  <div key={batch._id}>
                    <ListItem>
                      <ListItemText 
                        primary={batch.name} 
                        secondary={`Slot: ${batch.slot} | Students: ${students.filter(s => s.batchId === batch._id).length}`}
                      />
                      <Button component={Link} to={`/batches/${batch._id}/students`} size="small">View Students</Button>
                    </ListItem>
                    {index < batches.length - 1 && <Divider />}
                  </div>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TrainerDashboard;
