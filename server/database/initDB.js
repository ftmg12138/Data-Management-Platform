// server/database/initDb.js
const db = require('./db');

// 数据表创建
const createDataTbl = `CREATE TABLE IF NOT EXISTS data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    time TEXT,
    tags TEXT
);`;

const createTagsTbl = `CREATE TABLE IF NOT EXISTS tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
);`;

const createlanguageTbl = `CREATE TABLE IF NOT EXISTS language (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    language TEXT NOT NULL
);`;

db.serialize(() => {
  db.run(createDataTbl);
  db.run(createTagsTbl);
  db.run(createlanguageTbl, () => {
    // 插入默认语言设置，如果表是空的
    db.get("SELECT language FROM language", (err, row) => {
      if (!row) {
        db.run("INSERT INTO language (language) VALUES ('zh')");
      }
    });
  });
});
