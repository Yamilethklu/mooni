const { validationResult } = require('express-validator');
const googleRoutesService = require('../services/googleRoutes.service');
const dbLocal = require('../database/dbLocal');
const n8nService = require('../services/n8n.service');

async function procesarSolicitudViaje(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: 'error', errors: errors.array() });
    }

    const { telefono_pasajero, origen_texto, destino_texto, oferta_pasajero } = req.body;
    const { distancia_km, tiempo_min } = await googleRoutesService.calcularRuta(origen_texto, destino_texto);

    const precio_sugerido = parseFloat((30 + (distancia_km * 8) + (tiempo_min * 2)).toFixed(2));

    const nuevoViaje = dbLocal.guardarViaje({
      telefono_pasajero,
      origen_texto,
      destino_texto,
      distancia_km,
      tiempo_min,
      precio_sugerido,
      oferta_pasajero: parseFloat(oferta_pasajero)
    });

    await n8nService.enviarAN8N(nuevoViaje);

    return res.status(200).json({ status: 'success', data: nuevoViaje });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
}

function obtenerViajes(req, res) {
  return res.json(dbLocal.leerDB());
}

module.exports = { procesarSolicitudViaje, obtenerViajes };
