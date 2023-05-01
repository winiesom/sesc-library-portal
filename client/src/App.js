import React, {useState, useEffect} from 'react'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from './components/login/Login'
import Layout from './components/layout/Layout';
import Books from './components/pages/Books';
import BookLoan from './components/bookLoan/BookLoan';
import NotFound from "./components/NotFound"

import { useSelector } from 'react-redux'

const App = () => {
  const [user, setUser] = useState(false);
  const { isLoggedIn } = useSelector((state) => state.auth);

  useEffect(() => {
    if(isLoggedIn) {
      setUser(true)
    }

  }, [isLoggedIn])


  const ProtectedRoute = ({children}) => {
    if (!user) {
      return <Navigate to="/" replace />;
    }
  
    return children;
  };

  return (
    <BrowserRouter>

    <Routes>
      <Route exact path="/" element={<Login />} />
      <Route path="/home" element={<ProtectedRoute user={user}><Layout /></ProtectedRoute>}>
        <Route path="books" element={<Books />} />
        <Route path="borrowed" element={<BookLoan />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
    </BrowserRouter>
  )
}

export default App
