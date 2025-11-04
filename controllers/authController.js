const User = require("../models/User");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');



exports.register = async (req,res) =>{
  try{
    const {name, email, password} = req.body;

    if(!name || !email || !password){
      return res.status(400).json({message : "All the fields are required!"});
    }

    const existingUser = await User.findOne({email});
    if(existingUser){
      return res.status(409).json({message : 'User already exists!'});
    }

    const hashpassword = await bcrypt.hash(password,10);
    const user = await User.create({
      name,
      email,
      password : hashpassword
    });

    const token = jwt.sign({userId : user._id, timestamp : Date.now()},process.env.JWT_SECRET,{expiresIn : '1h'});

    res.cookie("token",token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 60* 60* 1000
    });

    return res.status(201).json({message : 'User registered successfully!',
      user : {name : user.name, email : user.email, id: user._id}
    });
  }
  catch(error){
    console.log("Error - ",error);
    return res.status(500).json({message : "Error in registering the user!"});
  } 
}

exports.login = async (req,res) =>{
  try{
    const {email, password} = req.body;
    if(!email || !password){
      return res.status(400).json({message : "All the fields are required!"});
    }

    const user = await User.findOne({email});
    if(!user){
      return res.status(404).json({message : "User not found!"});
    }

    const passCheck = await bcrypt.compare(password,user.password);
    if(!passCheck){
      return res.status(401).json({message : "Wrong password!"});
    }

    const token = jwt.sign({userId : user._id, timestamp : Date.now()},process.env.JWT_SECRET,{expiresIn : '1h'});

    res.cookie("token",token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 60* 60* 1000
    });

    return res.status(201).json({message : "Logged in successfully!",
      user : {name : user.name, email : user.email}
    });
  }
  catch(error){
    console.log("Error - ",error);
    return res.status(500).json({message : "Server error", error : error.message});
  }
}

exports.logout = (req,res) =>{
  res.clearCookie("token",{
    httpOnly: true,
    secure: false,
    sameSite: "strict"
  })
  return res.status(200).json({message : "Loggoed out successfully."});
}

