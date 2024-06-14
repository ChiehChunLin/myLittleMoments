const router = require("express").Router();
const {
  homeRender,
  loginRender,
  loginController,
  signupController,
  logoutController
} = require("../controllers/userController");

router.get("/", homeRender);
router.get("/login", loginRender);
router.get("/logout", logoutController);
router.post("/login", loginController);
router.post("/signup", signupController);

module.exports = router;
