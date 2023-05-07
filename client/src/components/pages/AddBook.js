import React, {useState, useEffect} from 'react';
import axios from 'axios';
import moment from "moment";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { ThreeDots } from "react-loader-spinner";
import { TextField } from "../../assets/textfields";
import {PuffSpinner} from '../../assets/spinner';


import { useDispatch, useSelector } from "react-redux";

import {
    Dialog,
    Fab,
    Grid,
    ListItemIcon,
    MenuItem,
  } from "@mui/material";

import { 
  Close as CloseIcon, 
  Add as AddIcon,
  DownloadDone as DownloadDoneIcon
} from '@mui/icons-material';

import Snackbars from "../../assets/snackbar";
import { CustomButton } from "../../assets/button"
import { Colors } from "../../assets/themes/colors"

import { addBook, books as getBooks } from "../../slices/books"
import { clearMessage } from "../../slices/message";

import "../../styles/books.styles.css"
import "../../styles/common.styles.css"




const AddBook = () => {
  const [isbnValue, setIsbnValue] = useState({isbnNum: ""})
  const [isbnResult, setIsbnResult] = useState(null)
  const [bookIsbn, setBookIsbn] = useState([])
  const [open, setOpen] = useState(false);
  const [serverError, setServerError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isbnLoading, setIsbnLoading] = useState(false);
  const { message } = useSelector((state) => state.message);
  const dispatch = useDispatch();

  const handleClose = () => setOpen(false);
  const handleClickOpen = () => setOpen(true);
  const handleCloseSnack = () => setServerError(false);
  const handleSuccessClose = () => setSuccess(false);


  //  form validation rules
   const validationSchema = Yup.object().shape({
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

    const handleSearchBook = async (e) => {
      const search = e.target.value;
      setBookIsbn(search)
      if (e.key === "Enter") {
        setIsbnLoading(true)
        try {
          const response = await axios.get(`http://openlibrary.org/api/books?bibkeys=ISBN:${search}&jscmd=details&format=json`)
          const res = await response
          const result = res !== "" || res !== undefined || res !== null || res !== [] ? res : []
          setIsbnLoading(false)
          setIsbnResult(result && result.data[`ISBN:${search}`].details)
        } catch (error) {
          console.error(error);
        }
      }
    }

  

    useEffect(() => {
      if (isbnResult && isbnResult !== null ) {
        setValue("isbn", bookIsbn);
        setValue("title", isbnResult !== null && isbnResult.title);
        setValue("author", isbnResult !== null && isbnResult.authors ? isbnResult.authors[0].name : isbnResult.publishers[0]);
        setValue("year", isbnResult !== null && moment(isbnResult.publish_date).format('YYYY'));
      }
    }, [isbnResult, bookIsbn, setValue]);
    
    const onSubmit = (data) => {
      const { title, author, year, copies, max_days } = data;
      setLoading(true);
    
      const newBook = {
        isbn: isbnValue.isbnNum,
        title,
        author,
        year,
        copies,
        max_days
      };
    
      dispatch(addBook(newBook))
        .then((data) => {
          setLoading(false);
          if (data.payload !== undefined) {
            setOpen(false);
            setIsbnValue({isbnNum: ""})
            setIsbnResult(null)
            reset();
            dispatch(getBooks({ search: "" }))
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
      <Snackbars
        variant="success"
        handleClose={handleSuccessClose}
        message="Added Sucessfully"
        isOpen={success}
      />
      <Snackbars
        variant="error"
        handleClose={handleCloseSnack}
        message={message}
        isOpen={(message !== undefined && message !== "") || (serverError)}
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
          <AddIcon className="fab-icon"  />
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

          <Grid container spacing={0} className="textfield-grid-container">
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
             className="textfield-custom"
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
<form onSubmit={handleSubmit(onSubmit)}>
<Grid container spacing={0} className="textfield-grid-container">

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
    "Add book"
    }
  </CustomButton>
</Grid>

</Grid>
</form>
 }
</Dialog>
</div>
  )
};

export default AddBook;
