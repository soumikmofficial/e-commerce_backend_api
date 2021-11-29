const notFoundPage = (req, res) => {
  res.status(404).send("<h3>The Page you requested does not exist</h3>");
};

module.exports = notFoundPage;
