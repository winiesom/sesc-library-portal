import api from "../api/api";


const getBooks = (search) => api.get(`books?search=${search}`);

const addBook = (newBook) => api.post("books", newBook);

const editBook = (book_id, isbn, title, author, year, copies, max_days) => api.put(`books/${book_id}`, {
    isbn,
    title,
    author,
    year,
    copies,
    max_days,
});

const deleteBook = (id) => api.delete(`books/${id}`);

const borrowABook = (borrowData) => api.post("borrow", borrowData);

const getBorrowedBooks = () => api.get("borrow/borrowed");

const getAllBorrowedBooks = () => api.get("borrow");

const returnABook = (returnData) => api.post("return", returnData);



const booksService = {
    getBooks,
    addBook,
    editBook,
    deleteBook,
    borrowABook,
    getBorrowedBooks,
    getAllBorrowedBooks,
    returnABook
};

export default booksService;
