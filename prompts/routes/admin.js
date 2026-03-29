const express = require('express');
const path = require('path');
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

  return router;
}

module.exports = { createAdminRouter };
