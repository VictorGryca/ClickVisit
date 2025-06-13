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
    // Ajusta datas para UTC-3
    const rows = result.rows.map(ev => {
      const adjust = dateStr => {
        if (!dateStr) return null;
        const d = new Date(dateStr);
        d.setHours(d.getHours() - 3);
        return d;
      };
      return {
        ...ev,
        starts_at: adjust(ev.starts_at),
        ends_at: adjust(ev.ends_at)
      };
    });
    return rows;
  },

  async addEvent(data) {
    // Só permite horários válidos
    const allowedSlots = {
      "09:00": "10:30",
      "10:30": "12:00",
      "13:00": "14:30",
      "14:30": "16:00",
      "16:00": "17:30"
    };
    if (!allowedSlots[data.starts_at]) {
      throw new Error('Horário inválido');
    }
    // Monta datas completas no formato ISO com timezone -03:00
    const day = data.day; // yyyy-mm-dd
    const starts_at = `${day}T${data.starts_at}:00-03:00`;
    const ends_at = `${day}T${allowedSlots[data.starts_at]}:00-03:00`;
    const query = `
      INSERT INTO events (event_type, property_id, starts_at, ends_at, description)
      VALUES ($1, $2, $3, $4, $5)
    `;
    return db.query(query, [
      data.event_type,
      data.property_id,
      starts_at,
      ends_at,
      data.description || null
    ]);
  },

  async deleteEvent(eventId) {
    return db.query('DELETE FROM events WHERE id = $1', [eventId]);
  }
};
