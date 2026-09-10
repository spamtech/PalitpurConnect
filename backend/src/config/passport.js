// src/config/passport.js
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { query } from './database.js';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const googleId = profile.id;
        const email = profile.emails[0].value.trim().toLowerCase();
        const fullName = profile.displayName;
        const avatarUrl = profile.photos?.[0]?.value || null;

        // 1. Check if user already exists by google_id
        let result = await query(
          `SELECT id, full_name, email, role, email_verified, is_active, avatar_url 
           FROM users WHERE google_id = $1 LIMIT 1`,
          [googleId]
        );

        if (result.rows.length === 0) {
          // 2. Check if user registered previously with email/password using the same email
          result = await query(
            `SELECT id, full_name, email, role, email_verified, is_active, avatar_url 
             FROM users WHERE email = $1 LIMIT 1`,
            [email]
          );

          if (result.rows.length > 0) {
            // Link Google ID and update avatar/verification status for existing account
            const updateResult = await query(
              `UPDATE users 
               SET google_id = $1, email_verified = true, avatar_url = COALESCE(avatar_url, $2), last_login_at = NOW(), updated_at = NOW() 
               WHERE email = $3 
               RETURNING id, full_name, email, role, email_verified, is_active, avatar_url`,
              [googleId, avatarUrl, email]
            );
            result = updateResult;
          } else {
            // 3. Create a brand new user row
            const insertResult = await query(
              `INSERT INTO users (full_name, email, google_id, email_verified, avatar_url, role, is_active, last_login_at) 
               VALUES ($1, $2, $3, true, $4, 'user', true, NOW()) 
               RETURNING id, full_name, email, role, email_verified, is_active, avatar_url`,
              [fullName, email, googleId, avatarUrl]
            );
            result = insertResult;
          }
        } else {
          // Update last login timestamp for returning Google user
          await query(`UPDATE users SET last_login_at = NOW() WHERE id = $1`, [result.rows[0].id]);
        }

        const user = result.rows[0];

        if (!user.is_active) {
          return done(null, false, { message: 'Your account is inactive' });
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const result = await query(
      `SELECT id, full_name, email, role, email_verified, is_active, avatar_url 
       FROM users WHERE id = $1 LIMIT 1`,
      [id]
    );
    done(null, result.rows[0] || null);
  } catch (err) {
    done(err, null);
  }
});