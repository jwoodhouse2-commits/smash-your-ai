const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { requireAuth } = require('../middleware/auth');
const path = require('path');

const PRICE_ID = 'price_1TChb249q6kIZ1mUFQQ8uTH2';

function createCheckoutRouter(db) {
  const router = express.Router();

  // POST /prompts/checkout/create-session
  router.post('/create-session', requireAuth, async (req, res) => {
    try {
      const user = req.user;

      // Already paid — no need to charge again
      if (user.has_paid) {
        return res.json({ redirect: '/dashboard' });
      }

      const baseUrl = `${req.protocol}://${req.get('host')}`;

      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        line_items: [{ price: PRICE_ID, quantity: 1 }],
        customer_email: user.email,
        client_reference_id: String(user.id),
        success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/prompts`,
        metadata: { user_id: String(user.id) }
      });

      res.json({ url: session.url });
    } catch (err) {
      console.error('Checkout session error:', err);
      res.status(500).json({ error: 'Could not create checkout session. Please try again.' });
    }
  });

  // GET /prompts/checkout/success — verify payment and show success page
  router.get('/success', async (req, res) => {
    try {
      const sessionId = req.query.session_id;

      if (!sessionId) {
        return res.redirect('/prompts');
      }

      const session = await stripe.checkout.sessions.retrieve(sessionId);

      if (session.payment_status === 'paid' && session.client_reference_id) {
        const userId = parseInt(session.client_reference_id, 10);

        // Update database
        db.prepare(
          'UPDATE users SET has_paid = 1, stripe_customer_id = ?, stripe_session_id = ?, updated_at = datetime(\'now\') WHERE id = ?'
        ).run(session.customer, session.id, userId);

        // Update session if this is the same user
        if (req.session.user && req.session.user.id === userId) {
          req.session.user.has_paid = 1;
        }
      }

      res.sendFile(path.join(__dirname, '..', 'views', 'success.html'));
    } catch (err) {
      console.error('Success page error:', err);
      res.sendFile(path.join(__dirname, '..', 'views', 'success.html'));
    }
  });

  return router;
}

module.exports = { createCheckoutRouter };
