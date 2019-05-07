let mongoose = require('mongoose');

//Setup a schema for storing the poll question, answers and votes
let Schema = mongoose.Schema;
let messageSchema = new Schema({
  message: String,
  username: String,
  user_id: Number,
  timestamp: String
});

let Message = mongoose.model("message", messageSchema);

module.exports = Message;