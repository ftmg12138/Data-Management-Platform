// server/controllers/dataController.js
const db = require('../database/db');

exports.getAllData = async (ctx) => {
  try {
    ctx.body = await new Promise((resolve, reject) => {
      db.all("SELECT * FROM data", [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  } catch (err) {
    ctx.status = 500;
    ctx.body = { error: err.message };
  }
};

// ... 其他CRUD函数，例如addData, deleteData等
exports.addData = async (ctx) => {
    try {
        const { name, description, time, tags } = ctx.request.body;
        const tagsArray = tags.split(',').map(tag => tag.trim());

        await new Promise((resolve, reject) => {
            db.serialize(() => {
                db.run(`BEGIN TRANSACTION`, (err) => {
                    if (err) reject(err);
                });

                db.run(
                    `INSERT INTO data (name, description, time, tags) VALUES (?, ?, ?, ?)`,
                    [name, description, time,tags],
                    function (err) {
                        if (err) {
                            db.run(`ROLLBACK`);
                            reject(err);
                        } else {
                            const dataId = this.lastID;

                            tagsArray.forEach(tag => {
                                db.get(`SELECT name FROM tags WHERE name = ?`, [tag], (err, row) => {
                                    if (err) {
                                        db.run(`ROLLBACK`);
                                        reject(err);
                                    } else if (!row) {
                                        db.run(
                                            `INSERT INTO tags (name) VALUES (?)`,
                                            [tag],
                                            (err) => {
                                                if (err) {
                                                    db.run(`ROLLBACK`);
                                                    reject(err);
                                                }
                                            }
                                        );
                                    }
                                });
                            });
                            resolve(dataId);
                        }
                    }
                );

                db.run(`COMMIT`, (err) => {
                    if (err) reject(err);
                });
            });
        });

        ctx.status = 200;
        ctx.body = { message: 'Data added successfully' };
    } catch (err) {
        ctx.status = 500;
        ctx.body = { error: err.message };
    }
};



exports.deleteData = async (ctx) => {
    try {
        const { id } = ctx.params;
        await new Promise((resolve, reject) => {
        db.run(`DELETE FROM data WHERE id=?`, [id], (err) => {
            if (err) reject(err);
            else resolve();
        });
        });
        ctx.status = 200;
    } catch (err) {
        ctx.status = 500;
        ctx.body = { error: err.message };
    }
    }

exports.editData = async (ctx) => {
    try {
        const { id } = ctx.params; // 通常从URL参数中获取id
        const { name, description, time, tags } = ctx.request.body; // 从请求体中获取更新的数据

        // 使用占位符来防止SQL注入
        const sql = `UPDATE data SET name = ?, description = ?, time = ?, tags = ? WHERE id = ?`;

        await new Promise((resolve, reject) => {
            db.run(sql, [name, description, time, tags, id], (err) => {
                if (err) reject(err);
                else resolve();
            });
        });

        ctx.status = 200; // 成功响应
    } catch (err) {
        ctx.status = 500; // 服务器错误响应
        ctx.body = { error: err.message };
    }
};