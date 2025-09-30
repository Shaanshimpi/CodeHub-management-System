import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import { getStudents } from '../../store/slices/studentSlice';
import { getCourses } from '../../store/slices/courseSlice';
import { getBatches } from '../../store/slices/batchSlice';
import { getFees } from '../../store/slices/feeSlice';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const dispatch = useDispatch();
  const { students } = useSelector(state => state.students);
  const { courses } = useSelector(state => state.courses);
  const { batches } = useSelector(state => state.batches);
  const { fees } = useSelector(state => state.fees);

  useEffect(() => {
    dispatch(getStudents());
    dispatch(getCourses());
    dispatch(getBatches());
    dispatch(getFees());
  }, [dispatch]);

  const totalStudents = students.length;
  const totalCourses = courses.length;
  const totalBatches = batches.length;
  const totalFees = fees.reduce((acc, fee) => acc + fee.amount, 0);

  const studentsPerBatch = batches.map(batch => ({
    name: batch.name,
    studentCount: students.filter(student => student.batchId?._id === batch._id).length
  }));

  const chartData = {
    labels: studentsPerBatch.map(batch => batch.name),
    datasets: [
      {
        label: 'Number of Students',
        data: studentsPerBatch.map(batch => batch.studentCount),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Students
              </Typography>
              <Typography variant="h5">
                {totalStudents}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Courses
              </Typography>
              <Typography variant="h5">
                {totalCourses}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Batches
              </Typography>
              <Typography variant="h5">
                {totalBatches}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Fees Collected
              </Typography>
              <Typography variant="h5">
                {`₹${totalFees.toLocaleString()}`}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Students per Batch
              </Typography>
              <Bar data={chartData} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
