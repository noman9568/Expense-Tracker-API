require('dotenv').config()
const express = require('express');
const app = express();
const cookieParser = require("cookie-parser");
app.use(cookieParser());
const PORT = process.env.PORT;

const authRoute = require('./routes/authRoute');
const expenseRoute = require('./routes/expenseRoute');
const incomeRoute = require("./routes/incomeRoute");
const connectDB = require("./config/db");

connectDB();
app.use(express.json());

app.use('/api/auth',authRoute);
app.use('/api/expense',expenseRoute);
app.use('/api/income',incomeRoute);




app.get("/", (req,res)=>{
  res.send("nothing");
  console.log("Nothing");
})

app.listen(PORT, ()=>{
  console.log(`Server running on ${PORT}`);
})