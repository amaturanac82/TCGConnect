const express = require("express");
const router = express.Router();

const eventController = require("../controllers/eventController");
const authMiddleware = require("../middlewares/authMiddleware");
const uploadEventFlyer = require("../middlewares/uploadEventFlyer");

router.get("/", eventController.list);
router.get("/:id", eventController.detail);

router.post("/", authMiddleware, uploadEventFlyer.single("flyer"), eventController.create);
router.put("/:id", authMiddleware, uploadEventFlyer.single("flyer"), eventController.update);
router.delete("/:id", authMiddleware, eventController.remove);

module.exports = router;