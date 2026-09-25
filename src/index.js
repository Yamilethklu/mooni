const express = require('express');
const cors = require('cors');
const config = require('./config/env');
const webhookRoutes = require('./routes/webhook.routes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas de la API
app.use('/api/v1/webhooks', webhookRoutes);

// Ruta raíz por defecto
app.get('/', (req, res) => {
  res.status(200).json({
    name: 'MOONI Bot Backend',
    version: '1.0.0',
    status: 'online',
    healthCheck: '/api/v1/webhooks/health'
  });
});

// Manejo de rutas no encontradas (404)
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Ruta no encontrada'
  });
});

// Iniciar servidor
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`🚀 MOONI Bot Backend ejecutándose en puerto ${PORT}`);
  console.log(`🌍 Entorno: ${config.nodeEnv}`);
  console.log(`🔗 Healthcheck: http://localhost:${PORT}/api/v1/webhooks/health`);
  console.log(`==================================================`);
});

module.exports = app;
