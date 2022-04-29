const express = require("express");

const router = express.Router();


const ctrlUser = require("../controllers/user.controller");
const authCtrl = require("../controllers/auth.controller");

router.post("/register",  authCtrl.register);

router.post("/login", authCtrl.login);

router.get("/userList", authCtrl.protect,ctrlUser.userList);

router.get("/:id", authCtrl.protect,ctrlUser.findUser);

router.get("/auth",authCtrl.protect);

module.exports = router;
