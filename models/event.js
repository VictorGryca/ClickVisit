const db = require('../config/db');

module.exports = {
  async getEventsForPropertyMonth(propertyId, year, month) {
    // Busca eventos do mês para a propriedade
    const start = `${year}-${String(month).padStart(2, '0')}-01`;
    const endDate = new Date(year, month, 0).getDate();
    const end = `${year}-${String(month).padStart(2, '0')}-${endDate}`;
    const result = await db.query(
      `SELECT * FROM events WHERE property_id = $1 AND starts_at::date BETWEEN $2 AND $3 ORDER BY starts_at`,
      [propertyId, start, end]
    );
    return result.rows;
  },

  async addEvent(data) {
    const query = `
      INSERT INTO events (event_type, property_id, starts_at, ends_at, description)
      VALUES ($1, $2, $3, $4, $5)
    `;
    return db.query(query, [
      data.event_type,
      data.property_id,
      data.starts_at,
      data.ends_at,
      data.description || null
    ]);
  },

  async deleteEvent(eventId) {
    return db.query('DELETE FROM events WHERE id = $1', [eventId]);
  }
};
