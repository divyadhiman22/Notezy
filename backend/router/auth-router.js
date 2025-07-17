const express = require("express");
const router = express.Router();

const authcontrollers = require("../controllers/auth-controller");

const { signupSchema, loginSchema } = require("../validators/auth-validators");
const validate = require("../middlewares/validate-middleware");
const authMiddleware = require("../middlewares/auth-middleware");

router.route("/register").post(validate(signupSchema), authcontrollers.register);
router.route("/verify-otp").post(authcontrollers.verifyOTP);
router.route("/login").post(validate(loginSchema), authcontrollers.login);
router.route("/google-login").post(authcontrollers.googleLogin);

router.route("/user").get(authMiddleware, authcontrollers.user);

router.route("/forgot-password").post(authcontrollers.forgotPassword);
router.route("/reset-password/:token").post(authcontrollers.resetPassword);


module.exports = router;