// const dotenv = require("dotenv")
// dotenv.config();
// const express = require("express");
// const app = express();
// const cors = require("cors");
// const connectDb = require("./config/db");
// const userRoute = require("./routes/userRoute")
// const postRoute = require("./routes/postRoute")
// const cookieParser = require("cookie-parser")
// const path = require("path")

// // connect the database 
// connectDb();

// // Middleware

// // Serve static files (images) from the 'public/images' directory
// app.use('/images', express.static(path.join(__dirname, './public/images')));

// app.use(
//     cors({
//         origin: ["http://localhost:5173", "https://tech-blog-cxl39nq2o-kr-projects.vercel.app"], // Frontend ka origin
//         credentials: true, // Cookies ko allow karega
//     })
// );

// // Handle OPTIONS preflight requests
// app.options("*", cors());

// // Additional headers for safety (optional)
// app.use((req, res, next) => {
//     res.header("Access-Control-Allow-Origin", req.headers.origin); // Dynamic origin
//     res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
//     res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
//     res.header("Access-Control-Allow-Credentials", "true");
//     next();
// });

// app.use(express.json());
// app.use(cookieParser());

// // ALL ENDPOINTS FOR USER ROUTE
// app.use("/users", userRoute)

// // ALL ENDPOINTS FOR POST ROUTE
// app.use("/posts", postRoute)

// module.exports = app;


const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const cors = require("cors");
const connectDb = require("./config/db");
const userRoute = require("./routes/userRoute");
const postRoute = require("./routes/postRoute");
const cookieParser = require("cookie-parser");
const path = require("path");

// Connect the database
connectDb();

// Middleware

// Serve static files (images) from the 'public/images' directory
app.use('/images', express.static(path.join(__dirname, './public/images')));

// ✅ Proper CORS Setup
const allowedOrigins = ["http://localhost:5173", "https://tech-blog-cxl39nq2o-kr-projects.vercel.app"];

app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

// ✅ Handle Preflight Requests Properly
app.options("*", (req, res) => {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
    res.sendStatus(200);
});

// Middleware
app.use(express.json());
app.use(cookieParser());

// ALL ENDPOINTS FOR USER ROUTE
app.use("/users", userRoute);

// ALL ENDPOINTS FOR POST ROUTE
app.use("/posts", postRoute);

module.exports = app;
