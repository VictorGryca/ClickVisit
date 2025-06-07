const db = require('../config/db');

// Lista horários disponíveis e mostra formulário
exports.index = async (req, res) => {
  const brokerId = req.params.id;
  try {
    const brokerResult = await db.query(
      'SELECT id, name FROM brokers WHERE id = $1',
      [brokerId]
    );
    const broker = brokerResult.rows[0];
    if (!broker) return res.status(404).send('Corretor não encontrado.');

    // Busca starts_at e ends_at da tabela availability
    const availResult = await db.query(
      'SELECT id, starts_at, ends_at, description FROM availability WHERE broker_id = $1 ORDER BY starts_at',
      [brokerId]
    );
    const availability = availResult.rows;

    res.render('brokers/agenda', { broker, availability });
  } catch (err) {
    res.status(500).send('Erro ao buscar agenda do corretor.');
  }
};

// Adiciona novo horário disponível
exports.add = async (req, res) => {
  const brokerId = req.params.id;
  const { day, time_slot } = req.body;
  // Validação dos horários permitidos
  const allowedSlots = ["09:00", "10:30", "13:00", "14:30", "16:00"];
  if (!allowedSlots.includes(time_slot)) {
    return res.status(400).send('Horário inválido.');
  }
  // Mapeia time_slot para intervalos de horário
  const slotMap = {
    "09:00": { start: "09:00", end: "10:30" },
    "10:30": { start: "10:30", end: "12:00" },
    "13:00": { start: "13:00", end: "14:30" },
    "14:30": { start: "14:30", end: "16:00" },
    "16:00": { start: "16:00", end: "17:30" }
  };
  const slot = slotMap[time_slot];
  if (!slot) {
    return res.status(400).send('Horário inválido.');
  }
  // Monta os timestamps
  const starts_at = `${day}T${slot.start}:00`;
  const ends_at = `${day}T${slot.end}:00`;

  try {
    await db.query(
      'INSERT INTO availability (broker_id, starts_at, ends_at) VALUES ($1, $2, $3)',
      [brokerId, starts_at, ends_at]
    );
    res.redirect(`/brokers/${brokerId}/agenda`);
  } catch (err) {
    res.status(500).send('Erro ao cadastrar disponibilidade.');
  }
};
