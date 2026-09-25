const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  n8nWebhookUrl: process.env.N8N_WEBHOOK_URL || 'https://mooni2.app.n8n.cloud/webhook/mooni/solicitud-viaje',
  googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || '',
  airtablePat: process.env.AIRTABLE_PAT || '',
  airtableBaseId: process.env.AIRTABLE_BASE_ID || '',
};

module.exports = config;
