const mongoose = require("mongoose");
const MONOGODB_URI =
 "mongodb+srv://MEANapi:TPrykC9Krt5.C5e@cluster0.fys2j.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
mongoose.connect(MONOGODB_URI, (err) => {
  if (!err) {
    console.log("Database is connected");
  } else {
    console.log("Error in MongoDB:" + JSON.stringify(err, undefined, 2));
  }
});
