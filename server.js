require("dotenv").config();
const ConnectDB = require("./config/DB")
const app = require("./app");
const mongoose = require("mongoose");
const winston = require("winston");
require("winston-daily-rotate-file");

const PORT = process.env.PORT || 5000;

// ===== Winston Logging Setup =====
const transport = new winston.transports.DailyRotateFile({
    dirname: "logs",
    filename: "server-%DATE%.log",
    datePattern: "YYYY-MM-DD",
    maxFiles: "14d",
});

const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [transport, new winston.transports.Console()],
});

// ===== Connect Database and Start Server =====
ConnectDB()
    .then(() => {
        app.listen(PORT, "0.0.0.0", () => {
            logger.info(`✅ Server running on port ${PORT}`);
            console.log(`✅ Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        logger.error("❌ MongoDB connection failed", err);
        console.error("MongoDB connection failed:", err);
        process.exit(1);
    });