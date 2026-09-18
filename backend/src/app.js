
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import path from "path";
import { fileURLToPath } from "url";

import { env } from "./config/env.js";
import { testDatabaseConnection } from "./config/database.js";
import "./config/passport.js"; // Initialize passport configuration

import routes from "./routes/index.js";

import {
  notFoundHandler,
  errorHandler,
} from "./middleware/error.middleware.js";

// ESM __dirname definition
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.set("trust proxy", 1);

/*
|--------------------------------------------------------------------------
| Security
|--------------------------------------------------------------------------
*/

app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: false,
  })
);

/*
|--------------------------------------------------------------------------
| CORS
|--------------------------------------------------------------------------
*/

app.use(
  cors({
    origin: "https://palitpurconnect-frontend.onrender.com",
    credentials: true,
  })
);
/*
|--------------------------------------------------------------------------
| Body Parsing & Cookies
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
| Session
|--------------------------------------------------------------------------
*/

app.use(
  session({
    secret: process.env.SESSION_SECRET,

    resave: false,

    saveUninitialized: false,

    cookie: {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);

/*
|--------------------------------------------------------------------------
| Passport
|--------------------------------------------------------------------------
*/

app.use(passport.initialize());
app.use(passport.session());

/*
|--------------------------------------------------------------------------
| Static Uploads
|--------------------------------------------------------------------------
*/

app.use(
  "/uploads",
  (req, res, next) => {
    res.setHeader(
      "Cross-Origin-Resource-Policy",
      "cross-origin"
    );

    next();
  },
  express.static(path.join(__dirname, "uploads"))
);

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
| Authentication Routes
|--------------------------------------------------------------------------
|
| Google OAuth is handled inside:
|
| src/routes/auth.routes.js
|
| These routes are mounted below:
|
| GET  /api/v1/auth/google
| GET  /api/v1/auth/google/callback
|
| Do NOT define /auth/google or /auth/google/callback here.
|
|--------------------------------------------------------------------------
*/

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

