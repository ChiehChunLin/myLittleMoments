const router = require("express").Router();
const admin = require("../controllers/adminController");

router.get("/lineUserList", admin.lineUserList)
router.post("/newBaby", admin.newBaby)

module.exports = router;
