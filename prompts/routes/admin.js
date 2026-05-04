const express = require('express');
const path = require('path');
const bcrypt = require('bcryptjs');
const { requireAdmin } = require('../middleware/auth');

function createAdminRouter(db, contentStore) {
  const router = express.Router();

  // All admin routes require admin auth
  router.use(requireAdmin);

  // GET / - serve admin page
  router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'admin.html'));
  });

  // GET /users - list all users
  router.get('/users', (req, res) => {
    const users = db.prepare(
      'SELECT id, email, has_paid, is_admin, created_at, updated_at FROM users ORDER BY created_at DESC'
    ).all();
    res.json({ users });
  });

  // POST /users/:id/toggle-paid
  router.post('/users/:id/toggle-paid', (req, res) => {
    const user = db.prepare('SELECT id, has_paid FROM users WHERE id = ?').get(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const newStatus = user.has_paid ? 0 : 1;
    db.prepare("UPDATE users SET has_paid = ?, updated_at = datetime('now') WHERE id = ?").run(newStatus, user.id);

    res.json({ id: user.id, has_paid: newStatus });
  });

  // GET /stats
  router.get('/stats', (req, res) => {
    const items = contentStore.allItems;
    const typeCounts = {};
    let freeCount = 0;
    let premiumCount = 0;

    items.forEach(i => {
      typeCounts[i.type] = (typeCounts[i.type] || 0) + 1;
      if (i.isFree) freeCount++;
      else premiumCount++;
    });

    const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
    const paidCount = db.prepare('SELECT COUNT(*) as count FROM users WHERE has_paid = 1').get().count;

    res.json({ typeCounts, freeCount, premiumCount, userCount, paidCount });
  });

  // POST /bootstrap-test-user - idempotent test account creator.
  // Survives Autoscale ephemeral DB resets: just hit this endpoint after any
  // redeploy and you get a working test@test.com / testtest with full course
  // access. Body or query: { email?, password? }.
  router.post('/bootstrap-test-user', async (req, res) => {
    try {
      const email = (req.body && req.body.email) || req.query.email || 'test@test.com';
      const password = (req.body && req.body.password) || req.query.password_set || 'testtest';

      let user = db.prepare('SELECT id, email FROM users WHERE email = ?').get(email);
      if (!user) {
        const passwordHash = await bcrypt.hash(password, 12);
        const result = db.prepare(
          'INSERT INTO users (email, password_hash, has_paid, is_admin) VALUES (?, ?, 1, 1)'
        ).run(email, passwordHash);
        user = { id: result.lastInsertRowid, email };
      } else {
        const passwordHash = await bcrypt.hash(password, 12);
        db.prepare(
          "UPDATE users SET password_hash = ?, has_paid = 1, is_admin = 1, updated_at = datetime('now') WHERE id = ?"
        ).run(passwordHash, user.id);
      }

      const grant = db.prepare(
        'INSERT OR IGNORE INTO user_entitlements (user_id, product_slug, stripe_session_id) VALUES (?, ?, ?)'
      );
      for (const slug of ['bundle', 'course', 'course-plus-bundle']) {
        grant.run(user.id, slug, `bootstrap-${Date.now()}`);
      }

      res.json({
        ok: true,
        user_id: user.id,
        email,
        password_set: password,
        entitlements: ['bundle', 'course', 'course-plus-bundle'],
        is_admin: true,
      });
    } catch (err) {
      console.error('bootstrap-test-user failed:', err);
      res.status(500).json({ ok: false, error: err.message });
    }
  });

  return router;
}

module.exports = { createAdminRouter };
