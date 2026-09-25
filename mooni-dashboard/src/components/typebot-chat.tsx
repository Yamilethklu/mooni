'use client';
import { useState } from 'react';
import { useMooniStore, calculateTarifa } from '../lib/mooni-store';

export default function TypebotChat() {
  const [step, setStep] = useState(0);
  const [chat, setChat] = useState(['Hola! A dónde vamos?']);
  const agregarViaje = useMooniStore(s => s.agregarViaje);

  const handleInput = (e: any) => {
    if (e.key === 'Enter') {
      const val = e.target.value;
      setChat([...chat, val]);
      if (step === 0) { setStep(1); setChat([...chat, val, 'Cuál es el destino?']); }
      else {
        const precio = calculateTarifa(5, 10);
        agregarViaje({ id: '1', pasajero: 'Yo', origen: 'Casa', destino: val, km: 5, min: 10, precioSugerido: precio, oferta: precio, estado: 'solicitado' });
        setChat([...chat, val, `Precio MOONI: $${precio}. Buscando conductor...`]);
      }
      e.target.value = '';
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <div className="h-40 overflow-y-auto mb-2 text-sm">{chat.map((m, i) => <div key={i} className="mb-1">{m}</div>)}</div>
      <input className="w-full bg-gray-900 p-2" onKeyDown={handleInput} placeholder="Escribe..." />
    </div>
  );
}
