const jwt = require("jsonwebtoken");
const authConst = require("../utils/getAuthConst");

function getToken(req) {
  const authToken = req.headers["authorization"]; //"Bear " + token
  let token = undefined;
  if (authToken) {
    token = authToken.split(" ")[1];
  } else {
    // token = req.session.accessToken;
    token = req.cookies.accessToken;
  }
  // console.log("token:" + token);
  return token;
}
async function authJwtCheckLogin(req, res, next) {
  const token = getToken(req);
  if (!token) {
    return res
      .status(401)
      .redirect(`/login`, { message: "Please Login to continue." });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res
        .status(403)
        .json({ message: `User Authentication Error! ${err}` });
    }
    req.user = user;
    next();
  });
}
async function authAdminCheck(req, res, next) {
  const { user } = req;
  if (!user || user.role != authConst.authRole.ADMIN) {
    return res
      .status(403)
      .json({ message: "User Authentication Error! The page for admin only!" });
  }
  next();
}
function authJwtSign(user) {
  const tokenObject = { id: user.id };
  const accessExpired = 24 * 60 * 60;
  const accessJwtToken = jwt.sign(tokenObject, process.env.JWT_SECRET, {
    expiresIn: accessExpired
  });
  const auth = { accessJwtToken, accessExpired };
  return auth;
}

module.exports = {
  authJwtCheckLogin,
  authAdminCheck,
  authJwtSign
};
