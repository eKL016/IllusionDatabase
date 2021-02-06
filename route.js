const Router = require('@koa/router');
const queryFunctions = require('./controller');
const router = new Router();


router
    .get('/', async (ctx, next) => {
      ctx.body = 'INDEX';
    })
    .get('/(.*)', async (ctx, next) => {
      const resultIndices = await queryFunctions
          .searchByTags(ctx.params[0].split('/'));
    })
    .post('/(.*)', async (ctx, next) => {
      try {
        await queryFunctions.insertNewEntry(ctx, next);
        return ctx.body = 'Done';
      } catch (err) {
        console.log(err);
      }
    });


module.exports = router;
