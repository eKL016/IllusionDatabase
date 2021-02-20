const Router = require('@koa/router');
const queryFunctions = require('./controller');
const router = new Router();


router
    .get('/', async (ctx, next) => {
      return ctx.body = 'INDEX';
    })
    .get('/tags/:type', async (ctx, next) => {
      return ctx.body = await queryFunctions
          .getAllTags(ctx, next);
    })

    .get('/illusions', async (ctx, next) =>
      ctx.body = await queryFunctions.getAllEntry(ctx, next),
    )
    .get('/illusions/:id', async (ctx, next) =>
      ctx.body = await queryFunctions.getEntryById(ctx, next),
    )
    .post('/illusions/:name', async (ctx, next) => {
      await queryFunctions.insertNewEntry(ctx, next);
      return ctx.body = 'Done';
    })
    .post('/illusions/search/:type', async (ctx, next) => {
      return ctx.body = await queryFunctions
          .searchByTagIDs(ctx, next);
    });

module.exports = router;
