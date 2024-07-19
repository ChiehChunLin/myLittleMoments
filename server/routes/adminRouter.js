const router = require("express").Router();
const admin = require("../controllers/adminController");

router.get("/lineUserList", admin.lineUserList)

module.exports = router;
