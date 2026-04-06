const express = require("express");
const router = express.Router();

const eventPageController = require("../controllers/eventPageController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/", eventPageController.list);
router.get("/new", authMiddleware, eventPageController.createForm);
router.get("/:id", eventPageController.detail);

module.exports = router;