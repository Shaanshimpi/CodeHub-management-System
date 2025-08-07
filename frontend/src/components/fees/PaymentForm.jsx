import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  TextField, Button, Box, Typography, Container, Alert, 
  MenuItem, Select, FormControl, InputLabel, CircularProgress
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { recordPayment, getFee } from '../../store/slices/feeSlice';

const PaymentForm = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentFee, loading, error } = useSelector(state => state.fees);
  
  const [formData, setFormData] = useState({
    paidDate: new Date(),
    paymentMethod: 'cash',
    transactionId: ''
  });

  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  useEffect(() => {
    dispatch(getFee(id));
  }, [id, dispatch]);

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
      await dispatch(recordPayment({ 
        feeId: id, 
        ...formData 
      }));

      if (!error) {
        setFormSuccess('Payment recorded successfully!');
        setTimeout(() => navigate('/fees'), 1500);
      }
    } catch (err) {
      setFormError(err.message || 'Failed to record payment');
    }
  };

  if (!currentFee) return <Typography>Loading...</Typography>;

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Record Payment
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

        <Box sx={{ mb: 3, p: 2, border: '1px solid #eee', borderRadius: 1 }}>
          <Typography variant="h6">Fee Details</Typography>
          <Typography>Student: {currentFee.studentId?.name}</Typography>
          <Typography>Course: {currentFee.courseId?.name}</Typography>
          <Typography>Amount: ₹{currentFee.amount?.toLocaleString()}</Typography>
          <Typography>Due Date: {new Date(currentFee.dueDate).toLocaleDateString()}</Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit}>
          <DatePicker
            label="Payment Date"
            value={formData.paidDate}
            onChange={(date) => setFormData({ ...formData, paidDate: date })}
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
            <InputLabel>Payment Method</InputLabel>
            <Select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              label="Payment Method"
              required
            >
              <MenuItem value="cash">Cash</MenuItem>
              <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
              <MenuItem value="upi">UPI</MenuItem>
              <MenuItem value="cheque">Cheque</MenuItem>
              <MenuItem value="card">Credit/Debit Card</MenuItem>
            </Select>
          </FormControl>

          <TextField
            margin="normal"
            fullWidth
            label="Transaction ID/Reference"
            name="transactionId"
            value={formData.transactionId}
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
              {loading ? 'Processing...' : 'Record Payment'}
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

export default PaymentForm;