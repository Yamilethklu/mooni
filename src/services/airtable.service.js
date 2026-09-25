const axios = require('axios');
const config = require('../config/env');

/**
 * Cliente Axios configurado para la API de Airtable
 */
function getAirtableClient() {
  if (!config.airtablePat || config.airtablePat.includes('tu_token') || !config.airtableBaseId || config.airtableBaseId.includes('tu_base')) {
    return null;
  }
  return axios.create({
    baseURL: `https://api.airtable.com/v0/${config.airtableBaseId}`,
    headers: {
      'Authorization': `Bearer ${config.airtablePat}`,
      'Content-Type': 'application/json'
    },
    timeout: 10000
  });
}

/**
 * Crea un registro en la tabla 'Viajes' de Airtable
 * 
 * @param {Object} datosViaje
 * @returns {Promise<Object>} Registro creado o mock response
 */
async function crearRegistroViaje(datosViaje) {
  const client = getAirtableClient();

  if (!client) {
    console.warn('[AirtableService] Token o Base ID de Airtable no configurados. Omitiendo guardado remoto.');
    return {
      id: `rec_mock_${Date.now()}`,
      fields: {
        Origen_Texto: datosViaje.origen_texto,
        Destino_Texto: datosViaje.destino_texto,
        Distancia_KM: datosViaje.distancia_km,
        Tiempo_Min: datosViaje.tiempo_min,
        Precio_Sugerido: datosViaje.precio_sugerido,
        Estado_Viaje_Vigente: 'solicitado'
      }
    };
  }

  try {
    const payload = {
      records: [
        {
          fields: {
            Origen_Texto: datosViaje.origen_texto,
            Destino_Texto: datosViaje.destino_texto,
            Distancia_KM: Number(datosViaje.distancia_km),
            Tiempo_Min: Number(datosViaje.tiempo_min),
            Precio_Sugerido: Number(datosViaje.precio_sugerido),
            Estado_Viaje_Vigente: 'solicitado',
            Telefono_Pasajero: datosViaje.telefono_pasajero,
            Oferta_Pasajero: Number(datosViaje.oferta_pasajero)
          }
        }
      ]
    };

    const response = await client.post('/Viajes', payload);
    return response.data?.records?.[0] || response.data;
  } catch (error) {
    console.error('[AirtableService] Error al crear registro en Viajes:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Registra intentos de negociación en la tabla 'Negociaciones'
 * 
 * @param {string} idViaje - ID del registro del viaje en Airtable
 * @param {number} ofertaPasajero - Nueva oferta realizada por el pasajero
 * @returns {Promise<Object>} Registro creado o mock response
 */
async function registrarNegociacion(idViaje, ofertaPasajero) {
  const client = getAirtableClient();

  if (!client) {
    console.warn('[AirtableService] Token o Base ID de Airtable no configurados. Omitiendo registro de negociación.');
    return {
      id: `neg_mock_${Date.now()}`,
      fields: {
        Viaje_ID: idViaje,
        Oferta_Pasajero: ofertaPasajero
      }
    };
  }

  try {
    const payload = {
      records: [
        {
          fields: {
            Viajes: [idViaje],
            Oferta_Pasajero: Number(ofertaPasajero),
            Fecha_Registro: new Date().toISOString()
          }
        }
      ]
    };

    const response = await client.post('/Negociaciones', payload);
    return response.data?.records?.[0] || response.data;
  } catch (error) {
    console.error('[AirtableService] Error al registrar negociación:', error.response?.data || error.message);
    throw error;
  }
}

module.exports = {
  crearRegistroViaje,
  registrarNegociacion
};
