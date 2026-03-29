const express = require('express');
const { getUser } = require('../middleware/auth');
const { applyPaywall } = require('../middleware/paywall');

function createContentRouter(contentStore) {
  const router = express.Router();

  // GET / - list content with filters
  router.get('/', (req, res) => {
    const user = getUser(req);
    const { type, category, industry, difficulty, search } = req.query;

    let items = contentStore.allItems;

    if (type) {
      items = items.filter(i => i.type === type);
    }
    if (category) {
      items = items.filter(i => i.category === category);
    }
    if (industry) {
      items = items.filter(i => i.industryTags && i.industryTags.includes(industry));
    }
    if (difficulty) {
      items = items.filter(i => i.difficulty === difficulty);
    }
    if (search) {
      const term = search.toLowerCase();
      items = items.filter(i =>
        i.title.toLowerCase().includes(term) ||
        i.description.toLowerCase().includes(term) ||
        i.category.toLowerCase().includes(term) ||
        (i.industryTags && i.industryTags.some(t => t.toLowerCase().includes(term)))
      );
    }

    const paywalled = items.map(item => applyPaywall(item, user));
    res.json({ items: paywalled, total: paywalled.length });
  });

  // GET /categories - distinct filter values and counts
  router.get('/categories', (req, res) => {
    const items = contentStore.allItems;

    const categories = [...new Set(items.map(i => i.category))].sort();
    const industries = [...new Set(items.flatMap(i => i.industryTags || []))].sort();
    const difficulties = [...new Set(items.map(i => i.difficulty))];

    const typeCounts = {};
    items.forEach(i => {
      typeCounts[i.type] = (typeCounts[i.type] || 0) + 1;
    });

    res.json({ categories, industries, difficulties, typeCounts });
  });

  // GET /:id - single item
  router.get('/:id', (req, res) => {
    const user = getUser(req);
    const item = contentStore.byId.get(req.params.id);

    if (!item) {
      return res.status(404).json({ error: 'Item not found.' });
    }

    res.json({ item: applyPaywall(item, user) });
  });

  return router;
}

module.exports = { createContentRouter };
