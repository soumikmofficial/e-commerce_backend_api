const createTokenUser = (user) => {
  const tokenUser = {
    userId: user._id,
    role: user.role,
    name: user.name,
  };
  return tokenUser;
};

module.exports = createTokenUser;
