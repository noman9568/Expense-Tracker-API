const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name :  { type : String },
  email : { type : String, unique: true},
  password : { type: String},
  createdAt : { type : Date, default : Date.now}
})

module.exports = mongoose.model('User',userSchema);