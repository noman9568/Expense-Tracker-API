const express = require("express");
const router = express.Router();

const {createExpense, getExpenses, updateExpense, deleteExpense, monthlySummary} = require("../controllers/expenseController");
const verifyToken = require("../middleware/authMiddleware");

router.post("/", verifyToken, createExpense);
router.get("/", verifyToken, getExpenses);
router.put("/:id", verifyToken, updateExpense);
router.delete("/:id", verifyToken, deleteExpense);
router.get("/summary", verifyToken ,monthlySummary);


module.exports = router;