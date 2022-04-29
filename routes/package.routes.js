const express = require("express");

const router = express.Router();

const ctrlPackage = require("../controllers/package.controller");
const authCtrl = require("../controllers/auth.controller");

router.get("/", ctrlPackage.packageList);
router.post("/", ctrlPackage.addPackage);
router.get("/packageDetail/:id",ctrlPackage.packageDetail);

module.exports = router;
