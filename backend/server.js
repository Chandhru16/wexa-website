const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const connectDB = require("./config/db");

// Load Environment Variables
dotenv.config();

// Connect MongoDB
connectDB();

const app = express();

// =============================
// Security Middleware
// =============================
app.use(helmet());

// =============================
// CORS
// =============================
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

// =============================
// Body Parser
// =============================
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({
    extended: true,
    limit: "10mb"
}));

// =============================
// Logger
// =============================
app.use(morgan("dev"));

// =============================
// Rate Limiter
// =============================
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 Minutes
    max: 100,
    message: {
        success: false,
        message: "Too many requests. Please try again later."
    }
});

app.use(limiter);

// =============================
// Health Check
// =============================
app.get("/", (req, res) => {

    res.status(200).json({
        success: true,
        company: "WEXA",
        message: "🚀 WEXA Backend API Running Successfully",
        version: "1.0.0"
    });

});

// =============================
// API Routes
// =============================
app.use("/api/contact", require("./routes/contact"));

// =============================
// 404 Route
// =============================
app.use((req, res) => {

    res.status(404).json({
        success: false,
        message: "API Route Not Found"
    });

});

// =============================
// Global Error Handler
// =============================
app.use((err, req, res, next) => {

    console.error(err.stack);

    res.status(500).json({

        success: false,

        message: "Internal Server Error"

    });

});

// =============================
// Start Server
// =============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log(`
====================================
🚀 WEXA Backend Started Successfully
====================================
Server : http://localhost:${PORT}
Mode   : ${process.env.NODE_ENV || "development"}
====================================
`);

});