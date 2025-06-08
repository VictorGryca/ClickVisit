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
