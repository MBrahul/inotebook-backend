var jwt = require('jsonwebtoken');
require('dotenv').config({path:'.env'});
const JWT_SECRET = process.env.JWT_SECRET;

const fatchUser=(req,res,next)=>{
       //getting the user details from jwt Token
       const token = req.header('auth-token');
      
         if(!token){
            res.status(401).send({error:'authenticate with correct credentails'});
         }
            
          
          try {
            const data = jwt.verify(token,JWT_SECRET);
            req.user = data.user;
          
          }catch (error) {
            res.status(401).send({error:'authenticate with correct credentails'});
       }
       next();
};


module.exports = fatchUser;