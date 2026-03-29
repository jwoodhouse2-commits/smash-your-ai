function requirePaidPage(req, res, next) {
  if (process.env.PAYWALL_ENABLED !== 'true') return next();

  const user = req.session && req.session.user;
  if (user && (user.has_paid || user.is_admin)) return next();

  // Not logged in or not paid — redirect to prompt library with unlock modal
  return res.redirect('/prompts?unlock=1');
}

module.exports = { requirePaidPage };
