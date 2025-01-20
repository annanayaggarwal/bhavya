require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const promClient = require("prom-client");
const passport = require("passport");
const session = require("express-session");
const { connectDBs, registerSchema } = require("./utils/db");
// const { admin, bucket } = require("./utils/firebase");
const https = require("https");

// Schema imports
// const ResumeSchema = require("./models/Resume")
// const FactoryWorkerSchema = require("./models/FactoryWorker");
// const ManufacturerSchema = require("./models/Manufacturer");
// const ApplicationSchema = require("./models/Application");
// const JobSchema = require("./models/Job");
// const PostSchema = require("./models/Post");
// const CommunitySchema = require("./models/Community");
// const ConnectionSchema = require("./models/Connection");
// const MessageSchema = require("./models/Message");
// const NotificationLogSchema = require("./models/Notification");
// const PushTokenSchema = require("./models/PushToken")
// const AdminSchema = require("./models/Admin"); // New Admin schema
// const OfferLetterSchema = require('./models/OfferLetter');
// const loginTrackingSchema = require('./models/loginTracking');
// const referralSchema = require('./models/Referral');
// const workerSchema = require("./models/Lenskart");
// const LenskartAdminSchema = require("./models/LenskartAdmin");

// const { initializeScheduledTasks } = require('./controllers/report');
// const workerReportRoutes = require('./routes/reportRoutes');
const app = express();
// initializeScheduledTasks();
// Prometheus metrics setup
const collectDefaultMetrics = promClient.collectDefaultMetrics;
collectDefaultMetrics({ timeout: 5000 });

const httpRequestDurationMicroseconds = new promClient.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "code"],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10],
});

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(",")
      : "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options('*', cors());

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use(morgan(process.env.NODE_ENV === "development" ? "dev" : "combined"));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10000,
});
app.use(limiter);

app.use(
  session({
    secret: process.env.SESSION_SECRET || "your_session_secret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === "production" },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Metrics middleware
app.use((req, res, next) => {
  const start = process.hrtime();
  res.on("finish", () => {
    const duration = process.hrtime(start);
    const durationInSeconds = duration[0] + duration[1] / 1e9;
    httpRequestDurationMicroseconds
      .labels(req.method, req.route ? req.route.path : req.path, res.statusCode)
      .observe(durationInSeconds);
  });
  next();
});

// Database connection and server startup
const startServer = async () => {
  try {
    await connectDBs();
    console.log("All databases connected successfully");

    // Register schemas
    console.log("Registering schemas...");
    // registerSchema("manufacturers", "Manufacturer", ManufacturerSchema);
    // registerSchema("lenskart_workers", "workers", workerSchema);
    // registerSchema("factory_workers", "Application", ApplicationSchema);
    // registerSchema("manufacturers", "Job", JobSchema);
    // registerSchema("common", "Post", PostSchema);
    // registerSchema("common", "Community", CommunitySchema);
    // registerSchema("common", "Connection", ConnectionSchema);
    // registerSchema("common", "Message", MessageSchema);
    // registerSchema("common", "Notification", NotificationLogSchema);
    // registerSchema("common", "PushNotification", PushTokenSchema);
    // registerSchema("common", "Resume", ResumeSchema);
    // registerSchema("common", "Admin", AdminSchema); // Register Admin schema
    // registerSchema('common', 'OfferLetter', OfferLetterSchema);
    // registerSchema('common', 'LoginTracking', loginTrackingSchema);
    // registerSchema("factory_workers", "FactoryWorker", FactoryWorkerSchema);
    // registerSchema("factory_workers", "Referral", referralSchema);
    // registerSchema("lenskart_admins", "Admins", LenskartAdminSchema);
    // registerSchema("lenskart_workers", "Manufacturer", ManufacturerSchema);
    // registerSchema("lenskart_workers", "Application", ApplicationSchema);
    // registerSchema("lenskart_workers", "Job", JobSchema);
    
    console.log("All schemas registered");

    // Import routes
    // const authRoutes = require("./routes/authRoutes");
    // const jobRoutes = require("./routes/jobRoutes");
    // const applicationRoutes = require("./routes/applicationRoutes");
    // const communityRoutes = require("./routes/communtiyRoutes");
    // const connectionRoutes = require("./routes/connectionRoutes");
    // const manufacturerRoutes = require("./routes/manufacturerRoutes");
    // const messageRoutes = require("./routes/messageRoutes");
    // const notificationRoutes = require("./routes/notificationRoutes");
    // const postRoutes = require("./routes/postRoutes");
    // const adminRoutes = require("./routes/adminRoutes"); // New admin routes
    // const offerLetterRoutes = require('./routes/offerLetterRoutes');
    // const resumeRoutes = require('./routes/resumeRoutes');
    // const factoryWorkerRoutes = require("./routes/factoryWorkerRoutes");
    // const lenskartWorkerRoutes = require("./routes/lenskartRoutes");
    // const referralRoutes = require('./routes/referralRoutes');
    // const lenskartAdminsRoutes = require('./routes/lenskartAdminRoutes');
    // const lenskartagreementRoutes = require('./routes/lenskartagreementRoutes');


    // Routes
//     app.use("/api/auth", authRoutes);
//     app.use("/api/lenskart",lenskartWorkerRoutes);
//     app.use("/api/lenskart-admin",lenskartAdminsRoutes);
//     app.use("/api/jobs", jobRoutes);
//     app.use("/api/applications", applicationRoutes);
//     app.use("/api/communities", communityRoutes);
//     app.use("/api/connections", connectionRoutes);
//     app.use("/api/job-seekers", factoryWorkerRoutes);
//     app.use("/api/employers", manufacturerRoutes);
//     app.use("/api/messages", messageRoutes);
//     app.use("/api/notifications", notificationRoutes);
//     app.use("/api/posts", postRoutes);
//     app.use('/api/admin/offer-letter', offerLetterRoutes);
//     app.use('/api/resume', resumeRoutes);
//     app.use("/api/admin", adminRoutes); // New admin routes
//     app.use("/api/referral",referralRoutes);
//     app.use("/api/agreement",lenskartagreementRoutes);
// app.use('/api/worker-reports', workerReportRoutes);

    // Metrics endpoint
    app.get("/metrics", async (req, res) => {
      res.set("Content-Type", promClient.register.contentType);
      res.end(await promClient.register.metrics());
    });

    // Health check endpoint
    app.get("/health", (req, res) => {
      res.status(200).json({ status: "OK" });
    });

    // 404 handler
    app.use((req, res, next) => {
      res.status(404).json({ message: "Not Found" });
    });

    // Error handling middleware
    app.use((err, req, res, next) => {
      console.error(err.stack);

      if (err.name === "ValidationError") {
        return res.status(400).json({ message: err.message });
      }

      if (err.name === "CastError") {
        return res.status(400).json({ message: "Invalid ID format" });
      }

      if (err.name === "JsonWebTokenError") {
        return res.status(401).json({ message: "Invalid token" });
      }

      res.status(err.status || 500).json({
        message:
          process.env.NODE_ENV === "production"
            ? "An unexpected error occurred"
            : err.message,
      });
    });

    const PORT = process.env.PORT || 4000;
    const server = app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server is running on port ${PORT}`);
    });

    // Graceful shutdown
    process.on("SIGTERM", () => {
      console.log("SIGTERM received. Shutting down gracefully");
      server.close(() => {
        console.log("Process terminated");
      });
    });
  } catch (error) {
    console.error("Failed to start the server:", error);
    process.exit(1);
  }
};

startServer();
