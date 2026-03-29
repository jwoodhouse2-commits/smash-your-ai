const express = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { Resend } = require('resend');
const { getUser } = require('../middleware/auth');

const resend = new Resend(process.env.RESEND_API_KEY);

function createAuthRouter(db) {
  const router = express.Router();

  // POST /register
  router.post('/register', async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
      }

      if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters.' });
      }

      // Check if user exists
      const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase().trim());
      if (existing) {
        return res.status(409).json({ error: 'An account with that email already exists.' });
      }

      const passwordHash = await bcrypt.hash(password, 12);
      const result = db.prepare(
        'INSERT INTO users (email, password_hash) VALUES (?, ?)'
      ).run(email.toLowerCase().trim(), passwordHash);

      const user = db.prepare('SELECT id, email, has_paid, is_admin FROM users WHERE id = ?').get(result.lastInsertRowid);

      req.session.user = user;
      res.json({ user });
    } catch (err) {
      console.error('Register error:', err);
      res.status(500).json({ error: 'Something went wrong. Please try again.' });
    }
  });

  // POST /login
  router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
      }

      const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase().trim());
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }

      const valid = await bcrypt.compare(password, user.password_hash);
      if (!valid) {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }

      const sessionUser = {
        id: user.id,
        email: user.email,
        has_paid: user.has_paid,
        is_admin: user.is_admin
      };

      req.session.user = sessionUser;
      res.json({ user: sessionUser });
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ error: 'Something went wrong. Please try again.' });
    }
  });

  // POST /logout
  router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: 'Could not log out.' });
      }
      res.json({ success: true });
    });
  });

  // GET /me — always refresh from DB to catch webhook payment updates
  router.get('/me', (req, res) => {
    if (!req.session.user) return res.json({ user: null });
    const fresh = db.prepare('SELECT id, email, has_paid, is_admin FROM users WHERE id = ?')
      .get(req.session.user.id);
    if (fresh) {
      req.session.user = fresh;
      return res.json({ user: fresh });
    }
    res.json({ user: null });
  });

  // POST /forgot-password
  router.post('/forgot-password', async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ error: 'Email is required.' });
      }

      const successMsg = 'If an account exists with that email, we\'ve sent a password reset link.';
      const user = db.prepare('SELECT id, email FROM users WHERE email = ?').get(email.toLowerCase().trim());

      if (!user) {
        return res.json({ message: successMsg });
      }

      // Invalidate existing tokens
      db.prepare('UPDATE password_resets SET used = 1 WHERE user_id = ? AND used = 0').run(user.id);

      const token = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();

      db.prepare('INSERT INTO password_resets (user_id, token, expires_at) VALUES (?, ?, ?)').run(user.id, token, expiresAt);

      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const resetUrl = `${baseUrl}/reset-password?token=${token}`;

      await resend.emails.send({
        from: 'Smash Your AI <onboarding@resend.dev>',
        to: user.email,
        subject: 'Reset your password - Smash Your AI',
        html: `
          <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
            <h1 style="font-size: 24px; font-weight: 700; color: #1f2937; margin-bottom: 16px;">Reset your password</h1>
            <p style="font-size: 15px; color: #4b5563; line-height: 1.6; margin-bottom: 24px;">
              We received a request to reset your password. Click the button below to choose a new one. This link expires in 1 hour.
            </p>
            <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #8b5cf6, #6366f1); color: white; font-size: 14px; font-weight: 600; padding: 12px 32px; border-radius: 12px; text-decoration: none;">
              Reset password
            </a>
            <p style="font-size: 13px; color: #9ca3af; margin-top: 32px; line-height: 1.5;">
              If you didn't request this, you can safely ignore this email.
            </p>
          </div>
        `
      });

      res.json({ message: successMsg });
    } catch (err) {
      console.error('Forgot password error:', err);
      res.json({ message: 'If an account exists with that email, we\'ve sent a password reset link.' });
    }
  });

  // GET /validate-reset-token
  router.get('/validate-reset-token', (req, res) => {
    const { token } = req.query;
    if (!token) return res.status(400).json({ error: 'Token required.' });

    const reset = db.prepare(
      'SELECT * FROM password_resets WHERE token = ? AND used = 0 AND expires_at > datetime(\'now\')'
    ).get(token);

    if (!reset) return res.status(400).json({ error: 'Invalid or expired token.' });
    res.json({ valid: true });
  });

  // POST /reset-password
  router.post('/reset-password', async (req, res) => {
    try {
      const { token, password } = req.body;

      if (!token || !password) {
        return res.status(400).json({ error: 'Token and password are required.' });
      }
      if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters.' });
      }

      const reset = db.prepare(
        'SELECT * FROM password_resets WHERE token = ? AND used = 0 AND expires_at > datetime(\'now\')'
      ).get(token);

      if (!reset) {
        return res.status(400).json({ error: 'This reset link has expired or already been used.' });
      }

      const passwordHash = await bcrypt.hash(password, 12);
      db.prepare('UPDATE users SET password_hash = ?, updated_at = datetime(\'now\') WHERE id = ?').run(passwordHash, reset.user_id);
      db.prepare('UPDATE password_resets SET used = 1 WHERE id = ?').run(reset.id);

      res.json({ message: 'Password reset successfully.' });
    } catch (err) {
      console.error('Reset password error:', err);
      res.status(500).json({ error: 'Something went wrong. Please try again.' });
    }
  });

  return router;
}

module.exports = { createAuthRouter };
