const router = require("express").Router();
const admin = require("../controllers/adminController");

router.get("/s3", admin.testS3Controller);
router.get("/timeline", admin.testTimelineController);
router.get("/plot", admin.testDailyPlot);

router.get("/lineUserList", admin.lineUserList)
router.post("/newBaby", admin.newBaby)

module.exports = router;
