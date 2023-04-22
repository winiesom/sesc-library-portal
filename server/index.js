const express = require("express");
const cors = require("cors");

const app = express();

let corsOptions = {
origin: "http://localhost:8081"
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/", (req, res) => {
res.json({ message: "Welcome to library portal microservice." });
});

const PORT = process.env.PORT || 8082;

const roles = require("./routes/role.routes");
app.use("/roles", roles);

const accounts = require("./routes/account.routes");
app.use("/accounts", accounts);

app.listen(PORT, () => {
console.log(`Server is running on port ${PORT}.`);
});
