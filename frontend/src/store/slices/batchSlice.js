import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import batchService from '../../api/batches';

export const getBatches = createAsyncThunk(
  'batches/getAll',
  async (_, { rejectWithValue }) => {
    try {
      return await batchService.getBatches();
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const batchSlice = createSlice({
  name: 'batches',
  initialState: {
    batches: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getBatches.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBatches.fulfilled, (state, action) => {
        state.loading = false;
        state.batches = action.payload;
      })
      .addCase(getBatches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default batchSlice.reducer;
