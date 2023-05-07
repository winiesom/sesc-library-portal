import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setMessage } from "./message";
import ExternalService from "../services/external.services";

export const generateInvoice = createAsyncThunk(
  "finance/invoice",
  async ({invoiceData}, thunkAPI) => {
    try {
      const response = await ExternalService.generateAnInvoice(invoiceData);
      return response.data;
    } catch (error) {
      let message;
      
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue();
    }
  }
);



const initialState = {
  success: false,
  invData: null
};
const externalSlice = createSlice({
  name: "external",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(generateInvoice.fulfilled, (state, action) => {
        state.success = true;
        state.invData = action.payload;
    });
    builder.addCase(generateInvoice.rejected, (state, action) => {
        state.success = false;
        state.invData = null;
    });
  },
});

const { reducer } = externalSlice;
export default reducer;
