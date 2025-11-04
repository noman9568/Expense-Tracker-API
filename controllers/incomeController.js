const Income = require("../models/Income");


exports.createIncome = async (req,res) =>{
  try{
    const {source, amount, description} = req.body;
    const userId = req.user.userId;

    const income = await Income.create({
      user: userId,
      source,
      amount,
      description
    });

    return res.status(201).json({
      message : "New Income created.",
      income
    });
  } catch(error) {
    return res.status(500).json({message : "Error creating income", error});
  }
}

exports.getIncome = async (req,res) =>{
  try{
    const userId = req.user.userId;

    const incomes = await Income.find({user: userId});
    return res.status(200).json(incomes);
  }
  catch(error){
    return res.status(500).json("Error fetching incomes",error);
  }
}

exports.deleteIncome = async (req,res) =>{
  try{
    const { id } = req.params;
    const userId = req.user.userId;

    const income = await Income.findById(id);
    if(!income){
      return res.status(400).json({message : "Income not found"});
    }

    if(income.user.toString()!=userId){
      return res.status(403).json({message : "Unauthorised action"});
    }

    await income.deleteOne();
    return res.status(200).json({message : "Income deleted successfully."});
  }
  catch(error){
    return res.status(500).json("Error deleting income",error);
  }
}