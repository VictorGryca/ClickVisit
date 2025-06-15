const db = require('../config/db');

module.exports = {
  /**
   * Busca uma disponibilidade específica.
   * @param {number} availabilityId
   * @param {number} brokerId
   * @returns {Promise<object|undefined>}
   */
  async getById(availabilityId, brokerId) {
    const result = await db.query(
      'SELECT id, description, starts_at, ends_at FROM availability WHERE id = $1 AND broker_id = $2',
      [availabilityId, brokerId]
    );
    return result.rows[0];
  },

  /**
   * Atualiza a descrição de uma disponibilidade baseada nas datas.
   * @param {number} brokerId
   * @param {string} starts_at
   * @param {string} ends_at
   * @param {string|null} description
   */
  async updateDescription(brokerId, starts_at, ends_at, description) {
    await db.query(
      `UPDATE availability SET description = $4 WHERE broker_id = $1 AND starts_at = $2 AND ends_at = $3`,
      [brokerId, starts_at, ends_at, description]
    );
  },

  /**
   * Remove uma disponibilidade.
   * @param {number} availabilityId
   * @param {number} brokerId
   */
  async delete(availabilityId, brokerId) {
    await db.query('DELETE FROM availability WHERE id = $1 AND broker_id = $2', [availabilityId, brokerId]);
  },
}; 