'use strict';

var Router = require('koa-router');

var model = require('../models/account.js');

var router = Router({
   prefix: '/api/v1.0/user'
}); 

//in order parse POST parameters, we will import koa-bodyparser
var bodyParser = require('koa-bodyparser');

router.post('/', bodyParser(), async (ctx, next) => {

   let newUser = ctx.request.body;
   console.log(newUser)
   await model.postAccount(newUser);

   ctx.body = {message: "user added successfully!"};
});

module.exports = router;