const Broker = require('../models/broker');
const Property = require('../models/property');

// Exibe calendário com horários disponíveis para o cliente marcar visita
exports.index = async (req, res) => {
  const brokerId = req.params.brokerId;
  const propertyId = req.params.propertyId;
  try {
    const broker = await Broker.findBasicById(brokerId);
    const property = await Property.findById(propertyId);
    if (!broker || !property) return res.status(404).send('Corretor ou imóvel não encontrado.');

    const brokerAvailability = await Broker.getAvailability(brokerId);
    const propertyEvents = await Property.getEvents(propertyId);

    // Calendar logic
    const now = new Date();
    const currentMonth = parseInt(req.query.month) || (now.getMonth() + 1);
    const currentYear = parseInt(req.query.year) || now.getFullYear();
    const firstDayOfWeek = new Date(currentYear, currentMonth - 1, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
    const todayStr = now.toISOString().slice(0, 10);
    const monthNames = [
      "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
      "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];
    const currentMonthName = monthNames[currentMonth - 1];

    // Determina o dia selecionado (por padrão hoje)
    const selectedDay = req.query.day || todayStr;

    // Horários possíveis
    const allowedSlots = ["09:00", "10:30", "13:00", "14:30", "16:00"];

    // Horários já cadastrados para o dia selecionado (corretor)
    const takenSlotsBroker = brokerAvailability
      .filter(a => {
        const d = new Date(a.starts_at);
        return d.toISOString().slice(0, 10) === selectedDay;
      })
      .map(a => {
        const d = new Date(a.starts_at);
        return d.getHours().toString().padStart(2, '0') + ':' + d.getMinutes().toString().padStart(2, '0');
      });

    // Horários já ocupados no imóvel para o dia selecionado
    const takenSlotsProperty = propertyEvents
      .filter(e => {
        const d = new Date(e.starts_at);
        return d.toISOString().slice(0, 10) === selectedDay;
      })
      .map(e => {
        const d = new Date(e.starts_at);
        return d.getHours().toString().padStart(2, '0') + ':' + d.getMinutes().toString().padStart(2, '0');
      });

    // Horários disponíveis: corretor disponível E imóvel sem evento
    const availableSlots = allowedSlots.filter(slot =>
      takenSlotsBroker.includes(slot) && !takenSlotsProperty.includes(slot)
    );

    // Para visualização em calendário: agrupa horários disponíveis por dia do mês atual
    const availabilityByDay = {};
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const takenSlotsBrokerDay = brokerAvailability
        .filter(a => new Date(a.starts_at).toISOString().slice(0, 10) === dateStr)
        .map(a => {
          const d = new Date(a.starts_at);
          return d.getHours().toString().padStart(2, '0') + ':' + d.getMinutes().toString().padStart(2, '0');
        });
      const takenSlotsPropertyDay = propertyEvents
        .filter(e => new Date(e.starts_at).toISOString().slice(0, 10) === dateStr)
        .map(e => {
          const d = new Date(e.starts_at);
          return d.getHours().toString().padStart(2, '0') + ':' + d.getMinutes().toString().padStart(2, '0');
        });
      availabilityByDay[dateStr] = allowedSlots.filter(slot =>
        takenSlotsBrokerDay.includes(slot) && !takenSlotsPropertyDay.includes(slot)
      );
    }

    res.render('client/schedule', {
      broker,
      property,
      currentMonth,
      currentYear,
      firstDayOfWeek,
      daysInMonth,
      todayStr,
      currentMonthName,
      selectedDay,
      availableSlots,
      availabilityByDay
    });
  } catch (err) {
    console.error('Erro ao buscar horários disponíveis:', err); // Adicione este log
    res.status(500).send('Erro ao buscar horários disponíveis: ' + err.message); // Mostra mensagem detalhada
  }
};

// Exibe formulário para o cliente preencher dados e confirmar agendamento
exports.bookForm = async (req, res) => {
  const { brokerId, propertyId } = req.params;
  const { day, slot } = req.query;
  const broker = await Broker.findBasicById(brokerId);
  const property = await Property.findById(propertyId);
  if (!broker || !property || !day || !slot) {
    return res.status(400).send('Dados insuficientes para agendamento.');
  }
  res.render('client/book', {
    broker,
    property,
    day,
    slot
  });
};

// Processa o agendamento: cadastra cliente e visita
exports.bookVisit = async (req, res) => {
  const { brokerId, propertyId } = req.params;
  const { day, slot, name, phone, email } = req.body;
  try {
    const db = require('../config/db');
    // Busca cliente pelo email
    let clientResult = await db.query(
      'SELECT id FROM clients WHERE email = $1',
      [email]
    );
    let clientId;
    if (clientResult.rows.length > 0) {
      clientId = clientResult.rows[0].id;
    } else {
      const insertClient = await db.query(
        'INSERT INTO clients (name, phone, email) VALUES ($1, $2, $3) RETURNING id',
        [name, phone, email]
      );
      clientId = insertClient.rows[0].id;
    }

    // Monta starts_at e ends_at a partir do slot
    const slotMap = {
      "09:00": { start: "09:00", end: "10:30" },
      "10:30": { start: "10:30", end: "12:00" },
      "13:00": { start: "13:00", end: "14:30" },
      "14:30": { start: "14:30", end: "16:00" },
      "16:00": { start: "16:00", end: "17:30" }
    };
    const slotObj = slotMap[slot];
    if (!slotObj) return res.status(400).send('Horário inválido.');

    const starts_at = `${day}T${slotObj.start}:00-03:00`;
    const ends_at = `${day}T${slotObj.end}:00-03:00`;

    await db.query(
      'INSERT INTO visits (client_id, broker_id, property_id, starts_at, ends_at) VALUES ($1, $2, $3, $4, $5)',
      [clientId, brokerId, propertyId, starts_at, ends_at]
    );

    // Atualiza apenas o agendamento de disponibilidade correspondente
    await db.query(
      `UPDATE availability
       SET description = 'visit'
       WHERE broker_id = $1 AND starts_at = $2 AND ends_at = $3`,
      [brokerId, starts_at, ends_at]
    );

    // Corrija aqui: busque o property para passar para a view de sucesso
    const Property = require('../models/property');
    const property = await Property.findById(propertyId);

    res.render('client/success', { name, day, slot, property });
  } catch (err) {
    console.error('Erro ao agendar visita:', err);
    res.status(500).send('Erro ao agendar visita.');
  }
};
