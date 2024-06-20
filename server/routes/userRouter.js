const router = require("express").Router();
const user = require("../controllers/userController");

router.get("/", user.homeRender);
router.get("/authCheck", user.userCheckAuth);
router.get("/lineCallback", user.lineCallback);
router.get("/login", user.loginRender);
router.get("/logout", user.logoutController);
router.post("/login", user.loginController);
router.post("/signup", user.signupController);

module.exports = router;
