const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser")

require('dotenv').config();

const app = express();

let corsOptions = {
    origin: "*"
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



app.listen(PORT, () => {
console.log(`Server is running on port ${PORT}.`);
});
