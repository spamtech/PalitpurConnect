import { query } from "../config/database.js";
import {
  registerUser,
  loginUser,
} from "../services/auth.service.js";
import { hashOtp } from "../utils/otp.js";
import passport from "passport";

/*
|--------------------------------------------------------------------------
| Register
|--------------------------------------------------------------------------
*/

export async function register(req, res, next) {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Full name, email and password are required",
      });
    }

    const user = await registerUser({
      fullName,
      email,
      password,
    });

    return res.status(201).json({
      success: true,
      message:
        "Registration successful. Please verify your email with the OTP.",
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
}

/*
|--------------------------------------------------------------------------
| Verify Email
|--------------------------------------------------------------------------
*/

export async function verifyEmail(req, res, next) {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const result = await query(
      `
        SELECT
          id,
          user_id,
          email,
          otp_hash,
          expires_at,
          verified_at,
          attempts
        FROM email_otps
        WHERE email = $1
          AND purpose = 'email_verification'
          AND verified_at IS NULL
        ORDER BY created_at DESC
        LIMIT 1
      `,
      [normalizedEmail]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "OTP not found or already used",
      });
    }

    const otpRecord = result.rows[0];

    if (new Date(otpRecord.expires_at) < new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired",
      });
    }

    if (otpRecord.attempts >= 5) {
      return res.status(429).json({
        success: false,
        message: "Too many OTP attempts",
      });
    }

    const otpHash = hashOtp(String(otp).trim());

    if (otpHash !== otpRecord.otp_hash) {
      await query(
        `
          UPDATE email_otps
          SET attempts = attempts + 1
          WHERE id = $1
        `,
        [otpRecord.id]
      );

      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    await query(
      `
        UPDATE email_otps
        SET verified_at = NOW()
        WHERE id = $1
      `,
      [otpRecord.id]
    );

    await query(
      `
        UPDATE users
        SET
          email_verified = true,
          updated_at = NOW()
        WHERE id = $1
      `,
      [otpRecord.user_id]
    );

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    next(error);
  }
}

/*
|--------------------------------------------------------------------------
| Login
|--------------------------------------------------------------------------
*/

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const result = await loginUser({
      email,
      password,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

/*
|--------------------------------------------------------------------------
| Current User
|--------------------------------------------------------------------------
*/

export async function me(req, res, next) {
  try {
    const result = await query(
      `
        SELECT
          id,
          full_name,
          email,
          role,
          email_verified,
          is_active,
          avatar_url,
          phone,
          address,
          village,
          district,
          state,
          last_login_at,
          created_at,
          updated_at
        FROM users
        WHERE id = $1
        LIMIT 1
      `,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const user = result.rows[0];

    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: "Your account is inactive",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
}

/*
|--------------------------------------------------------------------------
| Logout
|--------------------------------------------------------------------------
*/

export async function logout(req, res, next) {
  try {
    if (req.logout) {
      req.logout((err) => {
        if (err) return next(err);
      });
    }
    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    next(error);
  }
}

/*
|--------------------------------------------------------------------------
| Get All Users (Admin)
|--------------------------------------------------------------------------
*/

export async function getAllUsersAdmin(req, res, next) {
  try {
    const result = await query(
      `
        SELECT
          id,
          full_name,
          email,
          role,
          email_verified,
          is_active,
          avatar_url,
          phone,
          address,
          village,
          district,
          state,
          last_login_at,
          created_at,
          updated_at
        FROM users
        ORDER BY created_at DESC
      `
    );

    return res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    next(error);
  }
}

/*
|--------------------------------------------------------------------------
| Google OAuth Handlers
|--------------------------------------------------------------------------
*/

export const googleAuthRedirect = passport.authenticate("google", {
  scope: ["profile", "email"],
});

export const googleAuthCallback = (req, res, next) => {
  passport.authenticate(
    "google",
    {
      failureRedirect: `${process.env.CLIENT_URL || "http://localhost:5173"}/login?error=GoogleAuthFailed`,
    },
    (err, user, info) => {
      console.log("========== GOOGLE CALLBACK ==========");
      console.log("ERR:", err);
      console.log("USER:", user);
      console.log("INFO:", info);
      console.log("SESSION:", req.session);
      console.log("=====================================");

      if (err || !user) {
        return res.redirect(
          `${process.env.CLIENT_URL || "http://localhost:5173"}/login?error=GoogleAuthFailed`
        );
      }

      req.logIn(user, (loginErr) => {
        if (loginErr) {
          console.error("Google req.logIn error:", loginErr);
          return next(loginErr);
        }

        req.session.save((saveErr) => {
          if (saveErr) {
            console.error("Google session save error:", saveErr);
            return next(saveErr);
          }

          console.log("✅ Google login successful:", req.user);

          return res.redirect(
            `${process.env.CLIENT_URL || "http://localhost:5173"}/dashboard`
          );
        });
      });
    }
  )(req, res, next);
};