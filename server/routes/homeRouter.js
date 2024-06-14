const router = require("express").Router();

router.get("/", (req, res, next) => {
  try {
    res.send("Welcome to myHome");
    //   res.redirect("/login");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
