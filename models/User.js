// let mongoose = require('mongoose');

// //Setup a schema for storing the poll question, answers and votes
// let Schema = mongoose.Schema;
// let userSchema = new Schema({
//   username: String,
//   email: String,
//   password: String
// });

// let User = mongoose.model("user", userSchema);

// module.exports = User;
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const User = new Schema({});
User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);