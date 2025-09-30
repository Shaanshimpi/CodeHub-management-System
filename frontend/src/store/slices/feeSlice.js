import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import feeService from '../../api/fee';

export const getFees = createAsyncThunk(
  'fees/getAll',
  async (_, { rejectWithValue }) => {
    try {
      return await feeService.getFees();
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getStudentFees = createAsyncThunk(
  'fees/getStudentFees',
  async (studentId, { rejectWithValue }) => {
    try {
      return await feeService.getStudentFees(studentId);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getFee = createAsyncThunk(
  'fees/getOne',
  async (id, { rejectWithValue }) => {
    try {
      return await feeService.getFee(id);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createFee = createAsyncThunk(
  'fees/create',
  async (feeData, { rejectWithValue }) => {
    try {
      return await feeService.createFee(feeData);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateFee = createAsyncThunk(
  'fees/update',
  async ({ id, ...feeData }, { rejectWithValue }) => {
    try {
      return await feeService.updateFee(id, feeData);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const recordPayment = createAsyncThunk(
  'fees/recordPayment',
  async ({ feeId, ...paymentData }, { rejectWithValue }) => {
    try {
      return await feeService.recordPayment(feeId, paymentData);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const feeSlice = createSlice({
  name: 'fees',
  initialState: {
    fees: [],
    currentFee: null,
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFees.fulfilled, (state, action) => {
        state.loading = false;
        state.fees = action.payload;
      })
      .addCase(getFees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getStudentFees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStudentFees.fulfilled, (state, action) => {
        state.loading = false;
        state.fees = action.payload;
      })
      .addCase(getStudentFees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getFee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFee.fulfilled, (state, action) => {
        state.loading = false;
        state.currentFee = action.payload;
      })
      .addCase(getFee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createFee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createFee.fulfilled, (state, action) => {
        state.loading = false;
        state.fees.push(action.payload);
      })
      .addCase(createFee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateFee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFee.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.fees.findIndex(fee => fee._id === action.payload._id);
        if (index !== -1) {
          state.fees[index] = action.payload;
        }
      })
      .addCase(updateFee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(recordPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(recordPayment.fulfilled, (state, action) => {
        state.loading = false;
        // Optionally update the fee in the fees array if needed
        const index = state.fees.findIndex(fee => fee._id === action.payload._id);
        if (index !== -1) {
          state.fees[index] = action.payload;
        }
        state.currentFee = action.payload; // Update currentFee as well
      })
      .addCase(recordPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default feeSlice.reducer;
