const jwt = require("jsonwebtoken");
const User = require('../model/userSchema')
const express = require("express");

var cookieParser = require('cookie-parser');
const app = express();
app.use(express.json());
app.use(cookieParser());

const authenticate = async(req, res, next) => {
  try {
    const token = req.cookies.jwttoken;
    const verifyToken = jwt.verify(token, process.env.SECRET_KEY);

    const rootUser= await User.findOne({_id:verifyToken._id,"tokens.token":token})

    if(!rootUser)
    {
      console.log("Couldn't find tokennssss'")
    }

    req.token= token;
    req.rootUser=rootUser;
    req.userID=rootUser._id;

    next();

    
  } catch (error) {
    res.status(401).send('unauthorised authenticateTken');
    console.log(error);
    
  }
}

// we check the user login and show his particular file which belong to that user






module.exports=  authenticate;