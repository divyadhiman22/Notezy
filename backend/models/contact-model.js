const mongoose = require('mongoose');


const contactSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    },
});

// create a model or collection
const Contact = new mongoose.model("Contact", contactSchema);
module.exports = Contact;