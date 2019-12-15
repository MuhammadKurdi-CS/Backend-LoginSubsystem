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

// get one account holder in login history database via user id
router.get('/getOne/:id',  authenticated, async (cnx, next) =>{
   try{
      let id = await model.getOne(cnx.params.id)
      console.log(id)
      let date = String(id[0].attemptDate)
      date = date.slice(0, -40) 
      id[0].attemptDate = date
      cnx.response.status = 201;
      cnx.body = id
   }
   catch(error){
      cnx.response.status = error.status;
      cnx.body = {message:error.message};
   }
});

//gets login information process via get API request
router.get('/getlogininfo',  authenticated, bodyParser(), async (cnx, next) =>{
   try {
        const user = cnx.request.jwtPayload.sub
        console.log(user)
        let results = await model.getLoginInfo(user)
        console.log(results)
        cnx.response.status = 200
        cnx.body = results
   }
   catch(error){
      cnx.response.status = error.status;
      cnx.body = {message:error.message};
   }
});

module.exports = router;