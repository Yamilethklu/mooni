// Nodo 3: Code Node (JavaScript) - Cálculo de tarifa dinámica
// Configuración de tarifas (ajusta según tu mercado)
const TARIFA_BASE = 15;          // Banderazo / tarifa mínima (MXN)
const COSTO_POR_KM = 8;          // Costo por kilómetro (MXN)
const COSTO_POR_MIN = 1.5;       // Costo por minuto (MXN)
const TARIFA_MINIMA = 25;        // Precio mínimo del viaje

// Datos de entrada del webhook
const input = $input.first().json;
const origen = input.body?.origen || input.origen;
const destino = input.body?.destino || input.destino;
const telefono = input.body?.telefono || input.telefono;

// Respuesta de Google Maps Distance Matrix
const mapsResponse = input.mapsData || input;

let distancia_km = 0;
let tiempo_min = 0;

if (
  mapsResponse.rows &&
  mapsResponse.rows[0]?.elements?.[0]?.status === 'OK'
) {
  const elemento = mapsResponse.rows[0].elements[0];
  distancia_km = +(elemento.distance.value / 1000).toFixed(2);
  tiempo_min = Math.ceil(elemento.duration.value / 60);
} else {
  throw new Error('No se pudo calcular la ruta con Google Maps');
}

// Fórmula de tarifa
const precio_calculado =
  TARIFA_BASE + (distancia_km * COSTO_POR_KM) + (tiempo_min * COSTO_POR_MIN);
const precio_sugerido = Math.max(precio_calculado, TARIFA_MINIMA);

// Redondear a múltiplos de 5 para facilitar negociación
const precio_final = Math.ceil(precio_sugerido / 5) * 5;

return [
  {
    json: {
      telefono,
      origen,
      destino,
      distancia_km,
      tiempo_min,
      precio_sugerido: precio_final,
      timestamp: new Date().toISOString(),
    },
  },
];