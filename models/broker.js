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

  async delete(id) {
    return db.query('DELETE FROM properties WHERE id=$1', [id]);
  },

  async findById(id) {
    const query = 'SELECT id, name, email, phone, creci FROM brokers WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0];
  },

  async findBasicById(id) {
    const query = 'SELECT id, name FROM brokers WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0];
  },

  async update(id, data) {
    const query = 'UPDATE brokers SET name = $1, email = $2, phone = $3, creci = $4 WHERE id = $5';
    return db.query(query, [data.name, data.email, data.phone, data.creci, id]);
  },

  async getVisits(id) {
    const query = `
      SELECT v.id, v.starts_at, v.ends_at, v.status, 
             p.address AS property_address, c.name AS client_name
        FROM visits v
        JOIN properties p ON v.property_id = p.id
        JOIN clients c ON v.client_id = c.id
       WHERE v.broker_id = $1
       ORDER BY v.starts_at DESC
    `;
    const result = await db.query(query, [id]);
    return result.rows;
  },

  async getAvailability(brokerId) {
    const query = 'SELECT id, starts_at, ends_at, description FROM availability WHERE broker_id = $1 ORDER BY starts_at';
    const result = await db.query(query, [brokerId]);
    return result.rows;
  },

  async addAvailability(brokerId, starts_at, ends_at) {
    const query = 'INSERT INTO availability (broker_id, starts_at, ends_at) VALUES ($1, $2, $3)';
    return db.query(query, [brokerId, starts_at, ends_at]);
  },

  async deleteAvailability(brokerId, availabilityId) {
    const query = 'DELETE FROM availability WHERE id = $1 AND broker_id = $2';
    return db.query(query, [availabilityId, brokerId]);
  },
};