const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, 'prompts.db');

const BUNDLE_PRICE_ID = 'price_1TChb249q6kIZ1mUFQQ8uTH2';
const COURSE_PRICE_ID = process.env.STRIPE_COURSE_PRICE_ID || '';
const COMBO_PRICE_ID = process.env.STRIPE_COMBO_PRICE_ID || '';

function initDatabase() {
  const db = new Database(DB_PATH);

  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      has_paid INTEGER DEFAULT 0,
      stripe_customer_id TEXT,
      stripe_session_id TEXT,
      is_admin INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS password_resets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      token TEXT UNIQUE NOT NULL,
      expires_at TEXT NOT NULL,
      used INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      slug TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      stripe_price_id TEXT NOT NULL,
      price_pence INTEGER NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS user_entitlements (
      user_id INTEGER NOT NULL,
      product_slug TEXT NOT NULL,
      stripe_session_id TEXT,
      acquired_at TEXT DEFAULT (datetime('now')),
      PRIMARY KEY (user_id, product_slug),
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (product_slug) REFERENCES products(slug)
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS lesson_progress (
      user_id INTEGER NOT NULL,
      lesson_key TEXT NOT NULL,
      completed_at TEXT DEFAULT (datetime('now')),
      PRIMARY KEY (user_id, lesson_key),
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS tier_worksheets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      tier TEXT NOT NULL,
      answers_json TEXT NOT NULL,
      output_json TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_worksheets_user ON tier_worksheets(user_id, tier, created_at DESC)`);

  db.exec(`
    CREATE TABLE IF NOT EXISTS tier_certificates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      tier TEXT NOT NULL,
      code TEXT UNIQUE NOT NULL,
      display_name TEXT NOT NULL,
      issued_at TEXT DEFAULT (datetime('now')),
      UNIQUE (user_id, tier),
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_certificates_code ON tier_certificates(code)`);

  const upsertProduct = db.prepare(`
    INSERT INTO products (slug, title, stripe_price_id, price_pence)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(slug) DO UPDATE SET
      title = excluded.title,
      stripe_price_id = excluded.stripe_price_id,
      price_pence = excluded.price_pence
  `);
  upsertProduct.run('bundle', 'AI Starter Bundle', BUNDLE_PRICE_ID, 1499);
  upsertProduct.run(
    'course',
    'Smash Your AI Online Course',
    COURSE_PRICE_ID || 'price_placeholder_set_env',
    4900
  );
  // Combo: course + bundle, grants BOTH entitlements. Saves ~£5 vs buying them separately.
  upsertProduct.run(
    'course-plus-bundle',
    'Course + Starter Bundle',
    COMBO_PRICE_ID || 'price_placeholder_set_env',
    5999
  );

  // Backfill: every user with has_paid = 1 owns the 'bundle' entitlement.
  db.prepare(`
    INSERT OR IGNORE INTO user_entitlements (user_id, product_slug, stripe_session_id, acquired_at)
    SELECT id, 'bundle', stripe_session_id, COALESCE(updated_at, created_at)
    FROM users WHERE has_paid = 1
  `).run();

  return db;
}

module.exports = { initDatabase };
