'use client';
import { useState } from 'react';

export default function AirtableTable() {
  const [viajes] = useState([
    { id: '1', tel: '551234', origen: 'Casa', destino: 'Oficina', km: 5, min: 10, precio: 100, oferta: 90, estado: 'solicitado' }
  ]);

  return (
    <table className="w-full text-white border-collapse">
      <thead>
        <tr className="bg-gray-800">
          <th>ID</th><th>Tel</th><th>KM</th><th>Estado</th>
        </tr>
      </thead>
      <tbody>
        {viajes.map(v => (
          <tr key={v.id} className="border-b border-gray-700">
            <td>{v.id}</td><td>{v.tel}</td><td>{v.km}</td><td>{v.estado}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
