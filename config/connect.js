const mongoose = require("mongoose");

const connectDB = async () => {
  const db = await mongoose.connect(process.env.MONGO_URI);
  console.log(`Connect to MongoDB : ${db.connection.host}`);
};

module.exports = connectDB;
