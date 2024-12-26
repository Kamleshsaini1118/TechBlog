const dotenv = require("dotenv")
dotenv.config();
const express = require("express");
const app = express();
const cors = require("cors");
const connectDb = require("./config/db");
const userRoute = require("./routes/userRoute")
const postRoute = require("./routes/postRoute")
const cookieParser = require("cookie-parser")
const path = require("path")

// connect the database 
connectDb();

// Middleware

// Serve static files (images) from the 'public/images' directory
app.use('/images', express.static(path.join(__dirname, './public/images')));

app.use(
    cors({
        origin: "http://localhost:5173", // Frontend ka origin
        credentials: true, // Cookies ko allow karega
    })
);
app.use(express.json());
app.use(cookieParser());

// ALL ENDPOINTS FOR USER ROUTE
app.use("/users", userRoute)

// ALL ENDPOINTS FOR POST ROUTE
app.use("/posts", postRoute)

module.exports = app;