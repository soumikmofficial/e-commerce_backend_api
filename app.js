require("dotenv").config();
require("express-async-errors");

const express = require("express");
const connectDB = require("./config/connect");
// error
const notFoundPage = require("./middlewares/not-found-page");
const errorHandlerMiddleware = require("./middlewares/error-handler");
// others
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
// routes
const authRouter = require("./routes/authRoutes");

const app = express();

process.on("uncaughtException", (err) => {
  console.log(err.message);
  console.log(`Shutting down server due to uncaught exception rejection.`);
  process.exit(1);
});

app.use(morgan("tiny"));
// ............................parsers............................
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

// ............................routes............................

app.get("/", (req, res) => {
  res.send("<h2>The home page<h2/>");
});
app.get("/api/v1", (req, res) => {
  console.log(req.signedCookies);

  res.send("<h2>Dummy<h2/>");
});
app.use("/api/v1/auth", authRouter);

// ............................error handlers............................

app.use(notFoundPage);
app.use(errorHandlerMiddleware);

// ..................................server and database...........................
connectDB(notFoundPage);

const port = process.env.PORT || 3000;

const server = app.listen(port, () => console.log(`server up on port ${port}`));

process.on("unhandledRejection", (err) => {
  console.log(err.message);
  console.log(`Shutting down server due to unhandled promise rejection.`);
  server.close(() => {
    process.exit(1);
  });
});
