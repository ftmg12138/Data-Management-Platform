// server/routes/dataRoutes.js
const Router = require('@koa/router');
const dataController = require('../controllers/dataController');

const router = new Router();

router.get('/data', dataController.getAllData);
router.post('/data', dataController.addData);
router.delete('/data/:id', dataController.deleteData);
router.put('/data/:id', dataController.editData);
// ...其他数据相关路由

module.exports = router;
