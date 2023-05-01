import React, {useState, useEffect} from 'react';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { ThreeDots } from "react-loader-spinner";
import { TextField } from "../../assets/textfields";

import { useDispatch, useSelector } from "react-redux";

import { Dialog, Fab, Grid } from "@mui/material";

import { Close as CloseIcon, Edit as EditIcon, DownloadDone as DownloadDoneIcon } from '@mui/icons-material';

import Snackbars from "../../assets/snackbar";
import { CustomButton } from "../../assets/button"
import { Colors } from "../../assets/themes/colors"

import { editBook, books as getBooks } from "../../slices/books"
import { clearMessage } from "../../slices/message";

import "../../styles/books.styles.css"
import "../../styles/common.styles.css"




const EditBook = ({row}) => {
  const [open, setOpen] = useState(false);
  const [serverError, setServerError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { message } = useSelector((state) => state.message);
  const dispatch = useDispatch();

  const currentYear = new Date().getFullYear();

  const handleClose = () => setOpen(false);
  const handleClickOpen = () => setOpen(true);
  const handleCloseSnack = () => setServerError(false);
  const handleSuccessClose = () => setSuccess(false);


   // form validation rules
   const validationSchema = Yup.object().shape({
    isbn: Yup.string().required("ISBN is required"),
    title: Yup.string().required("Title is required"),
    author: Yup.string().required("Author is required"),
    year: Yup.string().required("Year is required"),
    copies: Yup.string().required("Number of copies is required"),
    max_days: Yup.string().required("Enter maximum lending days"),
    });

    const formOptions = { resolver: yupResolver(validationSchema) };

    // get functions to build form with useForm() hook
    const {
      register,
      handleSubmit,
      formState: { errors },
      reset,
      setValue
    } = useForm(formOptions);

    useEffect(() => {
      setValue("isbn", row && row.isbn);
      setValue("title", row && row.title);
      setValue("author", row && row.author);
      setValue("year", row && row.year);
      setValue("copies", row && row.copies);
      setValue("max_days", row && row.max_days);
    }, [row, setValue])

    const onSubmit = (data) => {
      const { isbn, title, author, year, copies, max_days } = data;
      setLoading(true);
      
      const book_id = row.id;

      dispatch(editBook({ book_id, isbn, title, author, year, copies, max_days }))
      .then((data) => {
        setLoading(false);
        if (data.payload !== undefined) {
          setOpen(false);
          dispatch(getBooks({ page: 0, pagesize: 10, search: "" }))
          reset();
        }
      })
      .catch(() => {
        setLoading(false);
      });
      setTimeout(() => {
        dispatch(clearMessage());
      }, 3000);
      return false;
    };
    
    
  return (
    <div>
      <Snackbars variant="success" handleClose={handleSuccessClose} message="Edited Sucessfully" isOpen={success} />
      <Snackbars variant="error" handleClose={handleCloseSnack} message={message} isOpen={(message !== undefined && message !== "") || (serverError)} />
      
      <div onClick={handleClickOpen}>
          <EditIcon className="action-icon" color="primary"  />
      </div>

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
        <Fab size="small" aria-label="close" className="dialog-fab" onClick={handleClose}>
          <CloseIcon />
        </Fab>

        
        <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={0} className="textfield-grid-container">
          <Grid item xs={12} sx={{marginLeft: 1}}>
            <div className="table-title">Book details</div>
          </Grid>

          <Grid item xs={12}>
            <TextField 
              id="isbn"
              htmlFor="isbn"
              label="ISBN"
              name="isbn"
              className="textfield"
              error={errors.isbn ? true : false}
              helper={errors.isbn?.message}
              register={register}
              disabled={loading}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField 
              id="title"
              htmlFor="title"
              label="Title"
              name="title"
              className="textfield"
              error={errors.title ? true : false}
              helper={errors.title?.message}
              register={register}
              disabled={loading}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField 
              id="author"
              htmlFor="author"
              label="Author"
              name="author"
              className="textfield"
              error={errors.author ? true : false}
              helper={errors.author?.message}
              register={register}
              disabled={loading}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField 
              id="year"
              htmlFor="year"
              label="Year"
              name="year"
              className="textfield"
              type="number"
              min="1990"
              max={currentYear}
              error={errors.year ? true : false}
              helper={errors.year?.message}
              register={register}
              disabled={loading}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField 
              id="copies"
              htmlFor="copies"
              label="Copies"
              name="copies"
              className="textfield"
              type="number"
              error={errors.copies ? true : false}
              helper={errors.copies?.message}
              register={register}
              disabled={loading}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField 
              id="max_days"
              htmlFor="max_days"
              label="Maximum lending days"
              name="max_days"
              className="textfield"
              type="number"
              error={errors.max_days ? true : false}
              helper={errors.max_days?.message}
              register={register}
              disabled={loading}
            />
          </Grid>


          <Grid item xs={12}>
          <CustomButton
             variant="contained"
             sx={{ background: Colors.primary}}
             className="customBtn"
             endIcon={ <DownloadDoneIcon />} 
             type="submit" 
             disabled={loading}
            >
              {loading ? (
                <ThreeDots color="#2e3192" height={15} width={30} />
              ) : 
              "Edit book"
              }
            </CustomButton>
          </Grid>
        </Grid>
        </form>
          
      </Dialog>

    </div>
  )
};

export default EditBook;
