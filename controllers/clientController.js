const Broker = require('../models/broker');
const Event = require('../models/event');
const Property = require('../models/property');

const TIME_SLOTS = [
  { label: "09:00", start: "09:00", end: "10:30" },
  { label: "10:30", start: "10:30", end: "12:00" },
  { label: "13:00", start: "13:00", end: "14:30" },
  { label: "14:30", start: "14:30", end: "16:00" },
  { label: "16:00", start: "16:00", end: "17:30" }
];

exports.calendar = async (req, res) => {
  const { brokerId, propertyId } = req.params;
  const now = new Date();
  const currentMonth = parseInt(req.query.month) || (now.getMonth() + 1);
  const currentYear = parseInt(req.query.year) || now.getFullYear();
  const firstDayOfWeek = new Date(currentYear, currentMonth - 1, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
  const todayStr = now.toISOString().slice(0, 10);

  // Busca disponibilidade do corretor
  const brokerAvailability = await Broker.getAvailability(brokerId);

  // Busca eventos do imóvel (bloqueios, manutenções, etc)
  const propertyEvents = await Event.getEventsForPropertyMonth(propertyId, currentYear, currentMonth);

  // Monta um mapa de horários disponíveis por dia
  const availableByDay = {};
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    availableByDay[dateStr] = [];

    // Para cada slot, verifica se está disponível para o corretor e não bloqueado no imóvel
    for (const slot of TIME_SLOTS) {
      // Disponibilidade do corretor
      const brokerHas = brokerAvailability.some(av => {
        const avDate = new Date(av.starts_at);
        const avDateStr = avDate.getFullYear() + '-' +
          String(avDate.getMonth() + 1).padStart(2, '0') + '-' +
          String(avDate.getDate()).padStart(2, '0');
        const avHour = avDate.getHours().toString().padStart(2, '0') + ':' + avDate.getMinutes().toString().padStart(2, '0');
        return avDateStr === dateStr && avHour === slot.start;
      });

      // Evento bloqueando o imóvel
      const blocked = propertyEvents.some(ev => {
        const evDate = new Date(ev.starts_at);
        const evDateStr = evDate.getFullYear() + '-' +
          String(evDate.getMonth() + 1).padStart(2, '0') + '-' +
          String(evDate.getDate()).padStart(2, '0');
        const evHour = evDate.getHours().toString().padStart(2, '0') + ':' + evDate.getMinutes().toString().padStart(2, '0');
        return evDateStr === dateStr && evHour === slot.start && ev.event_type !== 'available';
      });

      if (brokerHas && !blocked) {
        availableByDay[dateStr].push(slot.label);
      }
    }
  }

  const broker = await Broker.findBasicById(brokerId);
  const property = await Property.findById(propertyId);

  res.render('client/calendar', {
    broker,
    property,
    currentMonth,
    currentYear,
    firstDayOfWeek,
    daysInMonth,
    todayStr,
    availableByDay,
    TIME_SLOTS
  });
};
