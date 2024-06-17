const router = require("express").Router();
const userControl = require("../controllers/userController");

router.get("/", userControl.homeRender);
router.get("/lineCallback", userControl.lineCallback);
router.get("/login", userControl.loginRender);
router.get("/logout", userControl.logoutController);
router.post("/login", userControl.loginController);
router.post("/signup", userControl.signupController);

module.exports = router;
