let mongoose = require('mongoose');

//Setup a schema for storing the poll question, answers and votes
let Schema = mongoose.Schema;
let profileSchema = new Schema({
  skill: {
    type: String,
    required: true
  },
  user_id: {
    type: String,
    required: true
  },
  // timestamp: String
});

let Profile = mongoose.model("profile", profileSchema);

module.exports = Profile;