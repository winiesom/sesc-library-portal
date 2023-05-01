import { combineReducers } from "redux";

import authReducer from "./auth";
import messageReducer from "./message";
import bookReducer from './books';
import borrowReducer from './borrowed';
import externalReducer from "./external";


const rootReducer = combineReducers({
  auth: authReducer,
  message: messageReducer,
  books: bookReducer,
  borrowedBooks: borrowReducer,
  external: externalReducer
});

export default rootReducer;
