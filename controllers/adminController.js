const Agency = require('../models/agency');

exports.index = async (req, res, next) => {
  try {
    const agencies = await Agency.findAll();
    res.render('admin/index', { agencies });
  } catch (err) {
    next(err);
  }
};

exports.store = async (req, res, next) => {
  try {
    await Agency.create(req.body);
    res.redirect('/admin');
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Agency.update(id, req.body);
    res.redirect('/admin');
  } catch (err) {
    next(err);
  }
};

exports.destroy = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Agency.delete(id);
    res.redirect('/admin');
  } catch (err) {
    next(err);
  }
};
