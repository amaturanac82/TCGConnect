const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");
const isAdmin = require("../middlewares/isAdmin");
const isSelfOrAdmin = require("../middlewares/isSelfOrAdmin");
const uploadAvatar = require("../middlewares/uploadAvatar"); // ✅ agregado

router.get("/", authMiddleware, isAdmin, userController.list);
router.get("/:id", authMiddleware, isSelfOrAdmin, userController.detail);
router.post("/", authMiddleware, isAdmin, userController.create);
router.put("/:id", authMiddleware, isSelfOrAdmin, uploadAvatar.single("avatar"), userController.update); // ✅ middleware agregado
router.delete("/:id", authMiddleware, isAdmin, userController.remove);

module.exports = router;