import express from 'express';
import passport from 'passport';
import { register, login, googleCallback } from '../controllers/auth.controller';
import { validate } from '../middlewares/validate.middleware';
import { registerSchema, loginSchema } from '../schemas/auth.schema';

const router = express.Router();

router.post('/register', validate(registerSchema), register);

router.post('/login', validate(loginSchema), login);

router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { session: false }),
  googleCallback
);

export default router;
