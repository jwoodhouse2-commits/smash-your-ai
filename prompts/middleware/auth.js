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

  // Check query param password
  if (req.query.password && req.query.password === adminPassword) {
    return next();
  }

  // Check session user is admin
  if (user && user.is_admin) {
    return next();
  }

  return res.status(403).json({ error: 'Admin access required.' });
}

module.exports = { getUser, requireAuth, requirePaid, requireAdmin };
