'use strict';

//import koa dependencies
var Koa = require('koa');
var Router = require('koa-router');
const cors = require('@koa/cors');
const { userAgent } = require('koa-useragent'); 

var app = new Koa();
app.proxy=true //provides an account's Internet Protocol address

var router = new Router();

app.use(userAgent); 

//import all the routes
var account = require('./routes/account.js')
//var loginhistory = require('./routes/loginhistory.js')
//var admin = require('./routes/admin.js')

//apply the routes as a middleware
app.use(cors()); 
//app.use(admin.routes());
app.use(account.routes());
//app.use(loginhistory.routes());


//if there is no environment variable set for port number
//use a default value of 3000
var port = process.env.PORT || 3000; 

app.listen(port); 
