const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const csrf = require("csurf");
const morgan = require("morgan");
const xssClean = require("xss-clean"); 
const session = require("express-session");
const MongoStore = require("connect-mongo");
require("dotenv").config();

// const conditionalRateLimit = require("./middlewares/conditionalRateLimit");

// Import routes
// Example: const authRoute = require("./routes/authRoute");

const authRoute = require("./routes/auth.route")

// ---------------------- END of Importing Routes

const app = express();

// ===== Middleware Setup =====

// Security headers (with file policy for image loading)
app.use(
    helmet({
        crossOriginResourcePolicy: { policy: "cross-origin" },
    })
);

// CORS config
app.use(
    cors({
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        credentials: true,
    })
);

// JSON parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true })); // Added to handle URL-encoded form data
app.use(cookieParser());
app.use(morgan("combined"));




// app.use((req, res, next) => {
//     req.body = mongoSanitize(req.body);
//     req.query = mongoSanitize(req.query);
//     req.params = mongoSanitize(req.params);
//     next();
// });
// app.use(xss());

// uncomment for RateLimite
// app.use(conditionalRateLimit);

// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 150, // limit each IP to 150 requests per window
//   message: "Too many requests from this IP, please try again later.",
// });
// app.use(limiter);

// ---------------------------- END of RateLimite --------------------

// ===== Session Management =====
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URI,
            collectionName: "sessions",
        }),
        cookie: {
            secure: process.env.NODE_ENV === "production",
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        },
    })
);


// ===== CSRF Protection =====
// const csrfProtection = csrf({
//     cookie: true,
// });
// app.use(csrfProtection);


// ===== Static Files =====
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// --------------- START routes -------------------
// eg: app.use('/api/route_name)

// auth route
// app.use('/api/auth', authRoute)

app.use('/api/auth', authRoute)


// -------------- END routes-----------------------


// ===== Health Checks =====
app.get("/api", (req, res) => {
    res.status(200).send(`✅ API Server running securely`);
});

app.get("/", (req, res) => {
    res.status(200).send(`✅ Root Server running securely`);
});


// ===== Error Handling =====
app.use((err, req, res, next) => {
    console.error("❌ Error:", err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
});

module.exports = app;