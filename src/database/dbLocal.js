const fs = require('fs');
const path = require('path');
const DB_PATH = path.join(__dirname, '../../viajes.json');

const leerDB = () => {
    if (!fs.existsSync(DB_PATH)) return [];
    try {
        const data = fs.readFileSync(DB_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (e) {
        return [];
    }
};

const guardarViaje = (datos) => {
    const db = leerDB();
    const nuevoViaje = { 
        id: 'VIAJE-' + Date.now(), 
        ...datos, 
        estado: 'solicitado', 
        createdAt: new Date().toISOString() 
    };
    db.push(nuevoViaje);
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
    return nuevoViaje;
};

const actualizarEstado = (id, nuevoEstado) => {
    const db = leerDB();
    const index = db.findIndex(v => v.id === id);
    if (index !== -1) {
        db[index].estado = nuevoEstado;
        fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
        return db[index];
    }
    return null;
};

module.exports = { leerDB, guardarViaje, actualizarEstado };
