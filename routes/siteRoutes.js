const express = require("express");
const router = express.Router();

const siteController       = require("../controllers/siteController");
const eventPageController  = require("../controllers/eventPageController");
const userPageController   = require("../controllers/userPageController");
const savedEventController = require("../controllers/savedEventController"); // ✅
const authMiddleware       = require("../middlewares/authMiddleware");

router.get("/", siteController.home);
router.get("/about", siteController.about);
router.get("/status", siteController.status);
router.get("/visits", siteController.visits);

router.get("/eventos", eventPageController.list);
router.get("/eventos/new", authMiddleware, eventPageController.createForm);
router.get("/eventos/:id/edit", authMiddleware, eventPageController.editForm);
router.get("/eventos/:id", eventPageController.detail);

// Favoritos
router.post("/eventos/:eventId/save", authMiddleware, savedEventController.toggle);
router.get("/saved-events", authMiddleware, savedEventController.list);

router.get("/perfil/:id", authMiddleware, userPageController.profile);

module.exports = router;