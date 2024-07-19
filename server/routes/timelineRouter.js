const router = require("express").Router();
const timeline = require("../controllers/timelineController");
const multer = require("multer");
const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("File is not an image"));
  }
};
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
});

router.get("/", timeline.timelineRender);
router.get("/profile", timeline.userProfileRender)

router.post("/firstFollow", timeline.firstFollowController);
router.post("/newBaby", upload.fields([
  { name: "babyFront", maxCount: 1 },
  { name: "babySide", maxCount: 1 },
  { name: "babyUpward", maxCount: 1 }]),timeline.newBabyController);
router.post("/updateBabyFace", upload.fields([
  { name: "babyFront", maxCount: 1 },
  { name: "babySide", maxCount: 1 },
  { name: "babyUpward", maxCount: 1 }]),timeline.updateBabyFaceController);
router.post("/updateBabyRole", timeline.updateBabyRoleController);
router.post("/uploadImage", upload.fields([{ name: "file", maxCount: 1 }]), timeline.uploadProfileImageToS3);
router.post("/health", timeline.babyDailyHealthData);
router.post("/babyProfile", timeline.babyTimelineTabsData);
router.post("/image/daily", timeline.babyDailyImagesData);

module.exports = router;
