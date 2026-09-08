
import app from "./app.js";
import { env } from "./config/env.js";
import { pool } from "./config/database.js";
import { verifyEmailTransport } from "./services/email.service.js";

async function startServer() {
  try {
    // Test Neon PostgreSQL connection
    await pool.query("SELECT 1");

    console.log("✅ Neon PostgreSQL connected");

    // Test Gmail SMTP connection
    await verifyEmailTransport();

    const server = app.listen(env.port, "0.0.0.0", () => {
  console.log(`
╔════════════════════════════════════════════╗
║         PalitpurConnect Backend            ║
╠════════════════════════════════════════════╣
║ Environment : ${env.nodeEnv}
║ Server      : http://0.0.0.0:${env.port}
║ API         : http://0.0.0.0:${env.port}/api/v1
║ Health      : http://0.0.0.0:${env.port}/api/v1/health
╚════════════════════════════════════════════╝
  `);
});

    const shutdown = async () => {
      console.log("\nShutting down server...");

      server.close(async () => {
        await pool.end();

        console.log("Database connection closed.");

        process.exit(0);
      });
    };

    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);
  } catch (error) {
    console.error("❌ Failed to start server:", error);

    await pool.end().catch(() => {});

    process.exit(1);
  }
}

startServer();

