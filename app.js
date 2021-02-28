const Koa = require('Koa');
const logger = require('koa-logger');
const koaBody = require('koa-body');
const router = require('./route');
const mongoose = require('mongoose');

mongoose.set('debug', true);
mongoose.connect('mongodb://localhost/test', {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', function() {
  app.listen('4000');
  console.log('Listening on port: 4000');
});

const app = new Koa();
app.use(koaBody({multipart: true, includeUnparsed: true}));
app.use(logger());
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    // will only respond with JSON
    ctx.status = err.statusCode || err.status || 500;
    ctx.body = {
      msg: err.message,
      trace: err.stack,
    };
  }
});
app
    .use(router.routes())
    .use(router.allowedMethods());
