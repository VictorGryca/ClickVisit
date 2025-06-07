const db = require('../config/db');

module.exports = {
  async getAllBrokers(agencyId) {
    const result = await db.query('SELECT id, name FROM brokers WHERE agency_id = $1 ORDER BY name', [agencyId]);
    return result.rows;
  },

  async getBrokersForProperty(propertyId) {
    const result = await db.query(
      `SELECT b.id, b.name
         FROM "brokerProperty" bp
         JOIN brokers b ON bp.broker_id = b.id
        WHERE bp.property_id = $1
        ORDER BY b.name`,
      [propertyId]
    );
    return result.rows;
  },

  async addBrokerToProperty(propertyId, brokerId) {
    return db.query(
      'INSERT INTO "brokerProperty" (property_id, broker_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [propertyId, brokerId]
    );
  },

  async removeBrokerFromProperty(propertyId, brokerId) {
    return db.query(
      'DELETE FROM "brokerProperty" WHERE property_id = $1 AND broker_id = $2',
      [propertyId, brokerId]
    );
  }
};
