const router = require("express").Router();
const {
  testS3Controller,
  testTimelineController
} = require("../controllers/adminController");

router.get("/s3", testS3Controller);
router.get("/timeline", testTimelineController);

module.exports = router;
