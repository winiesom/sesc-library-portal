const book = require("../controllers/book.controller");
const router = require("express").Router();

const authMiddleware = require('../middleware/auth');

router.get("/", authMiddleware, book.getAll);
router.post("/", authMiddleware, book.addBook);

module.exports = router;