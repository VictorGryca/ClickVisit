const db = require('../config/db');

exports.profile = async (req, res) => {
  const brokerId = req.params.id;
  try {
    const brokerResult = await db.query(
      'SELECT id, name, email, phone, creci FROM brokers WHERE id = $1',
      [brokerId]
    );
    const broker = brokerResult.rows[0];

    if (!broker) {
      return res.status(404).send('Corretor não encontrado.');
    }

    res.render('brokers/profile', { broker });
  } catch (err) {
    res.status(500).send('Erro ao buscar dados do corretor.');
  }
};

exports.edit = async (req, res) => {
  const brokerId = req.params.id;
  const { name, email, phone, creci } = req.body;
  try {
    await db.query(
      'UPDATE brokers SET name = $1, email = $2, phone = $3, creci = $4 WHERE id = $5',
      [name, email, phone, creci, brokerId]
    );
    res.redirect(`/brokers/${brokerId}`);
  } catch (err) {
    res.status(500).send('Erro ao atualizar dados do corretor.');
  }
};

exports.visits = async (req, res) => {
  const brokerId = req.params.id;
  try {
    const brokerResult = await db.query(
      'SELECT id, name FROM brokers WHERE id = $1',
      [brokerId]
    );
    const broker = brokerResult.rows[0];

    if (!broker) {
      return res.status(404).send('Corretor não encontrado.');
    }

    const visitsResult = await db.query(
      `SELECT v.id, v.starts_at, v.ends_at, v.status, 
              p.address AS property_address, c.name AS client_name
         FROM visits v
         JOIN properties p ON v.property_id = p.id
         JOIN clients c ON v.client_id = c.id
        WHERE v.broker_id = $1
        ORDER BY v.starts_at DESC`,
      [brokerId]
    );
    const visits = visitsResult.rows;

    res.render('brokers/visits', { broker, visits });
  } catch (err) {
    res.status(500).send('Erro ao buscar visitas do corretor.');
  }
};
