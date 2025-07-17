// // auth-router.js
// const express = require("express");
// const  router = express.Router(); 
// // const {home, register} = require("../controllers/auth-controller") instead of using this will will use authcontrollers variable because in future hamare pass bht sari sections hojaenge like home, registration services, contact which will make code look dirty
// const authcontrollers = require("../controllers/auth-controller") 
// const {signupSchema, loginSchema }= require("../validators/auth-validators")
// const validate = require("../middlewares/validate-middleware")
// const authMiddleware = require("../middlewares/auth-middleware")
// // const loginSchema = require("../validators/login-validators")
// // for homepage
// router.route("/").get(authcontrollers.home);
// // for register
// router.route("/register").post(validate(signupSchema),authcontrollers.register);
// router.route("/verify-otp").post(authcontrollers.verifyOTP);

// // for googleLogin
// router.route("/google-login").post(authcontrollers.googleLogin);

// //for login
// router.route("/login").post(validate(loginSchema),authcontrollers.login);
// // for user
// router.route("/user").get(authMiddleware, authcontrollers.user);

// // for registration
// // router.route("/register").get((req,res) =>{
// //     res.status.send("Welcome to registration using router");
// // }); 



// ****************
const express = require("express");
const router = express.Router();

const authcontrollers = require("../controllers/auth-controller");

const { signupSchema, loginSchema } = require("../validators/auth-validators");
const validate = require("../middlewares/validate-middleware");
const authMiddleware = require("../middlewares/auth-middleware");


// user register/login
router.route("/register").post(validate(signupSchema), authcontrollers.register);
router.route("/verify-otp").post(authcontrollers.verifyOTP);
router.route("/login").post(validate(loginSchema), authcontrollers.login);
router.route("/google-login").post(authcontrollers.googleLogin);

// protected user route
router.route("/user").get(authMiddleware, authcontrollers.user);

// forgot/reset password routes
router.route("/forgot-password").post(authcontrollers.forgotPassword);
router.route("/reset-password/:token").post(authcontrollers.resetPassword);


module.exports = router;