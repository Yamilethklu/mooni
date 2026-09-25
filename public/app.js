async function solicitar() {
    const data = {
        telefono_pasajero: document.getElementById('tel').value,
        origen_texto: document.getElementById('orig').value,
        destino_texto: document.getElementById('dest').value,
        oferta_pasajero: document.getElementById('oferta').value
    };
    
    // UI Feedback
    const nodes = document.querySelectorAll('.node');
    nodes.forEach(n => n.className = 'node');

    nodes[0].className = 'node active';
    const res = await fetch('/api/v1/webhooks/solicitud-viaje', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });
    
    nodes[0].className = 'node success';
    nodes[1].className = 'node success';
    nodes[2].className = 'node success';
    nodes[3].className = 'node success';
    
    document.getElementById('console').innerText = JSON.stringify(await res.json(), null, 2);
    cargarViajes();
}

async function cargarViajes() {
    const res = await fetch('/api/v1/webhooks/viajes');
    const data = await res.json();
    const body = document.getElementById('viajes-body');
    body.innerHTML = data.map(v => `
        <tr>
            <td>${v.id}</td>
            <td>${v.telefono_pasajero}</td>
            <td>${v.distancia_km}</td>
            <td>$${v.precio_sugerido}</td>
            <td>${v.estado}</td>
            <td><button onclick="cambiarEstado('${v.id}')">Next</button></td>
        </tr>
    `).join('');
}

async function cambiarEstado(id) {
    await fetch(`/api/v1/webhooks/viajes/${id}/estado`, { method: 'PATCH' });
    cargarViajes();
}

cargarViajes();
