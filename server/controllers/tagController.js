// server/controllers/tagController.js
const db = require('../database/db');

exports.getAllTags = async (ctx) => {
  try {
    ctx.body = await new Promise((resolve, reject) => {
      db.all("SELECT * FROM tags", [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  } catch (err) {
    ctx.status = 500;
    ctx.body = { error: err.message };
  }
};

// ... 其他CRUD函数，例如addTag, deleteTag等
exports.addTag = async (ctx) => {
    try {
        const { name } = ctx.request.body;
        const tagExists = await new Promise((resolve, reject) => {
            db.get(`SELECT name FROM tags WHERE name = ?`, [name], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });

        if (!tagExists) {
            await new Promise((resolve, reject) => {
                db.run(`INSERT INTO tags (name) VALUES (?)`, [name], (err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });
        }

        ctx.status = 200;
        ctx.body = tagExists ? { message: 'Tag already exists' } : { message: 'Tag added successfully' };
    } catch (err) {
        ctx.status = 500;
        ctx.body = { error: err.message };
    }
};


exports.deleteTag = async (ctx) => {
    try {
        const { id } = ctx.params;

        // 获取要删除的标签名称
        const tagToDelete = await new Promise((resolve, reject) => {
            db.get(`SELECT name FROM tags WHERE id = ?`, [id], (err, row) => {
                if (err) reject(err);
                else if (row) resolve(row.name);
                else reject(new Error('Tag not found'));
            });
        });

        // 检查标签是否正在被使用
        const isTagUsed = await new Promise((resolve, reject) => {
            db.all(`SELECT tags FROM data`, [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    // 检查每个数据项的标签字符串是否包含该标签名称
                    const tagUsed = rows.some(row => row.tags.split(',').map(t => t.trim()).includes(tagToDelete));
                    resolve(tagUsed);
                }
            });
        });

        if (isTagUsed) {
            ctx.status = 400;
            ctx.body = { error: 'Tag is in use and cannot be deleted' };
            return;
        }

        // 如果标签没有被使用，执行删除操作
        await new Promise((resolve, reject) => {
            db.run(`DELETE FROM tags WHERE id = ?`, [id], (err) => {
                if (err) reject(err);
                else resolve();
            });
        });

        ctx.status = 200;
        ctx.body = { message: 'Tag deleted successfully' };
    } catch (err) {
        ctx.status = err.message === 'Tag not found' ? 404 : 500;
        ctx.body = { error: err.message };
    }
};
    
    


exports.editTag = async (ctx) => {
    try {
        const { id } = ctx.params;
        const { name: newName } = ctx.request.body;

        // 检索旧的标签名
        const oldTag = await new Promise((resolve, reject) => {
            db.get(`SELECT name FROM tags WHERE id = ?`, [id], (err, row) => {
                if (err) reject(err);
                else if (row) resolve(row.name);
                else reject(new Error('Tag not found'));
            });
        });

        // 更新 data 表中的标签
        await new Promise((resolve, reject) => {
            db.all("SELECT id, tags FROM data", [], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }

                rows.forEach(row => {
                    let tags = row.tags.split(',').map(tag => tag.trim());
                    if (tags.includes(oldTag)) {
                        let updatedTags = tags.map(tag => tag === oldTag ? newName : tag).join(',');
                        db.run(
                            `UPDATE data SET tags = ? WHERE id = ?`,
                            [updatedTags, row.id],
                            (updateErr) => {
                                if (updateErr) {
                                    reject(updateErr);
                                    return;
                                }
                            }
                        );
                    }
                });
                resolve();
            });
        });

        // 更新 tags 表
        await new Promise((resolve, reject) => {
            db.run(`UPDATE tags SET name = ? WHERE id = ?`, [newName, id], (err) => {
                if (err) reject(err);
                else resolve();
            });
        });

        ctx.status = 200;
        ctx.body = { message: 'Tag updated successfully' };
    } catch (err) {
        ctx.status = 500;
        ctx.body = { error: err.message };
    }
};

