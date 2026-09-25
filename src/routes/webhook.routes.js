const express = require('express');
const { body } = require('express-validator');
const viajeController = require('../controllers/viaje.controller');

const router = express.Router();

router.get('/health', (req, res) => res.json({ status: 'UP' }));
router.get('/viajes', viajeController.obtenerViajes);
router.post('/solicitud-viaje', viajeController.procesarSolicitudViaje);

module.exports = router;
