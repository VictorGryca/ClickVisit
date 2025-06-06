const Property = require('../models/property');

exports.index = async (req,res,next)=>{
  const { agencyId } = req.params;
  // Busca o nome da agência
  const agencyResult = await require('../config/db').query('SELECT name FROM agencies WHERE id = $1', [agencyId]);
  const agencyName = agencyResult.rows[0] ? agencyResult.rows[0].name : agencyId;
  const properties = await Property.findAll(agencyId);
  res.render('property/index', { agencyId, agencyName, properties });
};

exports.store   = async (req,res,next)=>{
  await Property.create(req.params.agencyId, req.body);
  res.redirect(`/agencies/${req.params.agencyId}/properties`);
};

exports.update  = async (req,res,next)=>{
  await Property.update(req.params.id, req.body);
  res.redirect(`/agencies/${req.params.agencyId}/properties`);
};

exports.destroy = async (req,res,next)=>{
  await Property.delete(req.params.id);
  res.redirect(`/agencies/${req.params.agencyId}/properties`);
};
