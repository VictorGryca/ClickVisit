// controllers/agencyController.js
const Agency = require('../models/agency');
const Property = require('../models/property');

exports.index = async (req, res, next) => {
  const { agencyId } = req.params;
  // Busca o nome da agência pelo model
  const agencyName = await Agency.getNameById(agencyId);
  const properties = await Property.findAll(agencyId);

  // Detecta se o acesso é via admin (URL começa com /admin)
  const isAdmin = req.baseUrl.startsWith('/admin');

  res.render('agency/index', { agencyId, agencyName, properties, isAdmin });
};

exports.store = async (req, res, next) => {
  try {
    await Property.create(req.params.agencyId, req.body);
    res.redirect(`/agencies/${req.params.agencyId}/properties`);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    await Property.update(req.params.id, req.body);
    res.redirect(`/agencies/${req.params.agencyId}/properties`);
  } catch (err) {
    next(err);
  }
};

exports.destroy = async (req, res, next) => {
  try {
    await Property.delete(req.params.id);
    res.redirect(`/agencies/${req.params.agencyId}/properties`);
  } catch (err) {
    next(err);
  }
};
