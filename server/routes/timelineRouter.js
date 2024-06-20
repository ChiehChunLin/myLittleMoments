const router = require("express").Router();
const timeline = require("../controllers/timelineController");

router.get("/s3", timeline.timelineController);
router.post("/image", timeline.imageController);
router.post("/health", timeline.healthController);

module.exports = router;
