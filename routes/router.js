const express = require('express');
const siteController = require('../controllers/siteController');
const requestLogger = require('../middlewares/requestLogger');

const router = express.Router();

router.get('/', siteController.home);
router.get('/about', siteController.about);
router.get('/status', siteController.status);
router.get('/visitas', requestLogger, siteController.visits);

module.exports = router;