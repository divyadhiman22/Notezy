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
        default: "", 
    },
    resetPasswordToken: {
        type: String,
    },
    resetPasswordExpires: {
        type: Date,
    },

});


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
