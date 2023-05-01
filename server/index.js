const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser")

require('dotenv').config();

const app = express();

const allowedOrigins = ['http://localhost:3000', 'http://localhost:3002', 'http://localhost:3004'];

let corsOptions = {
    origin: allowedOrigins,
    credentials: true
};


app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.get("/", (req, res) => {
res.json({ message: "Welcome to library portal microservice." });
});

const PORT = process.env.PORT || 8082;

const roles = require("./routes/role.routes");
app.use("/roles", roles);

const accounts = require("./routes/account.routes");
app.use("/accounts", accounts);

const login = require("./routes/auth.routes");
app.use("/login", login);

const books = require("./routes/book.routes");
app.use("/books", books);

const borrow = require("./routes/borrow.routes");
app.use("/borrow", borrow);

const returnBook = require("./routes/returnBook.routes");
app.use("/return", returnBook);



app.listen(PORT, () => {
console.log(`Server is running on port ${PORT}.`);
});
