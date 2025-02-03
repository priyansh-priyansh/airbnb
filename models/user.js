const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true, // Ensure email is unique
  },
  username: {  // Add username field
    type: String,
    required: true,
    unique: true,
  }
});

userSchema.plugin(passportLocalMongoose); // Remove the usernameField option

module.exports = mongoose.model("User", userSchema); // Ensure model name is "User"
