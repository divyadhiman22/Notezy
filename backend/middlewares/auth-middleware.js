// authmiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/user-model")
const authMiddleware = async(req, res, next) =>{
   const token = req.header('Authorization');

//    if the token is not found
   if(!token){
    //if you attempt to use an expired token, you'll receive a "401 unauthorized HTTP" response
    return res.status(401).json({msg:"Unauthorized HTTP, Token not provided"})
   }

   //    Assuming token is in the format "Bearer <jwtToken> ", removing the "Bearer " prefix
   const jwtToken = token.replace('Bearer','').trim();
   
   
   try {
    //isverified will give us the data on the basis of token
       const isVerified = jwt.verify (jwtToken,process.env.JWT_SECRET_KEY)
       
       //.select means passowrd ko chodkr sari feilds we will get
       const userData = await User.findOne({email: isVerified.email}).select({
        password:0,
       });

       console.log(userData);

    //    making custom property
       req.user = userData;
       req.token = token;
       req.userID = userData._id;
       next();
    
   } catch (error) {
        return res.status(401).json({msg:"Unauthorized. Invalid Token"})
   }


};

module.exports = authMiddleware;