import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import path from "path"; // <-- 1. Import path for static folders
import { fileURLToPath } from "url"; // <-- 2. Needed for ESM __dirname resolution

import { env } from "./config/env.js";
import { testDatabaseConnection } from "./config/database.js";

import routes from "./routes/index.js";

import {
  notFoundHandler,
  errorHandler,
} from "./middleware/error.middleware.js";

// ESM __dirname definition
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

/*
|--------------------------------------------------------------------------
| Security
|--------------------------------------------------------------------------
*/

app.use(helmet());

app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  })
);

/*
|--------------------------------------------------------------------------
| Body Parsing
|--------------------------------------------------------------------------
*/

app.use(
  express.json({
    limit: "1mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "1mb",
  })
);

app.use(cookieParser());

/*
|--------------------------------------------------------------------------
| Static Uploads (Added for Admin Device Image Uploads)
|--------------------------------------------------------------------------
*/
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/*
|--------------------------------------------------------------------------
| Logging
|--------------------------------------------------------------------------
*/

if (env.nodeEnv !== "test") {
  app.use(morgan("dev"));
}

/*
|--------------------------------------------------------------------------
| Root
|--------------------------------------------------------------------------
*/

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    name: "PalitpurConnect API",
    version: "v1",
    message: "Welcome to PalitpurConnect API",
  });
});

/*
|--------------------------------------------------------------------------
| API Root
|--------------------------------------------------------------------------
*/

app.get("/api/v1", (req, res) => {
  res.status(200).json({
    success: true,
    name: "PalitpurConnect API",
    version: "v1",
    message: "PalitpurConnect API is running",
  });
});

/*
|--------------------------------------------------------------------------
| Health Check
|--------------------------------------------------------------------------
*/

app.get("/api/v1/health", async (req, res) => {
  try {
    const database = await testDatabaseConnection();

    res.status(200).json({
      success: true,
      message: "PalitpurConnect API is healthy",
      database: "connected",
      timestamp: database.now,
    });
  } catch (error) {
    console.error("Health check failed:", error);

    res.status(503).json({
      success: false,
      message: "Database connection failed",
    });
  }
});

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

app.use("/api/v1", routes);

/*
|--------------------------------------------------------------------------
| 404 Handler
|--------------------------------------------------------------------------
*/

app.use(notFoundHandler);

/*
|--------------------------------------------------------------------------
| Global Error Handler
|--------------------------------------------------------------------------
*/

app.use(errorHandler);

export default app;