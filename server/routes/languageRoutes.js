// server/routes/languageRoutes.js
const Router = require('@koa/router');
const languageController = require('../controllers/languageController');

const router = new Router();

router.get('/language', languageController.getLanguage);
router.post('/language', languageController.setLanguage);

module.exports = router;
