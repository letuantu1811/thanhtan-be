const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function(req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, config.get("jwtSecret"));
    req.account = decoded.account;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};