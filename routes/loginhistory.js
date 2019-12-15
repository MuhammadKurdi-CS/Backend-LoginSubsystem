'use strict';
//https://stackoverflow.com/questions/29411551/express-js-req-ip-is-returning-ffff127-0-0-1

var Router = require('koa-router');

var model = require('../models/loginhistory.js');

var router = Router({
   prefix: '/api/v1.0/login'
});  

var bodyParser = require('koa-bodyparser');

router.post('/', bodyParser(), async (cnx, next) =>{ //logs a user in 

    let succeeded = false
    console.log(cnx.request.body)

   const clientIP = cnx.request.ip; //gets client IP

    let newUser = {
       
      username: cnx.request.body.username,
      password: cnx.request.body.password  
   };   

   try{
      
      var browser = cnx.userAgent.browser 
      var deviceDetails = cnx.userAgent.platform 

      await model.postValid(newUser); 
      succeeded = true 

      await model.saving(newUser.username, clientIP, browser, deviceDetails, succeeded)
     
      cnx.response.status = 201;
      cnx.body = token; //returns in the body, the JWT token

   }
   catch(error){
      await model.saveLogin(newUser.username, clientIP, browser, deviceDetails, succeeded)
      cnx.response.status = error.status;
      console.log("Error:")
      console.log(error)
      cnx.body = error.message;
   }
   
});

module.exports = router;
