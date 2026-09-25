const { validationResult } = require('express-validator');
const googleRoutesService = require('../services/googleRoutes.service');
const airtableService = require('../services/airtable.service');
const n8nService = require('../services/n8n.service');

/**
 * Procesa la solicitud de un nuevo viaje recibida por webhook
 */
async function procesarSolicitudViaje(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Parámetros de entrada inválidos',
        errors: errors.array()
      });
    }

    const { telefono_pasajero, origen_texto, destino_texto, oferta_pasajero } = req.body;

    // 1. Calcular distancia y tiempo con Google Routes API
    const { distancia_km, tiempo_min } = await googleRoutesService.calcularRuta(origen_texto, destino_texto);

    // 2. Calcular Tarifa Base Sugerida según la Fórmula Oficial MOONI:
    // Precio Sugerido = $30.00 MXN (Banderazo) + (Distancia KM * $8.00 MXN) + (Tiempo Min * $2.00 MXN)
    const BANDERAZO = 30.00;
    const COSTO_KM = 8.00;
    const COSTO_MIN = 2.00;

    const precio_sugerido = parseFloat(
      (BANDERAZO + (distancia_km * COSTO_KM) + (tiempo_min * COSTO_MIN)).toFixed(2)
    );

    // 3. Generar clave de idempotencia única
    const idempotencyKey = `IDEMP-${telefono_pasajero}-${Date.now()}`;

    const datosViaje = {
      idempotency_key: idempotencyKey,
      telefono_pasajero,
      origen_texto,
      destino_texto,
      distancia_km,
      tiempo_min,
      precio_sugerido,
      oferta_pasajero: parseFloat(oferta_pasajero),
      estado_viaje: 'solicitado'
    };

    // 4. Crear registro en Airtable
    let airtableRecord = null;
    try {
      airtableRecord = await airtableService.crearRegistroViaje(datosViaje);
    } catch (airtableErr) {
      console.warn('[ViajeController] No se pudo guardar en Airtable, continuando con el flujo:', airtableErr.message);
    }

    // 5. Reenviar payload a n8n Cloud
    const payloadN8N = {
      ...datosViaje,
      airtable_record_id: airtableRecord?.id || null
    };

    await n8nService.enviarAN8N(payloadN8N);

    // 6. Retornar respuesta estructurada 200 OK
    return res.status(200).json({
      status: 'success',
      message: 'Solicitud de viaje procesada correctamente',
      data: {
        telefono_pasajero,
        origen_texto,
        destino_texto,
        distancia_km,
        tiempo_min,
        precio_sugerido,
        oferta_pasajero: parseFloat(oferta_pasajero),
        estado_viaje: 'solicitado'
      }
    });

  } catch (error) {
    console.error('[ViajeController] Error al procesar solicitud de viaje:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Error interno del servidor al procesar la solicitud de viaje',
      error: error.message
    });
  }
}

module.exports = {
  procesarSolicitudViaje
};
