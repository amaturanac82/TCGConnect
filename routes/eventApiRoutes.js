const express = require("express");
const router = express.Router();

const eventController = require("../controllers/eventController");
const authMiddleware = require("../middlewares/authMiddleware");
const isEventOwner = require("../middlewares/isEventOwner");

router.get("/", eventController.list);
router.get("/:id", eventController.detail);
router.post("/", authMiddleware, eventController.create);
router.put("/:id", authMiddleware, isEventOwner, eventController.update);
router.delete("/:id", authMiddleware, isEventOwner, eventController.remove);

module.exports = router;