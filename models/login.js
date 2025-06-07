const db = require('../config/db');

module.exports = {
  async findByEmailAndPassword(email, password) {
    const query = 'SELECT * FROM login WHERE email = $1 AND password = $2';
    const result = await db.query(query, [email, password]);
    return result.rows[0];
  },

  async findAgencyByLoginId(loginId) {
    const query = 'SELECT id FROM agencies WHERE login_id = $1';
    const result = await db.query(query, [loginId]);
    return result.rows[0];
  },

  async findBrokerByLoginId(loginId) {
    const query = 'SELECT id FROM brokers WHERE login_id = $1';
    const result = await db.query(query, [loginId]);
    return result.rows[0];
  }
};
