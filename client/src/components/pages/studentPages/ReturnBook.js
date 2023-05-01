import React, {useState, useEffect, useMemo} from 'react';
import { ThreeDots } from "react-loader-spinner";

import { useDispatch, useSelector } from "react-redux";

import { Dialog, Fab, Grid, ListItemIcon, MenuItem } from "@mui/material";

import { 
  Close as CloseIcon, 
  KeyboardReturn as KeyboardReturnIcon,
  AssignmentReturned as AssignmentReturnedIcon 
} from '@mui/icons-material';

import Snackbars from "../../../assets/snackbar";
import { CustomButton } from "../../../assets/button"
import { Colors } from "../../../assets/themes/colors"
import { getBorrowedBooks } from '../../../slices/borrowed';

import { clearMessage } from "../../../slices/message";
import { returnBook } from "../../../slices/borrowed";
import { generateInvoice } from "../../../slices/external";

import "../../../styles/books.styles.css"
import "../../../styles/common.styles.css"




const ReturnBook = ({row}) => {
  const [open, setOpen] = useState(false);
  const [serverError, setServerError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [invoiceDetails, setInvoiceDetails] = useState(null);
  const { message } = useSelector((state) => state.message);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const handleClose = () => setOpen(false);
  const handleClickOpen = () => setOpen(true);
  const handleCloseSnack = () => setServerError(false);
  const handleSuccessClose = () => setSuccess(false);

  function generateUniqueReference() {
    let data = '';
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const lettersLength = letters.length;
    for (let i = 0; i < 7; i++) {
        data += letters.charAt(Math.floor(Math.random() * lettersLength));
    }

    // check if the string is unique
    if (uniqueStrings.has(data)) {
      // if not, generate a new string recursively
      return generateUniqueReference();
    } else {
      // add the string to the set of unique strings
      uniqueStrings.add(data);
      return data;
    }
  }
  
  // initialize an empty set to store unique strings
  const uniqueStrings = new Set();
  
  // generate a unique string
  const uniqueString = generateUniqueReference();
  
const handleReturn = () => {
    setLoading(true);

    const returnData = {
        "account_id": user && user.data.account_id,
        "book_id": row.bookId,
        "returned": true
    }

    const invoiceData = {
        "account_id": user && user.data.account_id,
        "amount": row.fine,
        "type": 2,
        "reference": uniqueString,
        "paid": false,
        "book_id": row.bookId,
        "course_id": null
    }


    if(row.fine === "") {
        dispatch(returnBook({returnData}))
        .then((data) => {
            setLoading(false);
            if(data.payload !== undefined) {
                setSuccess(true);
                dispatch(getBorrowedBooks())
                setOpen(false);
            }
        })
        .catch((error) => {
            setLoading(false)
            setServerError(true)
        })
        setTimeout(() => {
            dispatch(clearMessage());
        }, 3000);
        return false
    } else {

        dispatch(generateInvoice({invoiceData}))
        .then((data) => {
            setLoading(false);
            if(data.payload !== undefined) {
                setSuccess(true);
                setInvoiceDetails(data.payload)
                setTimeout(() => {
                dispatch(returnBook({returnData}))
                .then((data) => {

                    setLoading(false);
                    if(data.payload !== undefined) {
                        setSuccess(true);
                        dispatch(getBorrowedBooks())
                        setOpen(false);
                    }
                })
                .catch((error) => {
                    setLoading(false)
                    setServerError(true)
                })
                setTimeout(() => {
                    dispatch(clearMessage());
                }, 3000);
                return false
            }, 3000);
            }
        })
        .catch((error) => {
            setServerError(true)
        })
        setTimeout(() => {
            dispatch(clearMessage());
        }, 3000);

        return false
    }
}


  return (
    <div>
      <MenuItem
        disableRipple
        className="more-icon-menu"
        onClick={handleClickOpen}
      >
          <ListItemIcon>
          <AssignmentReturnedIcon className="more-icon" />
        </ListItemIcon>
      </MenuItem>
      <Snackbars
          variant="success"
          handleClose={handleSuccessClose}
          message={invoiceDetails && invoiceDetails.data.reference !== null ? `An invoice with reference: ${invoiceDetails && invoiceDetails.data.reference} has been generated for you. please login to your finance portal and pay your fine` : "Successfully returned"}
          isOpen={success}
          autoHide={8000}
        />
      {/* <Snackbars
          variant="success"
          handleClose={handleSuccessClose}
          message= "Successfully returned"
          isOpen={success}
        /> */}

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
            <div className="table-title">Return Book</div>
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
            <div className="sub-title">Maximum days to borrow book:</div>
            <div className="sub-title-text">{row.max_days}</div>
          </Grid>
          <Grid item xs={12}>
            <div className="sub-title">Borrowed:</div>
            <div className="sub-title-text">{row.created_at}</div>
          </Grid>
          {
              row.days_left !== "" &&
              <Grid item xs={12}>
            <div className="sub-title">Days left:</div>
            <div className="sub-title-text">{row.days_left}</div>
          </Grid>
          }
          {
              row.overdue !== "" &&
          <Grid item xs={12}>
            <div className="sub-title">Days overdue:</div>
            <div className="sub-title-text">{row.overdue}</div>
          </Grid>
          }
          {
              row.fine !== "" &&
          <Grid item xs={12}>
            <div className="sub-title">Fine</div>
            <div className="sub-title-text">{`$${row.fine}`}</div>
          </Grid>
          }

        <Grid item xs={12}>
          <CustomButton
             variant="contained"
             sx={{ background: Colors.primary}}
             className="customBtn"
             endIcon={ <KeyboardReturnIcon />} 
             type="submit" 
             disabled={loading || success}
             onClick={handleReturn}
            >
              {loading ? (
                <ThreeDots color="#2e3192" height={15} width={30} />
              ) : "Return book"
              }
            </CustomButton>
          </Grid>
          
        </Grid>
      </Dialog>

    </div>
  )
};

export default ReturnBook;
