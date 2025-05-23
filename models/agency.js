const db = require('../config/db');

module.exports = {
  async create(data) {
    const query = 'INSERT INTO agencies (name) VALUES ($1)';
    return db.query(query, [data.name]);
  },

  async findAll() {
    const query = `
      SELECT * FROM agencies ORDER BY name ASC
    `;
    const result = await db.query(query);
    return result.rows;
  },

  async update(id, data) {
    const query = 'UPDATE agencies SET name = $1 WHERE id = $2';
    return db.query(query, [data.name, id]);
  },

  async delete(id) {
    return db.query('DELETE FROM agencies WHERE id = $1', [id]);
  }
};