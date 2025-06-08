const db = require('../config/db');

async function create(agencyId, data) {
  const q = 'INSERT INTO properties (agency_id, address, price, status) VALUES ($1,$2,$3,$4)';
  return db.query(q, [agencyId, data.address, data.price, data.status]);
}

async function findAll(agencyId) {
  const r = await db.query('SELECT * FROM properties WHERE agency_id=$1 ORDER BY id', [agencyId]);
  return r.rows;
}

async function findById(id) {
  const result = await db.query('SELECT * FROM properties WHERE id = $1', [id]);
  return result.rows[0];
}

async function update(id, data) {
  const q = 'UPDATE properties SET address=$1, price=$2, status=$3 WHERE id=$4';
  return db.query(q, [data.address, data.price, data.status, id]);
}

async function deleteProperty(id) {
  return db.query('DELETE FROM properties WHERE id=$1', [id]);
}

// Busca eventos agendados para o imóvel
async function getEvents(propertyId) {
  const result = await db.query(
    'SELECT id, starts_at, ends_at FROM events WHERE property_id = $1',
    [propertyId]
  );
  return result.rows;
}

module.exports = {
  create,
  findAll,
  findById,
  update,
  delete: deleteProperty,
  getEvents
};