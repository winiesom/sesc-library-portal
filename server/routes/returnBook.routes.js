const returnBook = require("../controllers/returnBook.controller");
const router = require("express").Router();

const authMiddleware = require('../middleware/auth');

router.get("/", authMiddleware, returnBook.getAll);
router.get("/returned/", authMiddleware, returnBook.getAllStudent);
router.post("/", authMiddleware, returnBook.returnBook);

module.exports = router;