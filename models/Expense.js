const mongoose = require("mongoose");

const expenseSchema = mongoose.Schema({
  user : { type : mongoose.Schema.Types.ObjectId, ref : 'User', immutable: true},
  title : String,
  amount : Number,
  category : String,
  date : { type : Date, default : Date.now, immutable: true},
  description : String
})

module.exports = mongoose.model("Expense",expenseSchema);