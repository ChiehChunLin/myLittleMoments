const router = require("express").Router();
const timeline = require("../controllers/timelineController");

router.get("/", timeline.validBabyFaceController);

module.exports = router;