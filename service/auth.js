const jwt = require("jsonwebtoken");

function setUser(user) {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
    },
    "kukuhbdureriuhiuhive",
    { expiresIn: "1d" }
  );
}

function getUser(token) {
  if (!token) return null;
  return jwt.verify(token, "kukuhbdureriuhiuhive");
}
module.exports = {
  setUser,
  getUser,
};
