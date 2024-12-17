const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required !"],
  },
  email: {
    type: String,
    required: [true, "Email is compulsory"],
    unique: true,
    validate: [validator.isEmail, "provide valid Email"],
  },
  password: {
    type: String,
    min: 8,
  },
  avatar: {
    type: String,
  },
  confirmPassword: {
    type: String,
    min: 8,
    validate: {
      validator: function (el) {
        return el === this.password;
      },
    },
  },
  role: {
    type: String,
    default: "user",
  },
  OTP: {
    type: Number,
  },
  isVerify: {
    type: Boolean,
    default: false,
  },
  forgotPasswordOTP: {
    type: Number,
  },
  signUpOtpExpiry: {
    type: Date,
  },
  otpExpiry: {
    type: Number,
  },
  isDelete: {
    type: Boolean,
    default: false,
  },
});

userSchema.methods.checkPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.pre(/^find/, function (next) {
  this.find({
    iDeleted: false,
  });
  next();
});
const User = mongoose.model("User", userSchema);
module.exports = User;
