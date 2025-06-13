const Property = require('../models/property');
const Agency = require('../models/agency');
const BrokerProperty = require('../models/brokerProperty');
const Event = require('../models/event');

exports.index = async (req, res, next) => {
  const { agencyId } = req.params;
  const agencyName = await Agency.getNameById(agencyId);
  const properties = await Property.findAll(agencyId);

  // Para cada propriedade, busque os brokers vinculados
  for (const prop of properties) {
    prop.brokers = await BrokerProperty.getBrokersForProperty(prop.id);
  }
  // Lista de todos os brokers para seleção
  const allBrokers = await BrokerProperty.getAllBrokers(agencyId);

  res.render('property/index', { agencyId, agencyName, properties, allBrokers });
};

exports.addBroker = async (req, res, next) => {
  const { agencyId, propertyId } = req.params;
  const { broker_id } = req.body;
  await require('../models/brokerProperty').addBrokerToProperty(propertyId, broker_id);
  res.redirect(`/agencies/${agencyId}/properties`);
};

exports.removeBroker = async (req, res, next) => {
  const { agencyId, propertyId, brokerId } = req.params;
  await require('../models/brokerProperty').removeBrokerFromProperty(propertyId, brokerId);
  res.redirect(`/agencies/${agencyId}/properties`);
};

exports.store = async (req, res, next) => {
  await Property.create(req.params.agencyId, req.body);
  res.redirect(`/agencies/${req.params.agencyId}/properties`);
};

exports.update = async (req, res, next) => {
  await Property.update(req.params.id, req.body);
  res.redirect(`/agencies/${req.params.agencyId}/properties`);
};

exports.destroy = async (req, res, next) => {
  await Property.delete(req.params.id);
  res.redirect(`/agencies/${req.params.agencyId}/properties`);
};

exports.propertyCalendar = async (req, res, next) => {
  const { agencyId, propertyId } = req.params;
  const property = await Property.findById(propertyId);
  if (!property) return res.status(404).send('Propriedade não encontrada.');

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

  // Busca eventos da propriedade para o mês
  const events = await Event.getEventsForPropertyMonth(propertyId, currentYear, currentMonth);

  // Dia selecionado
  const selectedDay = req.query.day || todayStr;

  res.render('property/calendar', {
    property,
    agencyId,
    currentMonth,
    currentYear,
    firstDayOfWeek,
    daysInMonth,
    todayStr,
    currentMonthName,
    selectedDay,
    events
  });
};

exports.addEvent = async (req, res) => {
  try {
    // req.body já contém: event_type, starts_at, ends_at, description, day, property_id
    await require('../models/event').addEvent(req.body);
    res.redirect(`/agencies/${req.params.agencyId}/properties/${req.params.propertyId}?day=${req.body.day}`);
  } catch (err) {
    res.status(400).send('Horário inválido ou erro ao adicionar evento.');
  }
};

exports.deleteEvent = async (req, res, next) => {
  const { agencyId, propertyId, eventId } = req.params;
  const day = req.query.day || '';
  await require('../models/event').deleteEvent(eventId);
  res.redirect(`/agencies/${agencyId}/properties/${propertyId}${day ? '?day=' + encodeURIComponent(day) : ''}`);
};
