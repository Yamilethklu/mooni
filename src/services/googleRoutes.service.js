const axios = require('axios');
const config = require('../config/env');

/**
 * Calcula la distancia y tiempo estimado de viaje entre origen y destino
 * utilizando Google Routes API v2 (computeRouteMatrix).
 * 
 * @param {string} origen - Dirección o coordenada de origen
 * @param {string} destino - Dirección o coordenada de destino
 * @returns {Promise<{distancia_km: number, tiempo_min: number}>}
 */
async function calcularRuta(origen, destino) {
  const url = 'https://routes.googleapis.com/distanceMatrix/v2:computeRouteMatrix';
  
  if (!config.googleMapsApiKey || config.googleMapsApiKey.includes('tu_api_key')) {
    console.warn('[GoogleRoutesService] API Key no configurada o en borrador. Utilizando cálculo estimado de respaldo.');
    return {
      distancia_km: 8.5,
      tiempo_min: 18.0
    };
  }

  try {
    const payload = {
      origins: [
        {
          waypoint: {
            address: origen
          }
        }
      ],
      destinations: [
        {
          waypoint: {
            address: destino
          }
        }
      ],
      travelMode: 'DRIVE'
    };

    const response = await axios.post(url, payload, {
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': config.googleMapsApiKey,
        'X-Goog-FieldMask': 'originIndex,destinationIndex,duration,distanceMeters,status'
      },
      timeout: 10000
    });

    const items = Array.isArray(response.data) ? response.data : [response.data];
    const route = items[0] || {};

    const distanceMeters = route.distanceMeters || 0;
    const durationStr = route.duration || '0s';

    const seconds = parseFloat(durationStr.toString().replace('s', '')) || 0;

    const distancia_km = parseFloat((distanceMeters / 1000).toFixed(2));
    const tiempo_min = parseFloat((seconds / 60).toFixed(2));

    return {
      distancia_km,
      tiempo_min
    };
  } catch (error) {
    console.error('[GoogleRoutesService] Error al consultar Google Routes API v2:', error.response?.data || error.message);
    return {
      distancia_km: 5.0,
      tiempo_min: 15.0
    };
  }
}

module.exports = {
  calcularRuta
};
