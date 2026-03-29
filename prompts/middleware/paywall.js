function applyPaywall(contentItem, user) {
  const paywallEnabled = process.env.PAYWALL_ENABLED === 'true';

  // Paywall disabled - return everything
  if (!paywallEnabled) {
    return { ...contentItem, locked: false };
  }

  // Free items always visible
  if (contentItem.isFree) {
    return { ...contentItem, locked: false };
  }

  // Paid or admin users see everything
  if (user && (user.has_paid || user.is_admin)) {
    return { ...contentItem, locked: false };
  }

  // Strip premium content
  const { content, howToUse, whyItWorks, makeItYourOwn, ...safeFields } = contentItem;
  return {
    ...safeFields,
    content: null,
    howToUse: null,
    whyItWorks: null,
    makeItYourOwn: null,
    locked: true
  };
}

module.exports = { applyPaywall };
