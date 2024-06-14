const router = require("express").Router();
const { testS3Controller } = require("../controllers/adminController");

router.get("/s3", testS3Controller);

module.exports = router;
