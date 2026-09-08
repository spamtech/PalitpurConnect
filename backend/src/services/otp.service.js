import { query } from "../config/database.js";
import {
  generateOtp,
  hashOtp,
  getOtpExpiry,
} from "../utils/otp.js";

import {
  sendVerificationOtp,
  sendPasswordResetOtp,
} from "./email.service.js";

/*
|--------------------------------------------------------------------------
| Create Email Verification OTP
|--------------------------------------------------------------------------
*/

export async function createEmailOtp(email, userId = null) {
  const otp = generateOtp();
  const otpHash = hashOtp(otp);
  const expiresAt = getOtpExpiry(10);

  // Remove previous unused verification OTPs
  await query(
    `
      DELETE FROM email_otps
      WHERE email = $1
        AND purpose = 'email_verification'
        AND verified_at IS NULL
    `,
    [email]
  );

  // Save new OTP
  await query(
    `
      INSERT INTO email_otps
      (
        email,
        user_id,
        otp_hash,
        purpose,
        expires_at,
        attempts
      )
      VALUES ($1, $2, $3, 'email_verification', $4, 0)
    `,
    [
      email,
      userId,
      otpHash,
      expiresAt,
    ]
  );

  // Send OTP
  await sendVerificationOtp(email, otp);

  return otp;
}

/*
|--------------------------------------------------------------------------
| Create Password Reset OTP
|--------------------------------------------------------------------------
*/

export async function createPasswordResetOtp(
  email,
  userId = null
) {
  const otp = generateOtp();
  const otpHash = hashOtp(otp);
  const expiresAt = getOtpExpiry(10);

  await query(
    `
      DELETE FROM email_otps
      WHERE email = $1
        AND purpose = 'password_reset'
        AND verified_at IS NULL
    `,
    [email]
  );

  await query(
    `
      INSERT INTO email_otps
      (
        email,
        user_id,
        otp_hash,
        purpose,
        expires_at,
        attempts
      )
      VALUES ($1, $2, $3, 'password_reset', $4, 0)
    `,
    [
      email,
      userId,
      otpHash,
      expiresAt,
    ]
  );

  await sendPasswordResetOtp(email, otp);

  return otp;
}