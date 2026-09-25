'use client';
import { useMooniStore } from '../lib/mooni-store';

export default function InteractiveSimulation() {
  const viajes = useMooniStore(s => s.viajes);
  return (
    <div className="grid grid-cols-2 gap-8">
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Simulador de Viaje</h2>
        <div className="bg-gray-900 p-6 rounded-2xl border border-white/5">
          {/* Aquí se llamarían los componentes importados */}
          {viajes.length === 0 ? <p>Inicia una conversación...</p> : <p>Viaje activo: {viajes[0].estado}</p>}
        </div>
      </div>
      <div>
        <h2 className="text-xl font-bold mb-4">Registro en vivo</h2>
        <table className="w-full bg-gray-900 text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th>ID</th><th>Estado</th><th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {viajes.map(v => (
              <tr key={v.id}>
                <td>{v.id}</td><td>{v.estado}</td>
                <td><button className="bg-emerald-600 px-2 py-1 text-xs">Avanzar</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
