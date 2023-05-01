import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setMessage } from "./message";
import BooksService from "../services/book.service";

export const books = createAsyncThunk(
  "books/get",
  // async ({ page, pagesize, search }, thunkAPI) => {
  async ({ search }, thunkAPI) => {
    try {
      // const response = await BooksService.getBooks(page, pagesize, search);
      const response = await BooksService.getBooks(search);
      return response.data;
    } catch (error) {
      let message = error.response.data.message || error.response.statusText;
      
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue();
    }
  }
);

export const addBook = createAsyncThunk(
  "books/add",
  async ( newBook, thunkAPI) => {
    try {
      const response = await BooksService.addBook(newBook);
      return response.data
    } catch (error) {
      let message = error.response.data.message || error.response.statusText

      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue();
    }
  }
);

export const editBook = createAsyncThunk(
  "books/edit",
  async ({ book_id, isbn, title, author, year, copies, max_days }, thunkAPI) => {
    try {
      const response = await BooksService.editBook(
        book_id,
        isbn,
        title,
        author,
        year,
        copies,
        max_days
      );
      return response.data;
    } catch (error) {
      let message = error.response.data.message || error.response.statusText;

      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue();
    }
  }
);

export const deleteBook = createAsyncThunk(
  "books/edit",
  async ({ id }, thunkAPI) => {
    try {
      const response = await BooksService.deleteBook(id);
      return response.data;
    } catch (error) {
      let message = error.response.data.message || error.response.statusText;

      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue();
    }
  }
);




const initialState = {
  data: null,
  success: false
};
const booksSlice = createSlice({
  name: "books",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(books.fulfilled, (state, action) => {
      state.data = action.payload;
    });
    builder.addCase(books.rejected, (state, action) => {
      state.data = null;
    });
    builder.addCase(addBook.fulfilled, (state, action) => {
      state.success = true;
    });
    builder.addCase(addBook.rejected, (state, action) => {
      state.success = false;
    });
  },
});

const { reducer } = booksSlice;
export default reducer;
