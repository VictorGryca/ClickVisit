const Broker = require('../models/broker');

// Lista horários disponíveis e mostra formulário
exports.index = async (req, res) => {
  const brokerId = req.params.id;
  try {
    const broker = await Broker.findBasicById(brokerId);
    if (!broker) return res.status(404).send('Corretor não encontrado.');

    const availability = await Broker.getAvailability(brokerId);

    res.render('brokers/agenda', { broker, availability });
  } catch (err) {
    res.status(500).send('Erro ao buscar agenda do corretor.');
  }
};

// Adiciona novo horário disponível
exports.add = async (req, res) => {
  const brokerId = req.params.id;
  const { day, time_slot } = req.body;
  const allowedSlots = ["09:00", "10:30", "13:00", "14:30", "16:00"];
  if (!allowedSlots.includes(time_slot)) {
    return res.status(400).send('Horário inválido.');
  }
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
  const starts_at = `${day}T${slot.start}:00`;
  const ends_at = `${day}T${slot.end}:00`;

  try {
    await Broker.addAvailability(brokerId, starts_at, ends_at);
    res.redirect(`/brokers/${brokerId}/agenda`);
  } catch (err) {
    res.status(500).send('Erro ao cadastrar disponibilidade.');
  }
};
