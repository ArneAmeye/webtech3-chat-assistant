let mongoose = require('mongoose');

//Setup a schema for storing the poll question, answers and votes
let Schema = mongoose.Schema;
let userSchema = new Schema({
  username: String,
  email: String,
  password: String
});

let User = mongoose.model("user", userSchema);

module.exports = User;