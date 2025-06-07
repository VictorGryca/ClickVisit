const Property = require('../models/property');
const Agency = require('../models/agency');
const BrokerProperty = require('../models/brokerProperty');

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
