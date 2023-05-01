import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setMessage } from "./message";
import BooksService from "../services/book.service";


export const borrowBook = createAsyncThunk(
  "books/borrow",
  async ({ borrowData }, thunkAPI) => {
    try {
      const response = await BooksService.borrowABook(borrowData);
      return response.data
    } catch (error) {
      let message = error.response.data.message || error.response.statusText

      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue();
    }
  }
);

export const getBorrowedBooks = createAsyncThunk(
  "books/getborrowedbooks",
  async (thunkAPI) => {
    try {
      const response = await BooksService.getBorrowedBooks();
      return response.data
    } catch (error) {
      let message = error.response.data.message || error.response.statusText

      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue();
    }
  }
);

export const getAllBorrowedBooks = createAsyncThunk(
  "books/getAllborrowedbooks",
  async (thunkAPI) => {
    try {
      const response = await BooksService.getAllBorrowedBooks();
      return response.data
    } catch (error) {
      let message = error.response.data.message || error.response.statusText

      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue();
    }
  }
)

export const returnBook = createAsyncThunk(
  "books/return",
  async ({ returnData }, thunkAPI) => {
    try {
      const response = await BooksService.returnABook(returnData);
      return response.data
    } catch (error) {
      let message = error.response.data.message || error.response.statusText

      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue();
    }
  }
);



const initialState = {
  success: false,
  borrowed: null,
  allBorrowed: null,
  returnSuccess: false
};
const borrowedSlice = createSlice({
  name: "borrowed",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(borrowBook.fulfilled, (state, action) => {
      state.success = true;
    });
    builder.addCase(borrowBook.rejected, (state, action) => {
      state.success = false;
    });
    builder.addCase(getBorrowedBooks.fulfilled, (state, action) => {
      state.borrowed = action.payload;
    });
    builder.addCase(getBorrowedBooks.rejected, (state, action) => {
      state.borrowed = null;
    });
    builder.addCase(getAllBorrowedBooks.fulfilled, (state, action) => {
      state.allBorrowed = action.payload;
    });
    builder.addCase(getAllBorrowedBooks.rejected, (state, action) => {
      state.allBorrowed = null;
    });

    builder.addCase(returnBook.fulfilled, (state, action) => {
      state.returnSuccess = true;
    });
    builder.addCase(returnBook.rejected, (state, action) => {
      state.returnSuccess = false;
    });
  },
});

const { reducer } = borrowedSlice;
export default reducer;
