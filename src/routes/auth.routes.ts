import express from 'express';
import passport from 'passport';
import { register, login, googleCallback } from '../controllers/auth.controller';
import { validate } from '../middlewares/validate.middleware';
import { registerSchema, loginSchema } from '../schemas/auth.schema';

const router = express.Router();

router.post('/register', validate(registerSchema), register);

router.post('/login', validate(loginSchema), login);

router.get('/google', (req, _res, next) => {
  console.log('GET /auth/google', { method: req.method, url: req.originalUrl });
  next();
}, passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', (req, _res, next) => {
  console.log('GET /auth/google/callback', { method: req.method, url: req.originalUrl });
  next();
}, passport.authenticate('google', { session: false, failureRedirect: '/auth/google/failure' }), googleCallback);

router.get('/google/failure', (_req, res) => {
  res.status(401).json({ message: 'Google authentication failed' });
});

export default router;
