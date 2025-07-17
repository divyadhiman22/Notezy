// // require the mongoose in our user-model file
// const mongoose = require('mongoose');
// const bcrypt = require("bcrypt")
// const jwt = require("jsonwebtoken");

// // create an instance of our mongoose schema
// const userSchema = new mongoose.Schema({
//     username:{
//         type:String, 
//         require:true,
//     }, 
//     email:{
//         type:String, 
//         require:true,
//     }, 
//     phone:{
//         type:String, 
//         require:true,
//     }, 
//     password:{
//         type:String, 
//         require:true,
//     },
//     isAdmin:{
//         type:Boolean, 
//         default:false,
//     }
     
// });

// // secure the password with the bcrypt
// // it will act as a middleware
// userSchema.pre("save", async function(next){

//     const user = this;

//     if(!user.isModified('password')){
//         next();
//     }

//     // if password is modified or newly added
//     try {
//         const saltRound = 10;
//         const hash_password = await bcrypt.hash(user.password, saltRound); 
//         user.password = hash_password;
//     } catch (error) {
//         next(error);
//     }
// })


// // json web token
// userSchema.methods.generateToken = async function(){
//     try {
//         return jwt.sign({
//             userId: this._id.toString(),
//             email:this.email,
//             isAdmin: this.isAdmin,
//         },
//         //PASSING THE SECRET KEY
//         process.env.JWT_SECRET_KEY,{
//             expiresIn:"30d",
//         }
//     )
//     } catch (error) {
//         console.error(error);
//     }
// }

// // define the model or collection name
// const User = new mongoose.model("Users", userSchema);
// module.exports = User;



// updated use-model.js
const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    }, 
    email: {
        type: String,
        required: true,
        unique: true,
    }, 
    phone: {
        type: String,
        required: false,
    }, 
    password: {
        type: String,
        required: function() { return !this.isGoogleUser },
    },
    isAdmin: {
        type: Boolean,
        default: true,
    },
    isGoogleUser: {
        type: Boolean,
        default: false,
    },
    profilePicture: {
        type: String,
        default: "", // Can hold a URL or base64 string
    },
    resetPasswordToken: {
        type: String,
    },
    resetPasswordExpires: {
        type: Date,
    },

});

// Hash password only for non-Google users
userSchema.pre("save", async function(next){
    const user = this;

    if (!user.isModified('password') || user.isGoogleUser) {
        return next();
    }

    try {
        const saltRound = 10;
        const hash_password = await bcrypt.hash(user.password, saltRound);
        user.password = hash_password;
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.methods.generateToken = async function() {
    try {
        return jwt.sign({
            userId: this._id.toString(),
            email: this.email,
            isAdmin: this.isAdmin,
        }, process.env.JWT_SECRET_KEY, {
            expiresIn: "30d",
        });
    } catch (error) {
        console.error(error);
    }
};

const User = mongoose.model("Users", userSchema);
module.exports = User;
