require("../models/user.model");
const jwt = require("jsonwebtoken");
const catchAsync = require("./../utils/catchAsync");
var ObjectId = require("mongoose").Types.ObjectId;
const AppError = require("./../utils/appError");
const { promisify } = require("util");
const mongoose = require("mongoose");
const User = mongoose.model("User");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
exports.register = catchAsync(async (req, res) => {
  console.log(req.body);
  var newUser = await User.create({
    fullName: req.body.fullName,
    email: req.body.email,
    password: req.body.password,
    passwordChangeAt:req.body.passwordChangeAt,
  });

  const token = signToken(newUser._id);

  res.status(201).json({
    status: "success",
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1. Check if email or password exist
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  //2. Check if user exist and password is correct
  const user = await User.findOne({ email }).select("+password"); //because password is false by default in select field
  // console.log(user);
  // console.log(user.password);

  if (!user || !(await user.correctPassword(password, user.password))) {
    //coorect password is a method of userSchema in user model
    return next(new AppError("Incorrect email or password", 401));
  }
  //3. If everything is ok send token to client
  const token = signToken(user._id);

  res.status(200).json({
    id:User._id,
    status: "success",
    token,
  }).cookie("SESSIONID", token, {httpOnly:true, secure:true});
});
exports.protect = catchAsync(async (req, res, next) => {
  let token;
  // verify recieved token

console.log(req.headers.authorization)
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  console.log(token);

  if (!token) {
    return next(new AppError("You are not logged in", 400));
  }

  //verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log(decoded);
  //check if user still exists
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(new AppError("the user belongs to this jwt token is no longer exist", 401));
  }
  
  //check if user change password after token issued
  if(freshUser.changePasswordAfter(decoded.iat)){
    return next(new AppError("The user have changed the password. Please log in again", 401));
  }

  req.user=freshUser
  next();
});
// exports.protect = ((req, res, next) => {
//   let token;
//   let n;
//   n=req.headers.authorization.length

//   // verify recieved token
//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith("Bearerr")
//   ) {
//      token = req.headers.authorization.slice(6,n);

//   }

//   if(!token){
//     return next(new AppError("You are not logged in", 400));
//   }

//   next();

// });
