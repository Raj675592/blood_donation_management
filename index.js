const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
require("dotenv").config();

const { connectToMongoDB } = require("./connect");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const adminRoutes = require("./routes/admin");
const appointmentRoutes = require("./routes/appointments");
const bloodRequestRoutes = require("./routes/bloodRequests");
const inventoryRoutes = require("./routes/inventory");
const staticRouter = require("./routes/staticRouter");

const app = express();
const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

// CORS configuration - only allow origins from environment variables
const rawClientUrls = "localhost:3000" || process.env.CLIENT_URL;
const allowedOrigins = rawClientUrls
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

// Add localhost only in development
if (process.env.NODE_ENV === "development") {
  allowedOrigins.push("http://localhost:3000");
}

// Vercel pattern for rotating deployment URLs (backup for new deployments)
const vercelProjectPattern =
  /^https:\/\/blood-donation-frontend-[a-z0-9-]+-raj675592s-projects\.vercel\.app$/i;

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests (e.g., server-to-server) with no origin
    if (!origin) return callback(null, true);

    // Check explicit allowlist and Vercel pattern
    if (allowedOrigins.includes(origin) || vercelProjectPattern.test(origin)) {
      return callback(null, true);
    }

    // Log and reject unauthorized origins
    console.warn(`CORS: Blocked unauthorized origin - ${origin}`);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/build")));
}

// Unified Health Check endpoint (single definition)
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "OK",
    message: "Blood Donation Management API is running",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    port: PORT,
    allowedOrigins: {
      explicit: allowedOrigins,
      vercelPattern: vercelProjectPattern.toString(),
    },
  });
});

app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api/appointments", appointmentRoutes);

app.use("/api/blood-requests", bloodRequestRoutes);

app.use("/api/inventory", inventoryRoutes);

app.use("/", staticRouter);

app.use("/api", (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `API endpoint ${req.originalUrl} not found`,
    timestamp: new Date().toISOString(),
  });
});

app.use((error, req, res, next) => {
  console.error("Unhandled error:", error);

  res.status(error.status || 500).json({
    success: false,
    message:
      process.env.NODE_ENV === "development"
        ? error.message
        : "Internal Server Error",
  });
});

const startServer = async () => {
  try {
    console.log("🔄 Connecting to MongoDB...");
    await connectToMongoDB(MONGO_URI);
    console.log("✅ Connected to MongoDB successfully");

    app.listen(PORT, () => {
      console.log("🩸 Blood Donation Management System");
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📡 API Base URL: http://localhost:${PORT}/api`);
      console.log(`🏥 API response check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();

module.exports = app;
