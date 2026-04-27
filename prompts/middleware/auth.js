function getUser(req) {
  if (req.session && req.session.user) {
    return req.session.user;
  }
  return null;
}

function requireAuth(req, res, next) {
  const user = getUser(req);
  if (!user) {
    return res.status(401).json({ error: 'You must be logged in to do that.' });
  }
  req.user = user;
  next();
}

function requirePaid(req, res, next) {
  const paywallEnabled = process.env.PAYWALL_ENABLED === 'true';
  if (!paywallEnabled) {
    return next();
  }

  const user = getUser(req);
  if (!user) {
    return res.status(401).json({ error: 'You must be logged in to access this.' });
  }
  if (!user.has_paid && !user.is_admin) {
    return res.status(403).json({ error: 'You need to unlock the library to access this.' });
  }
  req.user = user;
  next();
}

function requireAdmin(req, res, next) {
  const user = getUser(req);
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (req.query.password && req.query.password === adminPassword) {
    return next();
  }

  if (user && user.is_admin) {
    return next();
  }

  return res.status(403).json({ error: 'Admin access required.' });
}

// Runtime check (no middleware overhead). Returns boolean.
function userHasEntitlement(db, userId, productSlug) {
  if (!userId) return false;
  const row = db.prepare(
    'SELECT 1 FROM user_entitlements WHERE user_id = ? AND product_slug = ?'
  ).get(userId, productSlug);
  return !!row;
}

// Factory: returns middleware that 403s for API calls
function requireEntitlement(db, productSlug) {
  return (req, res, next) => {
    if (process.env.PAYWALL_ENABLED !== 'true') return next();
    const user = getUser(req);
    if (!user) return res.status(401).json({ error: 'You must be logged in.' });
    if (user.is_admin) return next();
    if (userHasEntitlement(db, user.id, productSlug)) {
      req.user = user;
      return next();
    }
    return res.status(403).json({ error: `You don't have access to this product (${productSlug}).` });
  };
}

module.exports = {
  getUser,
  requireAuth,
  requirePaid,
  requireAdmin,
  userHasEntitlement,
  requireEntitlement,
};
