// server/routes/tagRoutes.js
const Router = require('@koa/router');
const tagController = require('../controllers/tagController');

const router = new Router();

router.get('/tags', tagController.getAllTags);
router.post('/tags', tagController.addTag);
router.delete('/tags/:id', tagController.deleteTag);
router.put('/tags/:id', tagController.editTag);
// ...其他标签相关路由

module.exports = router;
