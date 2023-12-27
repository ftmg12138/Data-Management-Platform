// server/controllers/languageController.js
const db = require('../database/db');

exports.getLanguage = async (ctx) => {
  try {
    const language = await new Promise((resolve, reject) => {
      db.get("SELECT language FROM language", (err, row) => {
        if (err) reject(err);
        else resolve(row ? row.language : null);
      });
    });

    ctx.body = { language: language}; 
  } catch (err) {
    ctx.status = 500;
    ctx.body = { error: err.message };
  }
};

exports.setLanguage = async (ctx) => {
  try {
    const { language } = ctx.request.body;

    // 更新语言设置，由于只有一条记录，我们可以直接更新
    await new Promise((resolve, reject) => {
      db.run("UPDATE language SET language = ?", [language], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    ctx.body = { message: "Language updated successfully" };
  } catch (err) {
    ctx.status = 500;
    ctx.body = { error: err.message };
  }
};
