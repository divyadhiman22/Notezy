require('dotenv').config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

const authRouter = require("./router/auth-router");
const contactRouter = require("./router/contact-router");
const serviceRouter = require("./router/service-router");
const notesRouter = require("./router/notes-router");
const profileRouter = require("./router/profile-router");


const connectDb = require("./utils/db");
const errorMiddleware = require('./middlewares/error-middleware');


const allowedOrigins = [
  "http://localhost:5173",
  "https://notezy-sigma.vercel.app"
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET, POST, PUT, DELETE, PATCH, HEAD",
  credentials: true,
};


app.use(cors(corsOptions));


app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/api/auth", authRouter);
app.use("/api/form", contactRouter);
app.use("/api/data", serviceRouter);
app.use("/api/notes", notesRouter);
app.use("/api/user", profileRouter);


app.use(errorMiddleware);


const PORT = process.env.PORT || 5000;

connectDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running at port: ${PORT}`);
  });
});
