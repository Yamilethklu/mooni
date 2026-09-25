# MOONI Bot Backend 🚕📱

Backend y conector de mensajería automatizado para **MOONI**, la plataforma de transporte bajo demanda estilo Uber/InDrive con negociación de tarifas que opera mediante WhatsApp y n8n.

---

## 🛠️ Arquitectura del Proyecto

```text
mooni-bot-backend/
├── .env.example
├── .gitignore
├── package.json
├── README.md
└── src/
    ├── index.js
    ├── config/
    │   └── env.js
    ├── controllers/
    │   └── viaje.controller.js
    ├── routes/
    │   └── webhook.routes.js
    └── services/
        ├── airtable.service.js
        ├── googleRoutes.service.js
        └── n8n.service.js
```

---

## 🚀 Inicio Rápido en Desarrollo Local

### 1. Clonar / Descargar el proyecto e instalar dependencias

```bash
npm install
```

### 2. Configurar Variables de Entorno

Copia el archivo `.env.example` a `.env` y asigna tus credenciales:

```bash
cp .env.example .env
```

Parámetros en `.env`:
- `PORT`: Puerto de ejecución del servidor (predeterminado `3000`).
- `NODE_ENV`: Entorno (`development` / `production`).
- `N8N_WEBHOOK_URL`: URL del webhook en n8n Cloud.
- `GOOGLE_MAPS_API_KEY`: API Key de Google Maps Platform (Routes API v2).
- `AIRTABLE_PAT`: Personal Access Token de Airtable.
- `AIRTABLE_BASE_ID`: ID de la Base en Airtable.

### 3. Ejecutar en Modo Desarrollo

```bash
npm run dev
```

### 4. Ejecutar en Modo Producción

```bash
npm start
```

---

## 🧮 Fórmula Oficial de Cálculo de Tarifa Sugerida

El backend calcula automáticamente la tarifa base sugerida con la fórmula oficial MOONI:

$$\text{Precio Sugerido} = \$30.00\text{ MXN (Banderazo)} + (\text{Distancia KM} \times \$8.00\text{ MXN}) + (\text{Tiempo Min} \times \$2.00\text{ MXN})$$

---

## 📡 Endpoints Disponibles

### Monitoreo de Salud (`GET`)
`GET /api/v1/webhooks/health`

**Respuesta HTTP 200 OK:**
```json
{
  "status": "UP",
  "timestamp": "2026-09-24T12:00:00.000Z"
}
```

### Solicitud de Viaje (`POST`)
`POST /api/v1/webhooks/solicitud-viaje`

**Body Payload (JSON):**
```json
{
  "telefono_pasajero": "+525512345678",
  "origen_texto": "Av. Reforma 222, CDMX",
  "destino_texto": "Polanco, CDMX",
  "oferta_pasajero": 120.00
}
```

**Respuesta HTTP 200 OK:**
```json
{
  "status": "success",
  "message": "Solicitud de viaje procesada correctamente",
  "data": {
    "telefono_pasajero": "+525512345678",
    "origen_texto": "Av. Reforma 222, CDMX",
    "destino_texto": "Polanco, CDMX",
    "distancia_km": 8.5,
    "tiempo_min": 18,
    "precio_sugerido": 134,
    "oferta_pasajero": 120,
    "estado_viaje": "solicitado"
  }
}
```

---

## ☁️ Despliegue en Servidores en la Nube (Render / Railway)

1. Sube el código a tu repositorio de GitHub.
2. En Render o Railway, crea un nuevo servicio web vinculado a tu repositorio de GitHub.
3. Define la variable de inicio: `npm start`.
4. Agrega las variables de entorno definidas en `.env.example`.
