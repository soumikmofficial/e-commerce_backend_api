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
const fileUpload = require("express-fileupload");
// routes
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const productRouter = require("./routes/productRoutes");
const reviewRouter = require("./routes/reviewRoutes");

const app = express();

process.on("uncaughtException", (err) => {
  console.log(err.message);
  console.log(`Shutting down server due to uncaught exception rejection.`);
  process.exit(1);
});

app.use(morgan("tiny"));

//..........................................public files......................................
app.use(express.static("./public"));
// ............................parsers............................
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(fileUpload());

// ............................routes............................
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/reviews", reviewRouter);

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
