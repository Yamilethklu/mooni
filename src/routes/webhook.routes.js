const express = require('express');
const { body } = require('express-validator');
const viajeController = require('../controllers/viaje.controller');

const router = express.Router();

/**
 * @route   GET /api/v1/webhooks/health
 * @desc    Monitoreo de salud del servidor
 * @access  Public
 */
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date().toISOString()
  });
});

/**
 * @route   POST /api/v1/webhooks/solicitud-viaje
 * @desc    Procesa la solicitud de viaje desde WhatsApp / n8n
 * @access  Public
 */
router.post(
  '/solicitud-viaje',
  [
    body('telefono_pasajero')
      .notEmpty()
      .withMessage('El campo telefono_pasajero es obligatorio'),
    body('origen_texto')
      .notEmpty()
      .withMessage('El campo origen_texto es obligatorio'),
    body('destino_texto')
      .notEmpty()
      .withMessage('El campo destino_texto es obligatorio'),
    body('oferta_pasajero')
      .notEmpty()
      .withMessage('El campo oferta_pasajero es obligatorio')
      .isNumeric()
      .withMessage('El campo oferta_pasajero debe ser un número válido')
  ],
  viajeController.procesarSolicitudViaje
);

module.exports = router;
