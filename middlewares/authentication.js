const CustomError = require("../errors");
const { verifyJWT } = require("../utils/jwt");

const authentication = async (req, res, next) => {
  const token = req.signedCookies.token;
  if (!token) {
    throw new CustomError.UnauthorizedError(
      "Not authorized to log in... Try logging in"
    );
  }
  try {
    const user = verifyJWT({ token });
    req.user = user;
    next();
  } catch (error) {
    throw new CustomError.UnauthorizedError(
      "Not authorized to log in... Try logging in"
    );
  }
};

const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new CustomError.ForbiddenError("Unauthorized to access this route");
    }
    next();
  };
};

module.exports = { authentication, authorizePermissions };
