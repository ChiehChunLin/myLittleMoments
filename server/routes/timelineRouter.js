const router = require("express").Router();
const timeline = require("../controllers/timelineController");

router.get("/", timeline.timelineRender);
router.get("/firstFollow", timeline.firstFollowRender);

router.post("/firstFollow", timeline.firstFollowController);
router.post("/image", timeline.imageController);
router.post("/text", timeline.textController);
router.post("/health", timeline.healthController);

module.exports = router;
