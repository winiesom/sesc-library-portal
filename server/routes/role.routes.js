const role = require("../controllers/role.controller");
const router = require("express").Router();

router.get("/", role.getAll);
router.post("/", role.createRole);

module.exports = router;