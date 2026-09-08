import "dotenv/config";
import bcrypt from "bcrypt";
import { pool } from "../config/database.js";

const ADMIN_FULL_NAME = "Palitpur Administrator";
const ADMIN_EMAIL = "dipnarayanghosh6@gmail.com";
const ADMIN_PASSWORD = "Dip@14102005";

async function createOrResetAdmin() {
  try {
    console.log("Creating/resetting admin account...");

    const passwordHash = await bcrypt.hash(
      ADMIN_PASSWORD,
      12
    );

    const existingUser = await pool.query(
      `
      SELECT id
      FROM users
      WHERE email = $1
      LIMIT 1
      `,
      [ADMIN_EMAIL]
    );

    if (existingUser.rows.length > 0) {
      const result = await pool.query(
        `
        UPDATE users
        SET
          full_name = $1,
          password_hash = $2,
          role = 'admin',
          email_verified = true,
          updated_at = NOW()
        WHERE email = $3
        RETURNING
          id,
          full_name,
          email,
          role,
          email_verified
        `,
        [
          ADMIN_FULL_NAME,
          passwordHash,
          ADMIN_EMAIL,
        ]
      );

      console.log("\n✅ ADMIN ACCOUNT RESET SUCCESSFULLY\n");
      console.log("================================");
      console.log(`ID       : ${result.rows[0].id}`);
      console.log(`Name     : ${result.rows[0].full_name}`);
      console.log(`Email    : ${result.rows[0].email}`);
      console.log(`Password : ${ADMIN_PASSWORD}`);
      console.log(`Role     : ${result.rows[0].role}`);
      console.log(`Verified : ${result.rows[0].email_verified}`);
      console.log("================================\n");

      return;
    }

    const result = await pool.query(
      `
      INSERT INTO users (
        full_name,
        email,
        password_hash,
        role,
        email_verified
      )
      VALUES (
        $1,
        $2,
        $3,
        'admin',
        true
      )
      RETURNING
        id,
        full_name,
        email,
        role,
        email_verified
      `,
      [
        ADMIN_FULL_NAME,
        ADMIN_EMAIL,
        passwordHash,
      ]
    );

    console.log("\n✅ ADMIN CREATED SUCCESSFULLY\n");
    console.log("================================");
    console.log(`ID       : ${result.rows[0].id}`);
    console.log(`Name     : ${result.rows[0].full_name}`);
    console.log(`Email    : ${result.rows[0].email}`);
    console.log(`Password : ${ADMIN_PASSWORD}`);
    console.log(`Role     : ${result.rows[0].role}`);
    console.log(`Verified : ${result.rows[0].email_verified}`);
    console.log("================================\n");

  } catch (error) {
    console.error("\n❌ Failed to create/reset admin:");
    console.error(error.message);
    console.error(error.code || "");

    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

createOrResetAdmin();