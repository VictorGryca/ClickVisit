const db = require('../config/db');

module.exports = {
  /**
   * Cria uma nova visita.
   * @param {{clientId:number, brokerId:number, propertyId:number, starts_at:string, ends_at:string}} data
   */
  async create({ clientId, brokerId, propertyId, starts_at, ends_at }) {
    await db.query(
      'INSERT INTO visits (client_id, broker_id, property_id, starts_at, ends_at) VALUES ($1, $2, $3, $4, $5)',
      [clientId, brokerId, propertyId, starts_at, ends_at]
    );
  },

  /**
   * Remove uma visita pelo id.
   * @param {number} visitId
   */
  async delete(visitId) {
    await db.query('DELETE FROM visits WHERE id = $1', [visitId]);
  },

  /**
   * Recupera visita vinculada a um corretor.
   * @param {number} visitId
   * @param {number} brokerId
   * @returns {Promise<object|undefined>}
   */
  async findByIdAndBroker(visitId, brokerId) {
    const result = await db.query(
      'SELECT property_id, starts_at, ends_at FROM visits WHERE id = $1 AND broker_id = $2',
      [visitId, brokerId]
    );
    return result.rows[0];
  },
}; 