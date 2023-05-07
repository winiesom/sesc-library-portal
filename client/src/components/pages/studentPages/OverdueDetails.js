import React, { useState } from 'react';
import { useSelector } from "react-redux";

import { Dialog, Fab, Grid, ListItemIcon, MenuItem } from "@mui/material";

import { Close as CloseIcon, Info as InfoIcon } from '@mui/icons-material';

import Snackbars from "../../../assets/snackbar";

import "../../../styles/books.styles.css"
import "../../../styles/common.styles.css"

const OverdueDetails = ({row, invoiceRef}) => {
  const [open, setOpen] = useState(false);
  const [serverError, setServerError] = useState(false);
  const [success, setSuccess] = useState(false);
  const { message } = useSelector((state) => state.message);

  const handleClose = () => setOpen(false);
  const handleClickOpen = () => setOpen(true);
  const handleCloseSnack = () => setServerError(false);
  const handleSuccessClose = () => setSuccess(false);


  const generateInvoice = (n) => {
    let start_range = 10 ** (n - 1);
    let end_range = 10 ** n - 1;
    return Math.floor(Math.random() * (end_range - start_range + 1) + start_range);
  }

  const invoice = `INV${generateInvoice(9)}`;



  return (
    <div>
      <MenuItem
        disableRipple
        className="more-icon-menu"
        onClick={handleClickOpen}
      >
          <ListItemIcon>
          <InfoIcon className="more-icon" />
        </ListItemIcon>
      </MenuItem>
      <Snackbars
          variant="success"
          handleClose={handleSuccessClose}
          message={`Copy this unique reference: ${invoice}, then login on your finance portal to pay your fine`}
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
            <div className="table-title">Overdue</div>
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
            <div className="sub-title">Borrowed on:</div>
            <div className="sub-title-text">{row.created_at}</div>
          </Grid>
          <Grid item xs={12}>
            <div className="sub-title">Days overdue:</div>
            <div className="sub-title-text">{row.overdue}</div>
          </Grid>
          <Grid item xs={12}>
            <div className="sub-title">Fine</div>
            <div className="sub-title-text">{`$${row.fine}.00`}</div>
          </Grid>
          
        </Grid>
      </Dialog>

    </div>
  )
};

export default OverdueDetails;
