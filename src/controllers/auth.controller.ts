import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import { pool } from '../config/db';

const JWT_SECRET = process.env.JWT_SECRET!;

export const register = async (req: Request, res: Response) => {
  const { email, password, name } = req.body;

  const hash = await bcrypt.hash(password, 10);

  try {
    const [result]: any = await pool.query(
      'INSERT INTO users (email, password_hash, name, provider) VALUES (?, ?, ?, "local")',
      [email, hash, name]
    );

    const token = jwt.sign({ id: result.insertId, email }, JWT_SECRET, { expiresIn: '1d' });
    res.status(201).json({ token });
  } catch (e: any) {
    console.error('Register error:', e);
    if (e.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Email already registered' });
    }
    res.status(500).json({ message: 'Register error', error: e.message });
  }
};


export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const [rows]: any = await pool.query(
      'SELECT * FROM users WHERE email = ? AND provider = "local"',
      [email]
    );

    const user = rows[0];
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, email }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token });
  } catch (e: any) {
    console.error('Login error:', e);
    res.status(500).json({ message: 'Login error', error: e.message });
  }
};

// Google OAuth callback
export const googleCallback = (req: Request, res: Response) => {
  const user = req.user as any;
  
  if (!user) {
    return res.status(401).json({ message: 'Google authentication failed' });
  }

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1d' });
  
  // Redirigir al frontend con el token
  res.redirect(`http://localhost:4200/auth/callback?token=${token}`);
};
