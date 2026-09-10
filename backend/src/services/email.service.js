import nodemailer from "nodemailer";
import { env } from "../config/env.js";

const smtpConfigured =
  Boolean(env.smtp.host) &&
  Boolean(env.smtp.user) &&
  Boolean(env.smtp.password) &&
  Boolean(env.smtp.from);

const transporter = smtpConfigured
  ? nodemailer.createTransport({
      host: env.smtp.host,
      port: env.smtp.port,
      secure: env.smtp.port === 465,
      auth: {
        user: env.smtp.user,
        pass: env.smtp.password,
      },
    })
  : null;

/*
|--------------------------------------------------------------------------
| Verify SMTP connection
|--------------------------------------------------------------------------
*/

export async function verifyEmailTransport() {
  if (!transporter) {
    console.warn("⚠️ SMTP is not configured.");
    return false;
  }

  try {
    await transporter.verify();

    console.log("✅ Gmail SMTP connection successful");

    return true;
  } catch (error) {
    console.error(
      "❌ Gmail SMTP connection failed:",
      error.message
    );

    return false;
  }
}

/*
|--------------------------------------------------------------------------
| Generic Email Sender
|--------------------------------------------------------------------------
*/

export async function sendEmail({ to, subject, text, html }) {
  if (!transporter) {
    console.warn("⚠️ SMTP is not configured.");
    console.warn("Email was NOT sent.");
    console.warn("To:", to);
    console.warn("Subject:", subject);

    return {
      sent: false,
      reason: "SMTP_NOT_CONFIGURED",
    };
  }

  try {
    const info = await transporter.sendMail({
      from: env.smtp.from,
      to,
      subject,
      text,
      html,
    });

    console.log("✅ Email sent successfully");
    console.log("To:", to);
    console.log("Message ID:", info.messageId);

    return {
      sent: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error("❌ Email sending failed:", error.message);

    throw new Error(
      "Unable to send email. Please try again later."
    );
  }
}

/*
|--------------------------------------------------------------------------
| Grievance Submission Confirmation Email
|--------------------------------------------------------------------------
*/

export async function sendGrievanceConfirmation(email, name, ticketNumber, category) {
  const subject = `[PalitpurConnect] Grievance Submitted - Ticket #${ticketNumber}`;

  const text = `
Hello ${name},

Your grievance regarding "${category}" has been successfully submitted.

Your Ticket Number is: ${ticketNumber}

You can track the status of your grievance anytime on PalitpurConnect using this ticket number.

Regards,
PalitpurConnect Team
  `.trim();

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Grievance Submitted</title>
</head>
<body style="margin:0; padding:0; background:#f1f5f9; font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:600px; margin:40px auto; background:#ffffff; border-radius:16px; overflow:hidden; border:1px solid #e2e8f0;">
    <div style="padding:28px; background:#4a2512; color:#faebd7; text-align:center;">
      <h1 style="margin:0;">PalitpurConnect</h1>
      <p style="margin:8px 0 0;">Digital Village Portal</p>
    </div>
    <div style="padding:32px;">
      <h2 style="margin-top:0; color:#221208;">Grievance Submitted Successfully</h2>
      <p style="color:#5a321a; line-height:1.6;">
        Hello <strong>${name}</strong>,<br>
        Your grievance regarding <strong>${category}</strong> has been received by the administration.
      </p>
      <div style="margin:28px 0; padding:20px; text-align:center; background:#faebd7; border:2px solid #221208; border-radius:12px;">
        <div style="font-size:12px; color:#5a321a; margin-bottom:8px; text-transform:uppercase; letter-spacing:1px; font-weight:black;">
          Your Ticket Number
        </div>
        <div style="font-size:30px; font-weight:black; letter-spacing:4px; color:#4a2512; font-family:monospace;">
          ${ticketNumber}
        </div>
      </div>
      <p style="color:#5a321a; font-size:14px; line-height:1.6;">
        You can use this ticket number to track your progress on the portal.
      </p>
    </div>
    <div style="padding:20px 32px; background:#f8fafc; color:#94a3b8; font-size:12px; text-align:center;">
      © ${new Date().getFullYear()} PalitpurConnect
    </div>
  </div>
</body>
</html>
  `.trim();

  return sendEmail({
    to: email,
    subject,
    text,
    html,
  });
}

/*
|--------------------------------------------------------------------------
| Email Verification OTP
|--------------------------------------------------------------------------
*/

export async function sendVerificationOtp(email, otp) {
  const subject = "PalitpurConnect Email Verification OTP";

  const text = `
Hello,

Welcome to PalitpurConnect.

Your email verification OTP is:

${otp}

This OTP will expire in 10 minutes.

If you did not create a PalitpurConnect account, you can safely ignore this email.

Regards,
PalitpurConnect
  `.trim();

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PalitpurConnect Email Verification</title>
</head>

<body style="
  margin:0;
  padding:0;
  background:#f1f5f9;
  font-family:Arial,Helvetica,sans-serif;
">

  <div style="
    max-width:600px;
    margin:40px auto;
    background:#ffffff;
    border-radius:16px;
    overflow:hidden;
    border:1px solid #e2e8f0;
  ">

    <div style="
      padding:28px;
      background:#0f766e;
      color:#ffffff;
      text-align:center;
    ">
      <h1 style="margin:0;">
        PalitpurConnect
      </h1>

      <p style="margin:8px 0 0;">
        Digital Village Portal
      </p>
    </div>

    <div style="padding:32px;">

      <h2 style="
        margin-top:0;
        color:#0f172a;
      ">
        Verify your email
      </h2>

      <p style="
        color:#475569;
        line-height:1.6;
      ">
        Thank you for registering with PalitpurConnect.
        Use the OTP below to verify your email address.
      </p>

      <div style="
        margin:28px 0;
        padding:20px;
        text-align:center;
        background:#f0fdfa;
        border:1px solid #99f6e4;
        border-radius:12px;
      ">

        <div style="
          font-size:12px;
          color:#64748b;
          margin-bottom:8px;
          text-transform:uppercase;
          letter-spacing:1px;
        ">
          Verification OTP
        </div>

        <div style="
          font-size:34px;
          font-weight:bold;
          letter-spacing:8px;
          color:#0f766e;
        ">
          ${otp}
        </div>

      </div>

      <p style="
        color:#64748b;
        font-size:14px;
        line-height:1.6;
      ">
        This OTP will expire in <strong>10 minutes</strong>.
      </p>

      <p style="
        color:#64748b;
        font-size:14px;
        line-height:1.6;
      ">
        If you did not create a PalitpurConnect account,
        you can safely ignore this email.
      </p>

    </div>

    <div style="
      padding:20px 32px;
      background:#f8fafc;
      color:#94a3b8;
      font-size:12px;
      text-align:center;
    ">
      © ${new Date().getFullYear()} PalitpurConnect
    </div>

  </div>

</body>
</html>
  `.trim();

  return sendEmail({
    to: email,
    subject,
    text,
    html,
  });
}

/*
|--------------------------------------------------------------------------
| Password Reset OTP
|--------------------------------------------------------------------------
*/

export async function sendPasswordResetOtp(email, otp) {
  const subject = "PalitpurConnect Password Reset OTP";

  const text = `
Hello,

We received a request to reset your PalitpurConnect password.

Your password reset OTP is:

${otp}

This OTP will expire in 10 minutes.

If you did not request a password reset, you can safely ignore this email.

Regards,
PalitpurConnect
  `.trim();

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PalitpurConnect Password Reset</title>
</head>

<body style="
  margin:0;
  padding:0;
  background:#f1f5f9;
  font-family:Arial,Helvetica,sans-serif;
">

  <div style="
    max-width:600px;
    margin:40px auto;
    background:#ffffff;
    border-radius:16px;
    overflow:hidden;
    border:1px solid #e2e8f0;
  ">

    <div style="
      padding:28px;
      background:#0f766e;
      color:#ffffff;
      text-align:center;
    ">
      <h1 style="margin:0;">
        PalitpurConnect
      </h1>

      <p style="margin:8px 0 0;">
        Password Reset
      </p>
    </div>

    <div style="padding:32px;">

      <h2 style="
        margin-top:0;
        color:#0f172a;
      ">
        Reset your password
      </h2>

      <p style="
        color:#475569;
        line-height:1.6;
      ">
        Use the OTP below to continue resetting your
        PalitpurConnect password.
      </p>

      <div style="
        margin:28px 0;
        padding:20px;
        text-align:center;
        background:#f0fdfa;
        border:1px solid #99f6e4;
        border-radius:12px;
      ">

        <div style="
          font-size:12px;
          color:#64748b;
          margin-bottom:8px;
        ">
          PASSWORD RESET OTP
        </div>

        <div style="
          font-size:34px;
          font-weight:bold;
          letter-spacing:8px;
          color:#0f766e;
        ">
          ${otp}
        </div>

      </div>

      <p style="
        color:#64748b;
        font-size:14px;
      ">
        This OTP will expire in <strong>10 minutes</strong>.
      </p>

    </div>

    <div style="
      padding:20px 32px;
      background:#f8fafc;
      color:#94a3b8;
      font-size:12px;
      text-align:center;
    ">
      © ${new Date().getFullYear()} PalitpurConnect
    </div>

  </div>

</body>
</html>
  `.trim();

  return sendEmail({
    to: email,
    subject,
    text,
    html,
  });
}