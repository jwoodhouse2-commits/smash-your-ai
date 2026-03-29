require('dotenv').config();

const express = require('express');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
const path = require('path');
const fs = require('fs');

const { initDatabase } = require('./database/init');
const { createAuthRouter } = require('./routes/auth');
const { createContentRouter } = require('./routes/content');
const { createAdminRouter } = require('./routes/admin');

// Initialise database
const db = initDatabase();

// Load content JSON files into memory
function loadContent() {
  const contentDir = path.join(__dirname, 'content');
  const byId = new Map();
  const allItems = [];

  const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.json'));

  for (const file of files) {
    const filePath = path.join(contentDir, file);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const items = Array.isArray(data) ? data : data.items || [];

    for (const item of items) {
      byId.set(item.id, item);
      allItems.push(item);
    }
  }

  console.log(`Loaded ${allItems.length} content items from ${files.length} files`);
  return { byId, allItems };
}

const contentStore = loadContent();

// Create Express app
const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session
app.use(session({
  store: new SQLiteStore({
    db: 'sessions.db',
    dir: path.join(__dirname, 'database')
  }),
  secret: process.env.SESSION_SECRET || 'dev-secret-change-me',
  resave: false,
  saveUninitialized: false,
  cookie: {
    path: '/prompts',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    httpOnly: true,
    sameSite: 'lax'
  }
}));

// Static files
app.use('/prompts/static', express.static(path.join(__dirname, 'public')));

// Mount routes
app.use('/prompts/auth', createAuthRouter(db));
app.use('/prompts/api', createContentRouter(contentStore));
app.use('/prompts/admin', createAdminRouter(db, contentStore));

// Serve library page
app.get('/prompts', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'library.html'));
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Smash Your AI Prompt Library running at http://localhost:${PORT}/prompts`);
});
