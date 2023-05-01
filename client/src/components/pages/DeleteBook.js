import React, { useState } from 'react';
import { ThreeDots } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import { Dialog, Grid } from "@mui/material";
import {  Delete as DeleteIcon } from '@mui/icons-material';

import Snackbars from "../../assets/snackbar";
import { CustomButton } from "../../assets/button"
import { Colors } from "../../assets/themes/colors"

import { deleteBook, books as getBooks } from "../../slices/books"
import { clearMessage } from "../../slices/message";

import "../../styles/books.styles.css"
import "../../styles/common.styles.css"


const DeleteBook = ({row}) => {
  const [open, setOpen] = useState(false);
  const [serverError, setServerError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { message } = useSelector((state) => state.message);
  const dispatch = useDispatch();

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleCloseSnack = () => setServerError(false);
  const handleSuccessClose = () => setSuccess(false);

  const handleDelete = () => {
    setLoading(true);

    const id = row.id;

    dispatch(deleteBook({ id }))
      .unwrap()
      .then(() => {
        setSuccess(true);
        setLoading(false);
        setOpen(false);
        dispatch(getBooks({ page: 0, pagesize: 10, search: "" }));
      })
      .catch(() => {
        setServerError(true);
        setLoading(false);
      });
      setTimeout(() => {
        dispatch(clearMessage());
      }, 3000);
      return false;
  };

  return (
    <div>
       <Snackbars
          variant="success"
          handleClose={handleSuccessClose}
          message="Deleted Sucessfully"
          isOpen={success}
        />
        <Snackbars
          variant="error"
          handleClose={handleCloseSnack}
          message={message}
          isOpen={(message !== undefined && message !== "") || (serverError)}
        />
      <div onClick={handleClickOpen}>
        <DeleteIcon className="action-icon" color="error" />
      </div>
        
        <Dialog 
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: "100%",
            padding: "25px",
            "@media only screen and (min-width: 600px)": {
              width: 400,
            },
          },
        }}
        data-aos="fade-in"
        data-aos-once="true"
        >
          
       

        <div>
          <div className="dialog-title">Delete Record?</div>
          <Grid container spacing={2}>
            <Grid item xs={12}>
            <div className="warning">
                {" "}
                You are about to delete this book:{" "}
                <strong>
                  <div style={{ margin: "10px 0"}}>
                  {`${row["isbn"]}`} 
                  <br />
                  {`${row["title"]}`} 
                  <br />
                  {`${row["author"]}`}
                  </div>
                </strong>{" "}
                You {`can’t`} undo this action afterwards.
              </div>
            </Grid>

            <Grid item xs={12}>
              <div className="button-flex">
                <CustomButton
                  onClick={handleClose}
                  variant="contained"
                  className="customBtn-del"
                  sx={{ background: Colors.grey, marginRight:2}}
                  disabled={loading}
                >
                  Cancel
                </CustomButton>
                <CustomButton
                variant="contained"
                sx={{ background: Colors.buttonError}}
                className="customBtn-del"
                endIcon={ <DeleteIcon />} 
                onClick={handleDelete}
                disabled={loading}
                >
                  {loading ? (
                    <ThreeDots
                      type="ThreeDots"
                      color={Colors.light}
                      height={15}
                      width={30}
                    />
                  ) : (
                    "Proceed"
                  )}
                </CustomButton>
              </div>
            </Grid>
            </Grid>
        </div>
      </Dialog>
    </div>
  )
};

export default DeleteBook;
