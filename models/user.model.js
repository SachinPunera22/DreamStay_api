const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const catchAsync = require("./../utils/catchAsync");
const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "PLease provide a username"],
  },
  email: {
    type: String,
    unique:true,
    required: [true, "PLease provide a email"],
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "PLease provide a password"],
    select:false //to do not display password by default
  },
  passwordChangeAt: Date,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next;

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// method for verifying hashed password 
userSchema.methods.correctPassword= async function (candidatePassword, userPassword) {
  
  return await bcrypt.compare(candidatePassword, userPassword)

};
userSchema.methods.changePasswordAfter=  function (JWTTimestamp) {
  if(this.passwordChangeAt){
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime()/ 1000,10);
console. log(changedTimestamp, JWTTimestamp);
return JWTTimestamp < changedTimestamp; 
  }
// False means NOT changed
return false;

};

module.exports = mongoose.model("User", userSchema);


