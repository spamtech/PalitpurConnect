
import { query } from "../config/database.js";

import {
  hashPassword,
  comparePassword,
} from "../utils/password.js";

import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/jwt.js";

import {
  createEmailOtp,
} from "./otp.service.js";

/*
|--------------------------------------------------------------------------
| Register User
|--------------------------------------------------------------------------
*/

export async function registerUser({
  fullName,
  email,
  password,
}) {
  const normalizedEmail = email
    .trim()
    .toLowerCase();

  /*
  |--------------------------------------------------------------------------
  | Check Existing User
  |--------------------------------------------------------------------------
  */

  const existingUser = await query(
    `
      SELECT id
      FROM users
      WHERE email = $1
      LIMIT 1
    `,
    [normalizedEmail]
  );

  if (existingUser.rows.length > 0) {
    const error = new Error(
      "An account with this email already exists"
    );

    error.statusCode = 409;

    throw error;
  }

  /*
  |--------------------------------------------------------------------------
  | Hash Password
  |--------------------------------------------------------------------------
  */

  const passwordHash =
    await hashPassword(password);

  /*
  |--------------------------------------------------------------------------
  | Create Citizen Account
  |--------------------------------------------------------------------------
  */

  const result = await query(
    `
      INSERT INTO users
      (
        full_name,
        email,
        password_hash,
        role,
        email_verified
      )
      VALUES
      (
        $1,
        $2,
        $3,
        'citizen',
        false
      )
      RETURNING
        id,
        full_name,
        email,
        role,
        email_verified,
        created_at
    `,
    [
      fullName.trim(),
      normalizedEmail,
      passwordHash,
    ]
  );

  const user = result.rows[0];

  /*
  |--------------------------------------------------------------------------
  | Generate & Send Verification OTP
  |--------------------------------------------------------------------------
  */

  await createEmailOtp(
    user.email,
    user.id
  );

  /*
  |--------------------------------------------------------------------------
  | Return User
  |--------------------------------------------------------------------------
  */

  return user;
}

/*
|--------------------------------------------------------------------------
| Login User
|--------------------------------------------------------------------------
*/

export async function loginUser({
  email,
  password,
}) {
  const normalizedEmail = email
    .trim()
    .toLowerCase();

  /*
  |--------------------------------------------------------------------------
  | Find User
  |--------------------------------------------------------------------------
  */

  const result = await query(
    `
      SELECT *
      FROM users
      WHERE email = $1
      LIMIT 1
    `,
    [normalizedEmail]
  );

  /*
  |--------------------------------------------------------------------------
  | User Not Found
  |--------------------------------------------------------------------------
  */

  if (result.rows.length === 0) {
    const error = new Error(
      "Invalid email or password"
    );

    error.statusCode = 401;

    throw error;
  }

  const user = result.rows[0];

  /*
  |--------------------------------------------------------------------------
  | Check Password
  |--------------------------------------------------------------------------
  */

  const validPassword =
    await comparePassword(
      password,
      user.password_hash
    );

  if (!validPassword) {
    const error = new Error(
      "Invalid email or password"
    );

    error.statusCode = 401;

    throw error;
  }

  /*
  |--------------------------------------------------------------------------
  | Email Verification
  |--------------------------------------------------------------------------
  |
  | Citizen:
  |   Email verification is required.
  |
  | Admin / Staff:
  |   Email verification is NOT required.
  |
  */

  if (
    user.role === "citizen" &&
    !user.email_verified
  ) {
    const error = new Error(
      "Please verify your email before logging in"
    );

    error.statusCode = 403;

    throw error;
  }

  /*
  |--------------------------------------------------------------------------
  | Update Last Login
  |--------------------------------------------------------------------------
  */

  await query(
    `
      UPDATE users
      SET last_login_at = NOW()
      WHERE id = $1
    `,
    [user.id]
  );

  /*
  |--------------------------------------------------------------------------
  | Generate Access Token
  |--------------------------------------------------------------------------
  */

  const accessToken =
    generateAccessToken({
      id: user.id,
      role: user.role,
    });

  /*
  |--------------------------------------------------------------------------
  | Generate Refresh Token
  |--------------------------------------------------------------------------
  */

  const refreshToken =
    generateRefreshToken({
      id: user.id,
    });

  /*
  |--------------------------------------------------------------------------
  | Return Authentication Data
  |--------------------------------------------------------------------------
  */

  return {
    user: {
      id: user.id,
      fullName: user.full_name,
      email: user.email,
      role: user.role,
    },

    accessToken,

    refreshToken,
  };
}

