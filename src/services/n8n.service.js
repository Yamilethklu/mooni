const axios = require('axios');
const config = require('../config/env');

/**
 * Reenvía la solicitud de viaje procesada hacia el webhook de n8n Cloud
 * 
 * @param {Object} payload - Datos de la solicitud de viaje
 * @returns {Promise<Object>} Respuesta del webhook de n8n
 */
async function enviarAN8N(payload) {
  const url = config.n8nWebhookUrl;

  try {
    const response = await axios.post(url, payload, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });

    return response.data;
  } catch (error) {
    console.error('[N8NService] Error al enviar webhook a n8n:', error.response?.data || error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

module.exports = {
  enviarAN8N
};
