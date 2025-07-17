 const mongoose = require('mongoose');

//to connect the mongoose with the uri
// const URI = "mongodb+srv://divya:DivyaDhiman220902@cluster0.vp0xyfe.mongodb.net/admin_panel?appName=mongosh+2.5.0"
const URI = process.env.MONGODB_URI;


//mongoose.connect(URI);

const connectDB = async ()=>{
    try {
        await mongoose.connect(URI);
        console.log("Connection Succesful to database");
    } catch (error) {
        console.error("Database connection failed");
        process.exit(0);
    }
}

module.exports = connectDB;