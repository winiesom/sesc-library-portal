import React, {useState, useEffect} from 'react';
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

import { getAllBorrowedBooks } from '../../../slices/borrowed';
import { clearMessage } from  "../../../slices/message";



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
  { id: 'student', label: 'Student', align: 'left' },
  { id: 'num', label: 'Number of books', align: 'left' }
];


function createData(sn, student, num) {
  return { sn, student, num };
}


const Students = () => {
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(false);
  const [serverSuccess, setServerSuccess] = useState(false);
  const { message } = useSelector((state) => state.message);
  const { allBorrowed } = useSelector((state) => state.borrowedBooks);

  const dispatch = useDispatch();

  const getNumOfBooksPerStudent = Object.entries(allBorrowed !== null ? allBorrowed.data.reduce((acc, {account_id}) => {
    acc[account_id] = (acc[account_id] || 0) + 1;
    return acc;
  }, {}) : []).map(([student, count]) => ({ account: student, count }));

  
  useEffect(() => {
    dispatch(clearMessage());
    setLoading(true);
    dispatch(getAllBorrowedBooks())
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
  

  const rows = getNumOfBooksPerStudent !== null || getNumOfBooksPerStudent !== undefined || getNumOfBooksPerStudent !== "" ? getNumOfBooksPerStudent.map((row, i) => {
      return createData(
          i + 1,
          row.account,
          row.count
      )
  }) : [];

  return (
    <div>
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

export default Students;