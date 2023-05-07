import React, { useState, useEffect } from 'react';
import { ThreeDots } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import { Dialog, Fab, Grid, ListItemIcon, MenuItem } from "@mui/material";

import { ReadMore as ReadMoreIcon, Close as CloseIcon, Outbox as OutboxIcon } from '@mui/icons-material';
import {PuffSpinner} from '../../assets/spinner';

import Snackbars from "../../assets/snackbar";
import { CustomButton } from "../../assets/button";
import { Colors } from "../../assets/themes/colors";
import {books as getBooks} from '../../slices/books';

import {borrowBook, getBorrowedBooks} from "../../slices/borrowed";
import { clearMessage } from "../../slices/message";

import "../../styles/books.styles.css";
import "../../styles/common.styles.css";


const Borrow = ({row}) => {
  const [open, setOpen] = useState(false);
  const [serverError, setServerError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isbnValue, setIsbnValue] = useState({isbnNum: ""})
  const [isbnResult, setIsbnResult] = useState(null)
  const [isbnLoading, setIsbnLoading] = useState(false);
  const [isbnError, setIsbnError] = useState(false)
  const [borrowedState, setBorrowedState] = useState(false);
  const { message } = useSelector((state) => state.message);
  const { user } = useSelector((state) => state.auth);
  const borrowedBooks = useSelector((state) => state.borrowedBooks);
  const dispatch = useDispatch();
  const books = useSelector((state) => state.books.data);

  const handleClose = () => setOpen(false);
  const handleClickOpen = () => setOpen(true);
  const handleCloseSnack = () => setServerError(false);
  const handleSuccessClose = () => setSuccess(false);


  const handleSearchBook = async (e) => {
    const search = e.target.value;
    if (e.key === "Enter") {
      setIsbnLoading(true)
      try {
        const response = await books && books.data.rows !== 0 ? books.data.rows.find((row) => row.isbn === search) : []
        const res = await response
        const result = res !== "" || res !== undefined || res !== null || res !== [] ? res : [];
        const find_borrowed_book = borrowedBooks.borrowed.data && borrowedBooks.borrowed.data.map((borrowed) => {
          const book = books && books.data.rows.find((book) => book.id === borrowed.book_id);
          if(book) {
            return {
              bookId: borrowed.book_id,
              returned: borrowed.returned
            }
          } else {
            return null
          }
        }).filter(item => item !== null && item.returned === false);
        setIsbnLoading(false)

        if(find_borrowed_book) {
          const borrowedBook = find_borrowed_book.find(item => item.bookId === result.id)
          if(borrowedBook) {
            setBorrowedState(true)
          } else {
            setBorrowedState(false)
          }
        }
      
        if(result !== undefined) {
          setIsbnResult(result && result)
          setIsbnError(false)
        } else {
          setIsbnError(true)
        }
      } catch (error) {
        console.error(error);
      }
    }
  }


  useEffect(() => {
    dispatch(getBorrowedBooks())
  },[dispatch]);



  const handleBorrow = () => {
      setLoading(true);
      
      const borrowData = {
          "account_id": user && user.data.account_id,
          "book_id": isbnResult && isbnResult.id,
          "returned": false
      };

      dispatch(borrowBook({borrowData}))
      .then((data) => {
          setLoading(false);
          if(data.payload !== undefined) {
            dispatch(getBooks({search: ""}))
              setSuccess(true);
              setOpen(false);
              setIsbnResult(null)
              setIsbnValue({isbnNum: ""})
          }
      })
      .catch(() => {
          setLoading(false)
          setServerError(true)
      })
      setTimeout(() => {
          dispatch(clearMessage());
        }, 3000);
      return false
  }




  return (
    <div>

        <Snackbars
          variant="success"
          handleClose={handleSuccessClose}
          message="Borrowed Sucessfully"
          isOpen={success}
        />
          <Snackbars
          variant="error"
          handleClose={handleCloseSnack}
          message={message}
          isOpen={(message !== undefined && message !== "") || (serverError)}
        />
          <Snackbars
          variant="error"
          message="No book with such ISBN"
          isOpen={isbnError}
        />

      <MenuItem
        disableRipple
        className="more-icon-menu"
        onClick={handleClickOpen}
      >
          <ListItemIcon>
          <Fab
          size="small"
          aria-label="add"
          className="action-fab"
        >
          <OutboxIcon style={{width:20, height:20}} className="fab-icon" />
          </Fab>
        </ListItemIcon>
      </MenuItem>
   

      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        PaperProps={{
            sx:{
                width: "100%",
                height: "100%",
                maxWidth: 500,
                position: "absolute",
                right: 0,
                top: 0,
                padding: "50px 20px 20px 25px",
                "@media only screen and (max-width: 600px)": {
                maxWidth: "50%",
                }
            }
        }}
        data-aos="fade-in"
        data-aos-once="true"
      >
          <Fab
          size="small"
          aria-label="close"
          className="dialog-fab"
          onClick={handleClose}
        >
          <CloseIcon />
        </Fab>

        <Grid container spacing={0}>
          {/* <Grid item xs={12}>
            <div className="table-title">Book details</div>
          </Grid> */}
          <Grid item xs={12} className="textfield-custom-label">
              Enter ISBN
            </Grid>

            <Grid item xs={12}>
            <input 
             id="isbnNum"
             type="text"
             name="isbnNum"
             value={isbnValue.isbnNum}
             onChange={(e) => setIsbnValue({ ...isbnValue, isbnNum: e.target.value })}
             className="borrow-textfield-custom"
             onKeyPress={handleSearchBook}
             />
             </Grid>
          </Grid>

          {
            isbnLoading ? 
            <Grid item xs={12} className="table-tools-container">
            <PuffSpinner 
            height={50} 
            width={50} 
            color={Colors.primary}
            label='Loading...'
            />
            </Grid> : 
              
            isbnResult !== null && 

          <Grid container spacing={0}>

{
            !isbnError &&
            <div>

          <div className="borrow-container">
          <Grid item xs={12}>
            <div className="sub-title">Title</div>
            <div className="sub-title-text">{isbnResult !== null && isbnResult.title}</div>
          </Grid>
          <Grid item xs={12}>
            <div className="sub-title">Author</div>
            <div className="sub-title-text">{isbnResult !==null && isbnResult.author}</div>
          </Grid>
          <Grid item xs={12}>
            <div className="sub-title">Year</div>
            <div className="sub-title-text">{isbnResult !==null && isbnResult.year}</div>
          </Grid>
          <Grid item xs={12}>
            <div className="sub-title">Borrow up to?</div>
            <div className="sub-title-text">{`${isbnResult !==null && isbnResult.max_days} ${isbnResult !==null && isbnResult.max_days > 1 ? "days": "day"}`}</div>
          </Grid>
          </div>
          <Grid item xs={12}>
          <CustomButton
             variant="contained"
             sx={{ background: Colors.primary}}
             className="customBtn"
             endIcon={ <ReadMoreIcon />} 
             type="submit" 
             disabled={loading || borrowedState}
             onClick={handleBorrow}
            >
              {loading ? (
                <ThreeDots color="#2e3192" height={15} width={30} />
              ) : 
              borrowedState ? "Borrowed" : "Borrow"
              }
            </CustomButton>
          </Grid>
            </div>
            }

          </Grid>
          }

      </Dialog>

    </div>
  )
};

export default Borrow;
