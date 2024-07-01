const router = require("express").Router();
const user = require("../controllers/userController");
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

router.get("/", user.homeRender);
router.get("/authCheck", user.userCheckAuth);
router.get("/lineCallback", user.lineCallback);
router.get("/login", user.loginRender);
router.post("/login", user.loginController);
router.post("/signup", user.signupController);
router.get("/logout", user.logoutController);

router.get("/validBaby", timeline.recognizeBabyFace);
router.post("/validBaby", upload.fields([{ name: "file", maxCount: 1 }]),timeline.recognizeBabyFace);

module.exports = router;
