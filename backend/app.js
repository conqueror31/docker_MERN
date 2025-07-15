import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { errorMiddleware } from "./middlewares/error.js";
import reservationRouter from "./routes/reservationRoute.js";
import { dbConnection } from "./database/dbConnection.js";

// Initialize express app
const app = express();

// Load environment variables early
dotenv.config({ path: "./config.env" });

// Enhanced security and CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL?.split(",") || "http://localhost",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept", "X-Requested-With"],
  credentials: true,
  optionsSuccessStatus: 204,
  maxAge: 86400 // Cache CORS preflight for 24 hours
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.json({ limit: "10kb" })); // Prevent DOS attacks
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    dbStatus: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
  });
});

// Routes
app.use("/api/v1/reservations", reservationRouter); // Pluralized endpoint

// Database connection
dbConnection();
// ✅ Avant d'appeler app.use("*", ...) :
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API is running!",
    endpoints: {
      get_reservations: "/api/v1/reservations/send"
    }
  });
});

// Error handling middleware (should be last)
app.use(errorMiddleware);

// Handle 404 routes
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint not found"
  });
});

export default app;