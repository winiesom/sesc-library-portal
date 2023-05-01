import React, {useState, useEffect} from 'react';
import { styled } from '@mui/material/styles';
import { Grid, Paper, Divider, Table, TableBody, TableContainer, TableHead, TableRow } from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import FolderOffIcon from '@mui/icons-material/FolderOff';


import {PuffSpinner} from '../../assets/spinner';
import {Colors} from '../../assets/themes/colors';
import Snackbars from "../../assets/snackbar";

import "../../styles/books.styles.css"
import "../../styles/common.styles.css"

import {useSelector, useDispatch} from 'react-redux';

import Borrow from './Borrow';
import {books as getBooks} from '../../slices/books';
import {getBorrowedBooks} from '../../slices/borrowed';
import { clearMessage } from  "../../slices/message";

import AddBook from './AddBook';
// import EditBook from './EditBook';
// import DeleteBook from './DeleteBook';


const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#cccccc",
    color: theme.palette.common.white,
    fontWeight: 600,
    
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    padding: 10,
    textAlign: "left"
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const columns = [
  { id: 'sn', label: 'SN', align: 'left' },
  { id: 'isbn', label: 'ISBN', align: 'left', minWidth: 170 },
  { id: 'title', label: 'Title', align: 'left', minWidth: 220 },
  { id: 'author', label: 'Author', align: 'left', minWidth: 170 },
  { id: 'year', label: 'Year', align: 'left' },
  { id: 'action', label: 'Action', align:'left' },
];
const adminColumns = [
  { id: 'sn', label: 'SN', align: 'left' },
  { id: 'isbn', label: 'ISBN', align: 'left', minWidth: 150 },
  { id: 'title', label: 'Title', align: 'left', minWidth: 200 },
  { id: 'author', label: 'Author', align: 'left', minWidth: 150 },
  { id: 'year', label: 'Year', align: 'left' },
  { id: 'copies', label: 'Copies', textAlign: "left"},
  // { id: 'action', label: 'Action', align:'left' },
];

function createData(sn, isbn, title, author, year, copies, action) {
  return { sn, isbn, title, author, year, copies, action };
}


const Books = () => {
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(false);
  const [serverSuccess, setServerSuccess] = useState(false);
  // const [page, setPage] = useState(0);
  // const [pagesize, setPagesize] = useState(10);
  const [search, setSearch] = useState("");
  const { message } = useSelector((state) => state.message);
  const { user } = useSelector((state) => state.auth);
  const books = useSelector((state) => state.books.data);
  const {borrowed} = useSelector((state) => state.borrowedBooks);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getBorrowedBooks())
  },[dispatch]);

  
  useEffect(() => {
    dispatch(clearMessage());
    setLoading(true);
    dispatch(getBooks({ search }))
      .unwrap()
      .then(() => {
        setLoading(false);
        setServerSuccess(true);
      })
      .catch(() => {
        setLoading(false);
        setServerSuccess(false);
        setServerError(true);
      });
  // }, [dispatch, page, pagesize, search]);
  }, [dispatch, search]);

  // useEffect(() => {
  //   dispatch(getBorrowedBooks())
  // },[dispatch]);

  // const handleChangePage = () => {
  //   let credentials = {
  //     pagesize,
  //     page: page + 1,
  //     search: search,
  //   };
  //   setLoading(true);
  //   dispatch(getBooks(credentials))
  //     .unwrap()
  //     .then(() => {
  //       setLoading(false);
  //     })
  //     .catch(() => {
  //       setLoading(false);
  //       setServerError(true);
  //     });
  // };

  // const getBorrowedBooksWithDetails = borrowed && borrowed.data.map((borrowed) => {
  //   const book = books && books.data.rows.find((book) => book.id === borrowed.book_id);
  //   if(book) {
  //     return borrowed
  //   } else {
  //     return null
  //   }
  // })

  // console.log(getBorrowedBooksWithDetails, 'getBorrowedBooksWithDetails in books')



  // const handleChangeRowsPerPage = (event) => {
  //   setPagesize(+event.target.value);
  //   setPage(0);
  // };
  

  const handleSearch = (e) => setSearch(e.target.value);

  const handleKeyUp = (e) => {
    if (e.keyCode === 13) {
      // dispatch(getBooks({ page, pagesize, search: e.target.value }));
      dispatch(getBooks({ search: e.target.value }));
      setSearch(e.target.value);
    }
  };

  const handleClick = (e) =>
    // dispatch(getBooks({ page, pagesize, search: e.target.value }));
    dispatch(getBooks({ search: e.target.value }));

  const handleCloseSnack = () => {
    setServerError(false);
    setServerSuccess(false);
  };

  

  const rows = books !== null ? books.data.rows !== 0 ? books.data.rows.map((row, i) => {
      return createData(
        i + 1,
        row.isbn,
        row.title,
        row.author,
        row.year,
        user && user.data.role_id === 1 ? row.copies : null,
        user && user.data.role_id === 2 ? <Borrow row={row} /> : ""
      );
    }): []
  : [];



  return (
    <div className="main-container">
      <Snackbars
          variant="error"
          handleClose={handleCloseSnack}
          message={message}
          isOpen={serverError}
      />

      <Snackbars
          variant="success"
          handleClose={handleCloseSnack}
          message="Successful"
          isOpen={serverSuccess}
      />
      
      <Grid container spacing={2}>
        { user && user.data.role_id === 1 ? 
        <Grid item xs={12} sm={12} md={4}> <div className="table-title">Books</div> </Grid> : 
        <Grid item xs={12} sm={12} md={6}> <div className="table-title">Books</div> </Grid> }
        
        { user && user.data.role_id === 1 ? 
        <Grid item xs={12} sm={12} md={4}>
          <input 
          type="search" 
          id="search" 
          name="search"
          value={search}
          onChange={handleSearch}
          placeholder="Search"
          onKeyUp={handleKeyUp}
          onClick={handleClick}
          className="book-search"
          />
        </Grid> : 
        <Grid item xs={12} sm={12} md={6}>
          <input 
          type="search" 
          id="search" 
          name="search"
          value={search}
          onChange={handleSearch}
          placeholder="Search"
          onKeyUp={handleKeyUp}
          onClick={handleClick}
          className="book-search"
          />
        </Grid> }
        
        { user && user.data.role_id === 1 ? 
        <Grid item xs={12} sm={12} md={4} display="flex" justifyContent="flex-end"> <AddBook /> </Grid> : "" }
        
        </Grid>
        
        { loading ? 
        <Grid item xs={12} className="table-tools-container">
          <PuffSpinner 
          height={50} 
          width={50} 
          color={Colors.primary}
          label='Loading...'
          />
        </Grid> : rows.length === 0 ? 
        <Grid item xs={12} className={`${"table-tools-container"} ${"table-title"}`}>
          <div>
            <FolderOffIcon className="table-no-record-icon" />
          </div>
          <div>No record found</div>
        </Grid> : 
        
        <Grid item xs={12}>
          <Paper className="table-paper">
          <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
          <TableHead>
          <StyledTableRow>
            {user && user.data.role_id === 1 ? adminColumns.map((column) => (
                <StyledTableCell
                key={column.id}
                align={column.align}
                style={{ minWidth: column.minWidth }}
              >
                {column.label}
              </StyledTableCell>
            )) : columns.map((column) => (
              <StyledTableCell
              key={column.id}
              align={column.align}
              style={{ minWidth: column.minWidth }}
            >
              {column.label}
            </StyledTableCell>
          ))}
          </StyledTableRow>
          </TableHead>

          <TableBody>
          {rows.map((row, index) => {
            return (
              <StyledTableRow hover key={index + 1}>
                {user && user.data.role_id === 1 ? adminColumns.map((column) => {
                   const value = row[column.id];
                    return (
                      <StyledTableCell
                       key={column.id}
                       align={column.align}
                       >
                       {value}
                      </StyledTableCell>
                      );
                }) : columns.map((column) => {
                  const value = row[column.id];
                   return (
                     <StyledTableCell
                      key={column.id}
                      align={column.align}
                      >
                      {value}
                     </StyledTableCell>
                     );
               })}
              </StyledTableRow>
                );
          })}
          </TableBody>
          </Table>
          </TableContainer>
          <Divider />
          {/* <TablePagination
          rowsPerPageOptions={[5, 10, 20, 50, 100]}
          component="div"
          count={books && books.count}
          rowsPerPage={pagesize}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          /> */}
          </Paper>
        </Grid>
      }

    </div>
  );
}

export default Books;