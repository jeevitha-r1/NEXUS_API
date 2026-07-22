const Database = require("better-sqlite3");

const db = new Database("nexus.db");

console.log("Connected to SQLite database");

module.exports = db;