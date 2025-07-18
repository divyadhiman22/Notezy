// authcontroller.js
const User = require("../models/user-model")
const bcrypt = require('bcrypt');
const OTPModel = require("../models/otp-model");
const sendOTP = require("../utils/sendOTP");
const admin = require("../firebase-config");
const auth = admin.auth();
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
//___________________________

// HOME LOGIC
//___________________________
const home = async (req, res) =>{
    try{
        res.status(200).send("Welcome Divya");
    }catch(error){
        console.log(error);
    }
};



//___________________________

// REGISTRATION
//___________________________
const register = async (req, res, next) => {
  try {
    const { username, email, phone, password } = req.body;

    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);


    await OTPModel.create({ email, otp });

 
    await sendOTP(email, otp);

    res.status(200).json({ message: "OTP sent to your email" });
  } catch (error) {
   
    next(error);
  }
};

//___________________________

// VERIFY OTP
//___________________________
const verifyOTP = async (req, res, next) => {
  try {
    const { email, otp, username, phone, password } = req.body;

    const validOTP = await OTPModel.findOne({ email, otp });
    if (!validOTP) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }


    const userCreated = await User.create({
      username,
      email,
      phone,
      password,
    });


    await OTPModel.deleteOne({ email });

    res.status(200).json({
      message: "Registration successful",
      token: await userCreated.generateToken(),
      userId: userCreated._id.toString(),
    });
  } catch (error) {
    
    next(error);
  }
};

//___________________________

// GOOGLE SIGN IN
//___________________________
const googleLogin = async (req, res, next) => {
    try {
        const { idToken } = req.body;

        if (!idToken) {
            return res.status(400).json({ message: "No ID token provided" });
        }

        const decoded = await auth.verifyIdToken(idToken);
        const { email, name } = decoded;

        if (!email || !name) {
            return res.status(400).json({ message: "Invalid Firebase token" });
        }

        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                username: name,
                email: email,
                isGoogleUser: true,
            });
        }

        const token = await user.generateToken();

        res.status(200).json({
            message: "Google login successful",
            token,
            userId: user._id.toString(),
        });
    } catch (error) {
        console.error("Google Login Error:", error);
        next(error);
    }
};


//___________________________

// LOGIN LOGIC
//___________________________

const login = async (req,res) => {
    try {
        
        const {email, password} = req.body;
        
         const userExist = await User.findOne({ email });

        if(!userExist){
            return res.status(400).json({msg:"Invalid Credentials"})
        }

        const isPasswordValid = await bcrypt.compare(password, userExist.password);

        if(isPasswordValid){
        res.status(200).json({
            msg: "Login Successfull",
            token:  await userExist.generateToken(),
            userId:userExist._id.toString()});
        }
        else{
            res.status(401).json({msg:"Invalid Email or Password"})
        }

    } catch (error) {
        res.status(500).json("Internal Server Error");
    }
};

//___________________________

// USER LOGIC (TO SEND USER DATA)
//___________________________

const user = async(req, res) =>{
try {
    const userData = req.user;
    
    res.status(200).json({userData});

} catch (error) {
    console.log(`error from the route ${error}`);
}
};

//___________________________

// FORGOT PASSWORD
//___________________________
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User with this email does not exist" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "15m",
    });

    const resetLink = `http://localhost:5173/reset-password/${token}`;

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.GMAIL_USER, 
        pass: process.env.GMAIL_PASS, 
      },
    });

    const mailOptions = {
      from: `"NoteApp" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Reset Your Password",
      html: `
        <p>Hello,</p>
        <p>Click the link below to reset your password. This link will expire in 15 minutes.</p>
        <a href="${resetLink}">${resetLink}</a>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Password reset email sent successfully" });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    next(error);
  }
};

//___________________________

// RESET PASSWORD
//___________________________
const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found or token expired" });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset Password Error:", error);
    return res.status(400).json({ message: "Invalid or expired token" });
  }
};

module.exports = {
  home,
  register,
  login,
  user,
  verifyOTP,
  googleLogin,
  forgotPassword,
  resetPassword,
};