// server/app.js
const Koa = require('koa');
const cors = require('@koa/cors');
const { koaBody } = require('koa-body');
const serve = require('koa-static');
const path = require('path');
const dataRoutes = require('./routes/dataRoutes');
const tagRoutes = require('./routes/tagRoutes');
const languageRoutes = require('./routes/languageRoutes');

const app = new Koa();
app.use(cors(
    {
        origin: 'http://localhost:3000' // 允许来自前端服务器的跨域请求
      }
));
app.use(koaBody());

// 配置静态文件服务
const buildPath = path.join(__dirname, '../client/build');
app.use(serve(buildPath));

app.use(dataRoutes.routes()).use(dataRoutes.allowedMethods());
app.use(tagRoutes.routes()).use(tagRoutes.allowedMethods());
app.use(languageRoutes.routes()).use(languageRoutes.allowedMethods());

module.exports = app;
