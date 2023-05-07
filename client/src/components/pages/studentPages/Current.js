import React, {useState, useEffect} from 'react';
import moment from 'moment';
import { styled } from '@mui/material/styles';
import { Grid, Divider, Table, TableBody, TableContainer, TableHead, TableRow } from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import FolderOffIcon from '@mui/icons-material/FolderOff';


import {PuffSpinner} from '../../../assets/spinner';
import {Colors} from '../../../assets/themes/colors';
import Snackbars from "../../../assets/snackbar";

import "../../../styles/books.styles.css"
import "../../../styles/common.styles.css"

import {useSelector, useDispatch} from 'react-redux';

import { getBorrowedBooks } from '../../../slices/borrowed';
import { clearMessage } from  "../../../slices/message";

import ReturnBook from './ReturnBook'



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
  { id: 'isbn', label: 'ISBN', align: 'left', minWidth: 180 },
  { id: 'author', label: 'Author', align: 'left', minWidth: 150 },
  { id: 'title', label: 'Title', align: 'left', minWidth: 240 },
  { id: 'year', label: 'Year', align: 'left' },
  { id: 'borrowed', label: 'Borrowed', align: 'left', minWidth: 150 },
  { id: 'returnbook', label: 'Return', align: 'left', minWidth: 150 },
];


function createData(sn, isbn, author, title, year, borrowed, returnbook) {
  return { sn, isbn, author, title, year, borrowed, returnbook };
}


const Current = () => {
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(false);
  const [serverSuccess, setServerSuccess] = useState(false);
  const { message } = useSelector((state) => state.message);
  const { borrowed } = useSelector((state) => state.borrowedBooks);
  const books = useSelector((state) => state.books.data.data.rows);

  const dispatch = useDispatch();

  const ago = "ago"

  moment.updateLocale('en', {
    relativeTime: {
      future: `in %s`,
      past: `%s ${ago}`,
      s: `a few seconds ${ago}`,
      ss: `%d seconds ${ago}`,
      m: `%d minute ${ago}`,
      mm: `%d minutes ${ago}`,
      h: `%d hour ${ago}`,
      hh: `%d hours ${ago}`,
      d: `%d day ${ago}`,
      dd: `%d days  ${ago}`,
      w: `%d week ${ago}`,
      ww: `%d weeks ${ago}`,
      M: `%d month ${ago}`,
      MM: `%d months ${ago}`,
      y: `%d year ${ago}`,
      yy: `%d years ${ago}`
    }
  });

  const getBorrowedBooksWithDetails = borrowed && borrowed.data.map((borrowed) => {
    const book = books && books.find((book) => book.id === borrowed.book_id);
    if(book) {

        const createdAt = moment(borrowed.createdAt).fromNow(true);
        const dateBorrowed = moment(borrowed.createdAt);
        const today = moment();
        const difference = today.diff(dateBorrowed, 'days');
        const max_days = book.max_days;

        const daysLeft = max_days - difference;
        const overDue = difference - max_days

        return {
            bookId: borrowed.book_id,
            title: book.title,
            author: book.author,
            isbn: book.isbn,
            year: book.year,
            max_days: book.max_days,
            returned: borrowed.returned,
            created_at: createdAt,
            overdue: borrowed.returned === false && difference > max_days ? overDue : "",
            days_left: borrowed.returned === false && difference <= max_days ? daysLeft : "",
            fine: borrowed.returned === false && difference > max_days ? 30.00 : "",
        };
    } else {
        return null
    }
  }).filter(item => item !== null && item.returned === false);
    
  
  useEffect(() => {
    dispatch(clearMessage());
    setLoading(true);
    dispatch(getBorrowedBooks())
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
  }, [dispatch]);


  const handleCloseSnack = () => {
    setServerError(false);
    setServerSuccess(false);
  };
  

  const rows = getBorrowedBooksWithDetails !== null || getBorrowedBooksWithDetails !== undefined || getBorrowedBooksWithDetails !== "" ? getBorrowedBooksWithDetails.map((row, i) => {
          return createData(
              i + 1,
              row.isbn,
              row.author,
              row.title,
              row.year,
              row.created_at,
              <ReturnBook row={row} />

          )
  }) : [];


  return (
    <div>
      <Snackbars
          variant="error"
          handleClose={handleCloseSnack}
          message={message || "Network error"}
          isOpen={serverError}
      />

      <Snackbars
          variant="success"
          handleClose={handleCloseSnack}
          message="Successful"
          isOpen={serverSuccess}
      />
      
      <Grid container spacing={0}>
        
        { loading ? 
        <Grid item xs={12} className="table-tools-container-tab">
          <PuffSpinner 
          height={50} 
          width={50} 
          color={Colors.primary}
          label='Loading...'
          />
        </Grid> : rows.length === 0 ? 
        <Grid item xs={12} className={`${"table-tools-container-tab"} ${"table-title"}`}>
          <div>
            <FolderOffIcon className="table-no-record-icon" />
          </div>
          <div className="table-no-record-text">No record found</div>
        </Grid> : 
        
        <Grid item xs={12}>
          {/* <Paper className="table-paper"> */}
          <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
          <TableHead>
          <StyledTableRow>
            {columns.map((column) => (
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
                {columns.map((column) => {
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
          {/* </Paper> */}
        </Grid>
      }
</Grid>
    </div>
  );
}

export default Current;