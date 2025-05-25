const db = require('../config/db');

module.exports = {
  async create(agencyId, data) {
    const q = 'INSERT INTO brokers (agency_id, address, price, status) VALUES ($1,$2,$3,$4)';
    return db.query(q, [agencyId, data.address, data.price, data.status]);
  },

  async findAll(agencyId) {
    const r = await db.query('SELECT * FROM properties WHERE agency_id=$1 ORDER BY id', [agencyId]);
    return r.rows;
  },

  async update(id, data) {
    const q = 'UPDATE properties SET address=$1, price=$2, status=$3 WHERE id=$4';
    return db.query(q, [data.address, data.price, data.status, id]);
  },

  async delete(id) {
    return db.query('DELETE FROM properties WHERE id=$1', [id]);
  }
};