import { useState, useEffect } from 'react';
import { Viaje, calculateTarifa } from '../lib/mooni-store';

export default function WhatsAppEmulator() {
  const [messages, setMessages] = useState([{ type: 'bot', text: '¡Hola! Bienvenido a MOONI 🚗. ¿A dónde vamos hoy? (Escribe origen)' }]);
  const [input, setInput] = useState('');
  const [step, setStep] = useState(0);
  const [tripData, setTripData] = useState<any>({});

  const sendMessage = () => {
    const newMsg = { type: 'user', text: input };
    setMessages([...messages, newMsg]);
    
    setTimeout(() => {
      let botResponse = '';
      if (step === 0) {
        setTripData({ ...tripData, origen: input });
        botResponse = 'Perfecto. ¿Cuál es tu punto de destino?';
        setStep(1);
      } else if (step === 1) {
        setTripData({ ...tripData, destino: input });
        const km = 8.5; // Simulado
        const min = 15; // Simulado
        const precio = calculateTarifa(km, min);
        botResponse = `Ruta calculada: ${km}km, ${min}min. Precio sugerido: $${precio}. ¿Cuánto ofreces?`;
        setTripData({ ...tripData, destino: input, km, min, precioSugerido: precio });
        setStep(2);
      } else {
        botResponse = '¡Viaje asignado a Carlos M. (Nissan Versa)!';
        setStep(3);
      }
      setMessages(prev => [...prev, { type: 'bot', text: botResponse }]);
    }, 1000);
    setInput('');
  };

  return (
    <div className="flex gap-4">
      <div className="w-1/2 p-4 bg-gray-900 rounded-lg">
        <div className="h-64 overflow-y-auto mb-4">
          {messages.map((m, i) => (
            <div key={i} className={`p-2 my-2 rounded ${m.type === 'bot' ? 'bg-gray-700' : 'bg-emerald-600 ml-auto'}`}>{m.text}</div>
          ))}
        </div>
        <input className="w-full p-2 bg-gray-800 text-white" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendMessage()} />
      </div>
      <div className="w-1/2 p-4 border-2 border-dashed border-gray-600 flex items-center justify-center">
        <div className="text-center">
          <div className="w-32 h-32 bg-white mx-auto mb-2">QR Placeholder</div>
          <p>Escanea para vincular WhatsApp</p>
        </div>
      </div>
    </div>
  );
}
