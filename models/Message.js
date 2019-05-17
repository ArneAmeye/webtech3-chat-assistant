let mongoose = require('mongoose');

//Setup a schema for storing the poll question, answers and votes
let Schema = mongoose.Schema;
let messageSchema = new Schema({
  message: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  user_id: {
    type: String,
    required: true
  },
  timestamp: String
});

let Message = mongoose.model("message", messageSchema);

module.exports = Message;