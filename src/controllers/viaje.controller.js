const db = require('../database/dbLocal');
const googleService = require('../services/googleRoutes.service');

const procesarSolicitudViaje = async (req, res) => {
    try {
        const { telefono_pasajero, origen_texto, destino_texto, oferta_pasajero } = req.body;
        
        const ruta = await googleService.calcularRuta(origen_texto, destino_texto);
        const precio_sugerido = 30 + (ruta.distancia_km * 8) + (ruta.tiempo_min * 2);

        const nuevoViaje = db.guardarViaje({
            telefono_pasajero,
            origen_texto,
            destino_texto,
            distancia_km: ruta.distancia_km,
            tiempo_min: ruta.tiempo_min,
            precio_sugerido: parseFloat(precio_sugerido.toFixed(2)),
            oferta_pasajero: parseFloat(oferta_pasajero)
        });

        res.status(200).json({ status: 'success', data: nuevoViaje });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

const obtenerViajes = (req, res) => {
    res.json(db.leerDB());
};

const actualizarEstado = (req, res) => {
    const { id } = req.params;
    const estados = ['solicitado', 'buscando_conductor', 'asignado', 'en_camino', 'en_viaje', 'finalizado'];
    const viajeActual = db.leerDB().find(v => v.id === id);
    const index = estados.indexOf(viajeActual.estado);
    const nuevoEstado = estados[(index + 1) % estados.length];
    
    db.actualizarEstado(id, nuevoEstado);
    res.json({ status: 'success', nuevoEstado });
};

module.exports = { procesarSolicitudViaje, obtenerViajes, actualizarEstado };
