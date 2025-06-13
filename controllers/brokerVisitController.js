const db = require('../config/db');

exports.deleteVisit = async (req, res) => {
  const brokerId = req.params.id;
  const visitId = req.params.visitId;

  try {
    // Busca dados da visita
    const visitRes = await db.query(
      'SELECT property_id, starts_at, ends_at FROM visits WHERE id = $1 AND broker_id = $2',
      [visitId, brokerId]
    );
    if (visitRes.rows.length === 0) {
      return res.status(404).send('Visita não encontrada.');
    }
    const { property_id, starts_at, ends_at } = visitRes.rows[0];

    // Deleta a visita
    await db.query('DELETE FROM visits WHERE id = $1', [visitId]);

    // Deleta o event correspondente
    await db.query(
      `DELETE FROM events WHERE property_id = $1 AND starts_at = $2 AND ends_at = $3 AND event_type = 'visit'`,
      [property_id, starts_at, ends_at]
    );

    // Limpa a description da availability do corretor
    await db.query(
      `UPDATE availability SET description = '' WHERE broker_id = $1 AND starts_at = $2 AND ends_at = $3`,
      [brokerId, starts_at, ends_at]
    );

    res.redirect(`/brokers/${brokerId}/visits`);
  } catch (err) {
    res.status(500).send('Erro ao deletar visita.');
  }
};
