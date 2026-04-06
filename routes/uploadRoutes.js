const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const uploadController = require("../controllers/uploadController");
const uploadEventFlyer = require("../middlewares/uploadEventFlyer");

router.post("/flyer", authMiddleware, uploadEventFlyer.single("flyer"), uploadController.uploadFlyer);

module.exports = router;