//https://www.youtube.com/watch?v=7nafaH9SddU
//https://www.youtube.com/watch?v=0D5EEKH97NA
//https://jwt.io/
//https://www.npmjs.com/package/jsonwebtoken

const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET || 'secret';

module.exports = async (cnx, next) => {
  
    console.log(cnx.headers.authorization)
    try {
      const token = cnx.headers.authorization.split(' ')[1]; 
    } catch (err) {
      cnx.throw(403, 'No token.');
    }
   
    try { 
        const token = cnx.headers.authorization.split(' ')[1];
        cnx.request.jwtPayload = jwt.verify(token, secret);
      
      } catch (err) {
        cnx.throw(err.status || 403, err.text);
      }
    await next();
  };