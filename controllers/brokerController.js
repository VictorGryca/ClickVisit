const Broker = require('../models/broker');

// Perfil do corretor
exports.profile = async (req, res) => {
  const brokerId = req.params.id;
  try {
    const broker = await Broker.findById(brokerId);
    if (!broker) {
      return res.status(404).send('Corretor não encontrado.');
    }
    res.render('brokers/profile', { broker });
  } catch (err) {
    res.status(500).send('Erro ao buscar dados do corretor.');
  }
};

// Editar corretor
exports.edit = async (req, res) => {
  const brokerId = req.params.id;
  const { name, email, phone, creci } = req.body;
  try {
    await Broker.update(brokerId, { name, email, phone, creci });
    res.redirect(`/brokers/${brokerId}`);
  } catch (err) {
    res.status(500).send('Erro ao atualizar dados do corretor.');
  }
};

// Visitas do corretor
exports.visits = async (req, res) => {
  const brokerId = req.params.id;
  try {
    const broker = await Broker.findBasicById(brokerId);
    if (!broker) {
      return res.status(404).send('Corretor não encontrado.');
    }
    const visits = await Broker.getVisits(brokerId);
    res.render('brokers/visits', { broker, visits });
  } catch (err) {
    res.status(500).send('Erro ao buscar visitas do corretor.');
  }
};
