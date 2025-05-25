// controllers/agencyController.js
const Agency = require('../models/agency');

exports.index = async (req, res, next) => {
  try {
    const agencies = await Agency.findAll();       // OK
    res.render('agency/index', { agencies });      // passa "agencies" para a view
  } catch (err) {
    next(err); // deixa o Express tratar se algo der errado
  }
};

exports.store = async (req, res, next) => {
  try {
    await Agency.create(req.body);
    res.redirect('/agencies');
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Agency.update(id, req.body);
    res.redirect('/agencies');
  } catch (err) {
    next(err);
  }
};

exports.destroy = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Agency.delete(id);
    res.redirect('/agencies');
  } catch (err) {
    next(err);
  }
};
