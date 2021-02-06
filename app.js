const Koa = require('Koa');
const koaBody = require('koa-body');
const router = require('./route');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/test', {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', function() {
  app.listen('4000');
  console.log('Server Has Started Listening');
});

const app = new Koa();
app.use(koaBody({multipart: true}));

app
    .use(router.routes())
    .use(router.allowedMethods());


