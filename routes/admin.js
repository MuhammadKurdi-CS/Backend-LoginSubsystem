var Router = require('koa-router');
var adminModel = require('../models/admin');

//Route paths can be prefixed at the router level:
var router = Router({
   prefix: '/api/v1.0/admin'
}); 

var bodyParser = require('koa-bodyparser');
//MySQL data tables are generated here via post request
router.post('/create_db', async (ctx, next) => {

    let item = await adminModel.createTables(ctx.params.id);
    ctx.body = item;

});

module.exports = router;