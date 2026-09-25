const express = require('express');
const cors = require('cors');
const path = require('path');
const webhookRoutes = require('./routes/webhook.routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

app.use('/api/v1/webhooks', webhookRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 MOONI Dashboard en http://localhost:${PORT}`));
