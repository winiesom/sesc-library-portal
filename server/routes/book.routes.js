const book = require("../controllers/book.controller");
const router = require("express").Router();

const authMiddleware = require('../middleware/auth');

router.get("/", authMiddleware, book.getAll);
router.post("/", authMiddleware, book.addBook);
router.put("/:id", authMiddleware, book.updateBook);
router.delete("/:id", authMiddleware, book.deleteBook);

module.exports = router;