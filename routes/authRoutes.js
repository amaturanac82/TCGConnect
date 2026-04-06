const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const authPageController = require("../controllers/authPageController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/login", authPageController.login);
router.get("/register", authPageController.register);

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);

router.get("/profile", authMiddleware, (req, res) => {
  res.redirect(`/perfil/${req.user.id}`);
});

router.get("/me", authMiddleware, authController.me);

module.exports = router;