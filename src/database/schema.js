const db = require("../config/database");

db.exec(`
  CREATE TABLE IF NOT EXISTS goals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    priority TEXT NOT NULL,
    progress INTEGER DEFAULT 0,
    status TEXT DEFAULT 'not_started',
    deadline TEXT,
    estimated_hours REAL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

console.log("Goals table is ready");