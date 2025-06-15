const Visit = require('../models/visit');
const Event = require('../models/event');
const Availability = require('../models/availability');

exports.deleteVisit = async (req, res) => {
  const brokerId = req.params.id;
  const visitId = req.params.visitId;

  try {
    // Busca dados da visita
    const visit = await Visit.findByIdAndBroker(visitId, brokerId);
    if (!visit) {
      return res.status(404).send('Visita não encontrada.');
    }
    const { property_id, starts_at, ends_at } = visit;

    // Deleta a visita
    await Visit.delete(visitId);

    // Deleta o event correspondente
    await Event.deleteEventByDetails(property_id, starts_at, ends_at, 'visit');

    // Limpa a description da availability do corretor
    await Availability.updateDescription(brokerId, starts_at, ends_at, '');

    res.redirect(`/brokers/${brokerId}/visits`);
  } catch (err) {
    res.status(500).send('Erro ao deletar visita.');
  }
};
