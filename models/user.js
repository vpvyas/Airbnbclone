const passportLocalMongoose = require("passport-local-mongoose");
const mongoose = require("mongoose");
const Schema = mongoose.Schema; 
const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  }
});

console.log(typeof passportLocalMongoose); // should print "function"
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);