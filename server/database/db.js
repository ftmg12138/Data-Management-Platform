// server/database/db.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// 创建或打开数据库
const DB_PATH = path.resolve(__dirname, 'data.db');
const db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

module.exports = db;
