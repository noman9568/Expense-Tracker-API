const express = require("express");
const router = express.Router();

const {createIncome, getIncome, deleteIncome} = require("../controllers/incomeController");
const verifyToken = require("../middleware/authMiddleware");

router.post("/", verifyToken, createIncome);
router.get("/", verifyToken, getIncome);
router.delete("/:id", verifyToken, deleteIncome);


module.exports = router;