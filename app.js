require("dotenv").config();
require("express-async-errors");

const express = require("express");
const connectDB = require("./config/connect");
const app = express();

process.on("uncaughtException", (err) => {
  console.log(err.message);
  console.log(`Shutting down server due to uncaught exception rejection.`);
  process.exit(1);
});

// ............................body parsers............................
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ............................routes........................h2....

app.get("/", (req, res) => res.send("<h2>The home page<h2/>"));

// ............................error handlers............................

// ..................................server and database...........................
connectDB();

const port = process.env.PORT || 3000;

const server = app.listen(port, () => console.log(`server up on port ${port}`));

process.on("unhandledRejection", (err) => {
  console.log(err.message);
  console.log(`Shutting down server due to unhandled promise rejection.`);
  server.close(() => {
    process.exit(1);
  });
});
