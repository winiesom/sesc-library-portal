const borrow = require("../controllers/borrow.controller");
const router = require("express").Router();

const authMiddleware = require('../middleware/auth');

router.get("/", authMiddleware, borrow.getAll);
router.get("/borrowed/", authMiddleware, borrow.getAllStudent);
router.post("/", authMiddleware, borrow.borrowBook);

module.exports = router;