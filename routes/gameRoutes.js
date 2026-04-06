const express = require("express");
const router = express.Router();

const gameController = require("../controllers/gameController");
const authMiddleware = require("../middlewares/authMiddleware");
const checkRole = require("../middlewares/checkRole");

router.get("/", gameController.list);
router.get("/:id", gameController.detail);

router.post("/", authMiddleware, checkRole("admin"), gameController.create);
router.put("/:id", authMiddleware, checkRole("admin"), gameController.update);
router.delete("/:id", authMiddleware, checkRole("admin"), gameController.remove);

module.exports = router; 