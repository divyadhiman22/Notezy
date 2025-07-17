//server.js
require('dotenv').config();
const express = require("express");
const cors = require("cors");
const app = express();
const authRouter = require("./router/auth-router")
const contactRouter = require("./router/contact-router")
const serviceRouter = require("./router/service-router")
const notesRouter = require("./router/notes-router")
const profileRouter = require("./router/profile-router")
const connectDb = require("./utils/db");
const errorMiddleware = require('./middlewares/error-middleware');
const path = require("path");

//let's tackle cors
const corsOptions = {
    origin:"http://localhost:5173",
    methods:"GET, POST, PUT, DELETE, PATCH, HEAD",
    credentials: true,
};
app.use(cors(corsOptions));
  
// using express middleware
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// for auth routers
app.use("/api/auth", authRouter);//we have used this for navigation

// for contact router
app.use("/api/form", contactRouter);

// for service router
app.use("/api/data", serviceRouter);

// for notes route
app.use("/api/notes", notesRouter);

// for profile route
app.use("/api/user", profileRouter);

// using error middleware
app.use(errorMiddleware);

// using connectDb function to connect database
// making our custom port and agr hamara connection database ke sath perfectly hota hai tabhi server port run kro
// CONNECTING DATABASE WITH SERVER
const PORT = 5000;
connectDb().then(()=>{
    app.listen(PORT, ()=>{
        console.log(`Server is running at port: ${PORT}`);
    });
});