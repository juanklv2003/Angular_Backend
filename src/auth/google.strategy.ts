import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { pool } from '../config/db';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: 'http://localhost:3000/auth/google/callback'
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const googleId = profile.id;
        const email = profile.emails?.[0]?.value;
        const name = profile.displayName;

        // Verificar que tenemos email
        if (!email) {
          return done(new Error('No email provided by Google'), undefined);
        }

        // Buscar usuario existente por google_id
        const [rows]: any = await pool.query(
          'SELECT * FROM users WHERE google_id = ?',
          [googleId]
        );

        if (rows.length) return done(null, rows[0]);

        // Si existe por email (cuenta local), asociar google_id
        const [emailRows]: any = await pool.query(
          'SELECT * FROM users WHERE email = ?',
          [email]
        );

        if (emailRows.length) {
          await pool.query(
            'UPDATE users SET google_id = ?, provider = "google" WHERE id = ?',
            [googleId, emailRows[0].id]
          );
          return done(null, { ...emailRows[0], google_id: googleId, provider: 'google' });
        }

        // Crear nuevo usuario
        const [result]: any = await pool.query(
          'INSERT INTO users (email, name, provider, google_id) VALUES (?, ?, "google", ?)',
          [email, name, googleId]
        );

        const newUser = {
          id: result.insertId,
          email,
          name,
          provider: 'google',
          google_id: googleId
        };

        done(null, newUser);
      } catch (err: any) {
        console.error('Google Strategy Error:', err);
        done(err, undefined);
      }
    }
  )
);
