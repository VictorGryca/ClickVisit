// controllers/agencyController.js
const Agency = require('../models/agency');
const Property = require('../models/property');

exports.index = async (req, res, next) => {
  const { agencyId } = req.params;
  try {
    const agencyResult = await require('../config/db').query('SELECT name FROM agencies WHERE id = $1', [agencyId]);
    const agencyName = agencyResult.rows[0] ? agencyResult.rows[0].name : agencyId;
    const properties = await Property.findAll(agencyId);
    res.render('agency/index', { agencyId, agencyName, properties });
  } catch (err) {
    next(err);
  }
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
