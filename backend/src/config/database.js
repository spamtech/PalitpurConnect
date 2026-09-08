import pg from "pg";
import { env } from "./env.js";

const { Pool } = pg;

export const pool = new Pool({
  connectionString: env.databaseUrl,

  ssl:
    env.nodeEnv === "production" || env.databaseUrl.includes("neon.tech")
      ? {
          rejectUnauthorized: false,
        }
      : false,

  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

pool.on("error", (error) => {
  console.error("Unexpected PostgreSQL pool error:", error);
});

export async function query(text, params = []) {
  return pool.query(text, params);
}

export async function testDatabaseConnection() {
  const result = await pool.query("SELECT NOW() AS now");

  return result.rows[0];
}