import React, {useState, useEffect, useMemo} from 'react';
import { ThreeDots } from "react-loader-spinner";

import { useDispatch, useSelector } from "react-redux";

import { Dialog, Fab, Grid, ListItemIcon, MenuItem } from "@mui/material";

import { 
  ReadMore as ReadMoreIcon, 
  Close as CloseIcon, 
  Outbox as OutboxIcon 
} from '@mui/icons-material';

import Snackbars from "../../assets/snackbar";
import { CustomButton } from "../../assets/button"
import { Colors } from "../../assets/themes/colors"

import {borrowBook, getBorrowedBooks} from "../../slices/borrowed"
import { clearMessage } from "../../slices/message";

import "../../styles/books.styles.css"
import "../../styles/common.styles.css"




const Borrow = ({row}) => {
  const [open, setOpen] = useState(false);
  const [serverError, setServerError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [borrowedState, setBorrowedState] = useState(false);
  const { message } = useSelector((state) => state.message);
  const { user } = useSelector((state) => state.auth);
  const borrowedBooks = useSelector((state) => state.borrowedBooks);
  const dispatch = useDispatch();
  const handleClose = () => setOpen(false);
  const handleClickOpen = () => setOpen(true);
  const handleCloseSnack = () => setServerError(false);
  const handleSuccessClose = () => setSuccess(false);

  useEffect(() => {
    dispatch(getBorrowedBooks())
  },[dispatch]);

 useMemo(() => {
    const myBorrowedBooks = borrowedBooks.borrowed.data ? borrowedBooks.borrowed.data.find(book => book.book_id === row.id) : [];
    if(myBorrowedBooks !== undefined && row.id === myBorrowedBooks.book_id && myBorrowedBooks.returned === false) {
      setBorrowedState(true)
    }
}, [borrowedBooks,row.id]);

  const handleBorrow = () => {
      setLoading(true);
      
      const borrowData = {
          "account_id": user && user.data.account_id,
          "book_id": row.id,
          "returned": false
      };

      dispatch(borrowBook({borrowData}))
      .then((data) => {
          setLoading(false);
          if(data.payload !== undefined) {
              setSuccess(true);
              setOpen(false);
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
      <MenuItem
        disableRipple
        className="more-icon-menu"
        onClick={handleClickOpen}
      >
          <ListItemIcon>
          <OutboxIcon className="more-icon" />
        </ListItemIcon>
      </MenuItem>
      <Snackbars
          variant="success"
          handleClose={handleSuccessClose}
          message="Borrowed Sucessfully"
          isOpen={success}
        />

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
                padding: "50px 20px 20px 35px",
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

        <Snackbars
          variant="error"
          handleClose={handleCloseSnack}
          message={message}
          isOpen={(message !== undefined && message !== "") || (serverError)}
        />
        

        <Grid container spacing={0}>
          <Grid item xs={12}>
            <div className="table-title">Book details</div>
          </Grid>
          <Grid item xs={12}>
            <div className="sub-title">ISBN</div>
            <div className="sub-title-text">{row.isbn}</div>
          </Grid>
          <Grid item xs={12}>
            <div className="sub-title">Title</div>
            <div className="sub-title-text">{row.title}</div>
          </Grid>
          <Grid item xs={12}>
            <div className="sub-title">Author</div>
            <div className="sub-title-text">{row.author}</div>
          </Grid>
          <Grid item xs={12}>
            <div className="sub-title">Year</div>
            <div className="sub-title-text">{row.year}</div>
          </Grid>
          <Grid item xs={12}>
            <div className="sub-title">Borrow up to?</div>
            <div className="sub-title-text">{`${row.max_days} ${row.max_days > 1 ? "days": "day"}`}</div>
          </Grid>
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
        </Grid>
      </Dialog>

    </div>
  )
};

export default Borrow;
