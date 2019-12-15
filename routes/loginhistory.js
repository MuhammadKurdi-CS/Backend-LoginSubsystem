'use strict';
//https://stackoverflow.com/questions/29411551/express-js-req-ip-is-returning-ffff127-0-0-1

var Router = require('koa-router');

var model = require('../models/loginhistory.js');

//the session for JWT will take place here
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET || 'secret'; 

var router = Router({
   prefix: '/api/v1.0/login'
});  

var bodyParser = require('koa-bodyparser');

//this is where our users will log in here via this post request
router.post('/', bodyParser(), async (cnx, next) =>{

    let succeeded = false
    console.log(cnx.request.body)

   const clientIP = cnx.request.ip; 

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

        const payload = { sub: newUser.username }; //subject is username
        const token = jwt.sign(payload, secret); // our data will be stored in token
      
        cnx.response.status = 201;
        cnx.body = token; 
     
   }
   catch(error){
        await model.saving(newUser.username, clientIP, browser, deviceDetails, succeeded)
        cnx.response.status = error.status;
        console.log(error)
        cnx.body = error.message;
   }
});

module.exports = router;
