const jwt = require("jsonwebtoken");

const createJWT = ({ payload }) => {
  const token = jwt.sign(
    { userId: payload._id, name: payload.name, role: payload.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_LIFETIME }
  );

  return token;
};

const verifyJWT = ({ token }) => jwt.verify(token, process.env.JWT_SECRET);

const attachCookiesToResponse = ({ res, user }) => {
  const token = createJWT({ payload: user });
  const lifetime = 1000 * 60 * 60 * 24;
  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + lifetime),
    secure: process.env.NODE_ENV === "production",
    signed: true,
  });
};

module.exports = { createJWT, verifyJWT, attachCookiesToResponse };
