const Expense = require("../models/Expense");
const mongoose = require("mongoose");


exports.createExpense = async (req,res) =>{
  try{
    const {title, amount, category, description} = req.body;

    const expense = await Expense.create({
      user: req.user.userId,
      title,
      amount,
      category,
      description
    });
    return res.status(201).json({
      message : "New Expense created.",
      expense
    });
  } catch(error) {
    return res.status(500).json({message : "Error creating expense", error});
  }
}

exports.getExpenses = async (req,res) =>{
  try{
    const expenses = await Expense.find({user: req.user.userId});
    return res.status(200).json(expenses);
  } 
  catch(error) {
    return res.status(500).json({message : "Error fetching expenses",error});
  }
}
exports.updateExpense = async (req,res) =>{
  try{
    const {id} = req.params;
    const userId = req.user.userId;
    const updates = req.body;

    const expense = await Expense.findOne({_id : id, user: userId});
    if(!expense){
      return res.status(400).json({message : "Expense not found."});
    }

    Object.keys(updates).forEach((key)=>{
      expense[key] = updates[key]
    });

    await expense.save();

    return res.status(200).json({message : "Expense updated successfully.",expense});

  }
  catch(error){
    return res.status(500).json({message : "Error updating expense",error});
  }
}

exports.deleteExpense = async (req,res) => {
  try{
    const { id } = req.params;
    const userId = req.user.userId;

    const expense = await Expense.findById(id);
    if(!expense){
      return res.status(400).json({message : "Expense not found"});
    }

    if(expense.user.toString()!=userId){
      return res.status(403).json({message : "Unauthorised action."});
    }

    await expense.deleteOne();
    res.status(200).json({message : "Expense deleted successfully."});
  }
  catch (error) {
    return res.status(500).json({message : "Error deleting expense",error});
  }
}

exports.monthlySummary = async (req,res) =>{
  try{
    const userId = req.user.userId;
    
    const summary = await Expense.aggregate([
      {
        $match: {
          user : new mongoose.Types.ObjectId(userId)
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" }
          },
          totalAmount: { $sum: "$amount" },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { "_id.year": -1, "_id.month": -1 }
      }
    ]);

    return res.status(200).json({summary});
  }
  catch(error){
    return res.status(500).json({message : "Error fetching expense",error});
  }
}