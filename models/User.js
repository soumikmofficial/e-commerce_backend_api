const bcrypt = require("bcryptjs");
const validator = require("validator");)

const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  name: {
    type: string,
    required: true,
    maxLength: [100, "Name too long"],
  },
  email: {
    type: string,
    required: true,
    unique: true,
    maxLength: [100, "Email too long"],
    validate: {
        validator: validator.isEmail,
        message: 'Please provide a valid email'
    }
  },
  password: {
    type: String,
    required: true,
    minLength: [8, ["Password too short"]],
  },

  role : {
      type: String,
      enum: ['admin', 'user'],
      default:  'user'
  }
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    try {
      this.password = await bcrypt.has(this.password, 10);
    } catch (error) {
      console.log(error);
    }
  }
  next();
});

module.exports = mongoose.model("User", userSchema);
