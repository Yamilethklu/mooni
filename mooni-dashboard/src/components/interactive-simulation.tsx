'use client';
import { useState } from 'react';
import { agregarViaje, calculateTarifa, useViajes, actualizarEstado, estados, Viaje } from '../lib/mooni-store';
import LiveMap from './live-map';
export default function InteractiveSimulation() {
  const viajes = useViajes();
  const [step, setStep] = useState(0);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [phone, setPhone] = useState('');
  const [offer, setOffer] = useState('');
  const [input, setInput] = useState('');
  const [route, setRoute] = useState<{km:number;min:number;source:string}|null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const active = viajes[0];
  async function submit() {
    const value = input.trim(); if (!value || busy) return;
    setError('');
    if (step === 0) { setOrigin(value); setStep(1); setInput(''); return; }
    if (step === 1) {
      setBusy(true);
      try {
        const res = await fetch('/api/route', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({origin,destination:value}) });
        const data = await res.json();
        if (res.status === 503) { setRoute({km:5,min:10,source:'estimación de demostración; no es distancia real'}); setDestination(value); setStep(2); setInput(''); return; }
        if (!res.ok) throw new Error(data.error || 'No se pudo calcular la ruta');
        setRoute(data); setDestination(value); setStep(2); setInput('');
      } catch (e) { setError(e instanceof Error ? e.message : 'Error de ruta'); }
      finally { setBusy(false); } return;
    }
    if (step === 2) { setPhone(value); setStep(3); setInput(''); return; }
    const n = Number(value); if (!Number.isFinite(n) || n <= 0 || n > 100000) { setError('Escribe una oferta válida en MXN.'); return; }
    setOffer(value); setInput(''); setStep(4);
  }
  function create() {
    if (!route) return;
    const v: Viaje = { id:crypto.randomUUID().slice(0,8).toUpperCase(), pasajero:phone, origen:origin, destino:destination, km:route.km, min:route.min, precioSugerido:calculateTarifa(route.km,route.min), oferta:Number(offer), estado:'solicitado', createdAt:new Date().toISOString() };
    agregarViaje(v); setStep(5);
  }
  return <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
    <section className="space-y-5"><h1 className="text-3xl font-bold">Pide tu viaje 🚗</h1><p className="text-gray-400">Cotiza y propón tu precio en pesos mexicanos.</p>
      <div className="bg-gray-900 rounded-2xl p-6 space-y-4 border border-white/10">
        <div className="rounded-xl bg-gray-800 p-4 text-sm">Hola, soy MOONI. {['¿Dónde te recogemos?','¿A dónde vas?','¿Cuál es tu teléfono?','¿Cuánto ofreces en MXN?','Revisa tu cotización.','Solicitud registrada.'][step]}</div>
        {origin && <p>📍 {origin}</p>}{destination && <p>🏁 {destination}</p>}
        {route && <p className="text-emerald-400">{route.km} km · {route.min} min · Tarifa sugerida ${calculateTarifa(route.km,route.min).toFixed(2)} MXN <span className="text-xs text-gray-400">({route.source})</span></p>}
        {step < 4 && <div className="flex gap-2"><input aria-label="Respuesta" className="flex-1 min-w-0 bg-black border border-gray-700 rounded p-3" value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&submit()} placeholder={['Origen','Destino','Teléfono','Oferta MXN'][step]}/><button disabled={busy} onClick={submit} className="bg-emerald-600 rounded px-4 disabled:opacity-50">{busy?'Calculando':'Enviar'}</button></div>}
        {error && <p role="alert" className="text-red-400">{error}</p>}
        {step===4 && <div className="space-y-3"><p>Tu oferta: ${Number(offer).toFixed(2)} MXN</p><div className="flex gap-3"><button onClick={()=>{createAtSuggested();}} className="bg-emerald-600 px-4 py-2 rounded">Aceptar tarifa sugerida</button><button onClick={create} className="bg-amber-500 text-black px-4 py-2 rounded">Enviar contraoferta</button></div></div>}
        {step===5 && <button onClick={()=>{setStep(0);setOrigin('');setDestination('');setRoute(null);setPhone('');setOffer('');}} className="underline text-emerald-400">Solicitar otro viaje</button>}
      </div>
      {active && <div className="bg-gray-900 rounded-xl p-5 border border-white/10"><h2 className="font-bold">Viaje {active.id} · {active.estado.replaceAll('_',' ')}</h2><p className="text-gray-400">Conductor de demostración: Ahmed Hassan · Toyota Corolla · 4.9 ★</p><p className="text-sm">Oferta ${active.oferta.toFixed(2)} · Tarifa ${active.precioSugerido.toFixed(2)} MXN</p><button className="mt-3 text-sm underline" onClick={()=>actualizarEstado(active.id,estados[Math.min(estados.indexOf(active.estado)+1,5)])}>Avanzar estado (demo)</button></div>}
    </section><section className="space-y-4"><h2 className="text-xl font-bold">Vista del trayecto</h2><LiveMap estado={active?.estado||'solicitado'} origen={active?.origen||origin} destino={active?.destino||destination}/><p className="text-xs text-gray-400">Visualización ilustrativa; la posición del automóvil es simulada.</p></section>
  </div>;
  function createAtSuggested() { if (!route) return; agregarViaje({id:crypto.randomUUID().slice(0,8).toUpperCase(),pasajero:phone,origen:origin,destino:destination,km:route.km,min:route.min,precioSugerido:calculateTarifa(route.km,route.min),oferta:calculateTarifa(route.km,route.min),estado:'solicitado',createdAt:new Date().toISOString()});setStep(5); }
}
