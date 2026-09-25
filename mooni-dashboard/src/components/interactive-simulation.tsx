'use client';
import { useEffect, useState } from 'react';
import { agregarViaje, asignarConductor, calculateTarifa, useViajes, actualizarEstado, estados, Viaje, CONDUCTOR, registrarPasajero } from '../lib/mooni-store';
import LiveMap from './live-map';
import DemoQr from './demo-qr';

type Route = { km: number; min: number; source: string };
export default function InteractiveSimulation() {
  const viajes = useViajes();
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [phone, setPhone] = useState('');
  const [passengerId, setPassengerId] = useState('');
  const [sharedStatus, setSharedStatus] = useState('');
  const [offer, setOffer] = useState('');
  const [input, setInput] = useState('');
  const [route, setRoute] = useState<Route | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [driverMessage, setDriverMessage] = useState('');
  const [counter, setCounter] = useState<number | null>(null);
  const active = viajes.find(v => v.id === currentId) || viajes[0];

  useEffect(() => {
    if (!active?.asignadoAt || !['en_camino','en_viaje'].includes(active.estado)) return;
    const id = window.setInterval(() => {
      const elapsed = Date.now() - new Date(active.asignadoAt!).getTime();
      if (active.estado === 'en_camino' && elapsed >= 30000) {actualizarEstado(active.id, 'en_viaje');persist({type:'update',id:active.id,accessToken:active.accessToken,estado:'en_viaje'});}
      if (active.estado === 'en_viaje' && elapsed >= 60000) {actualizarEstado(active.id, 'finalizado');persist({type:'update',id:active.id,accessToken:active.accessToken,estado:'finalizado'});}
    }, 1000);
    return () => window.clearInterval(id);
  }, [active?.id, active?.estado, active?.asignadoAt]);

  async function submit() {
    const value = input.trim(); if (!value || busy) return;
    setError('');
    if (step === 0) { setName(value); setStep(1); setInput(''); return; }
    if (step === 1) { if (!/^\+?[0-9 ()-]{8,20}$/.test(value)) { setError('Escribe un teléfono válido de 8 a 20 caracteres.'); return; } setPhone(value); const passenger=registrarPasajero(name,value);setPassengerId(passenger.id);persist({type:'passenger',...passenger}); setStep(2); setInput(''); return; }
    if (step === 2) { setOrigin(value); setStep(3); setInput(''); return; }
    if (step === 3) {
      setBusy(true);
      try {
        const res = await fetch('/api/route', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({origin,destination:value}) });
        const data = await res.json();
        if (res.status === 503) { setRoute({km:5,min:10,source:'estimación de demostración; no es distancia real'}); setDestination(value); setStep(4); setInput(''); return; }
        if (!res.ok) throw new Error(data.error || 'No se pudo calcular la ruta');
        setRoute(data); setDestination(value); setStep(4); setInput('');
      } catch (e) { setError(e instanceof Error ? e.message : 'Error de ruta'); }
      finally { setBusy(false); } return;
    }
    const n = Number(value); if (!Number.isFinite(n) || n <= 0 || n > 100000) { setError('Escribe una oferta válida en MXN.'); return; }
    setOffer(value); setInput(''); setStep(5);
  }
  async function requestRide(amount: number) {
    if (!route) return;
    const v: Viaje = { accessToken:crypto.randomUUID(), pasajeroId:passengerId, nombrePasajero:name, id:crypto.randomUUID().slice(0,8).toUpperCase(), pasajero:phone, origen:origin, destino:destination, km:route.km, min:route.min, precioSugerido:calculateTarifa(route.km,route.min), oferta:amount, estado:'buscando_conductor', createdAt:new Date().toISOString() };
    agregarViaje(v); setCurrentId(v.id); setStep(6);await persist({type:'trip',id:v.id,accessToken:v.accessToken,pasajeroId:v.pasajeroId,origen:v.origen,destino:v.destino,km:v.km,min:v.min,precioSugerido:v.precioSugerido,oferta:v.oferta,estado:v.estado,createdAt:v.createdAt});
    const suggested = v.precioSugerido;
    window.setTimeout(() => {
      if (amount >= suggested * .8) {
        setDriverMessage(`Ahmed: ¡Hola! Acepto tu oferta de $${amount.toFixed(2)} MXN. Voy por ti.`);
        asignarConductor(v.id, amount);persist({type:'update',id:v.id,accessToken:v.accessToken,estado:'en_camino',precioAcordado:amount});
      } else {
        const proposal = Math.round(suggested * .9 * 100) / 100;
        setCounter(proposal);
        setDriverMessage(`Ahmed: Gracias por tu oferta de $${amount.toFixed(2)}. Puedo llevarte por $${proposal.toFixed(2)} MXN. ¿Aceptas?`);
      }
    }, 1200);
  }
  function acceptCounter() {
    if (!active || counter === null) return;
    asignarConductor(active.id, counter);persist({type:'update',id:active.id,accessToken:active.accessToken,estado:'en_camino',precioAcordado:counter});
    setDriverMessage(`Tú: Acepto $${counter.toFixed(2)} MXN. Ahmed: ¡Perfecto, voy por ti!`);
    setCounter(null);
  }
  async function persist(payload:Record<string,unknown>) { try {const res=await fetch('/api/registry',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});setSharedStatus(res.ok?'Registro compartido activo':'Registro local: base compartida pendiente');}catch{setSharedStatus('Registro local: no hay conexión con la base compartida');} }
  function reset() {
    setStep(0); setName(''); setOrigin(''); setDestination(''); setRoute(null); setPhone(''); setPassengerId(''); setOffer(''); setCurrentId(null); setCounter(null); setDriverMessage('');
  }
  return <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
    <section className="space-y-5"><h1 className="text-3xl font-bold">Pide tu viaje 🚗</h1><p className="text-gray-400">Cotiza y negocia tu precio con un conductor ficticio.</p>
      <div className="bg-gray-900 rounded-2xl p-6 space-y-4 border border-white/10">
        <div className="rounded-xl bg-gray-800 p-4 text-sm">MOONI: {['¿Cuál es tu nombre?','¿Cuál es tu teléfono?','¿Dónde te recogemos?','¿A dónde vas?','¿Cuánto ofreces en MXN?','Revisa tu cotización.','Estamos buscando conductor...'][step]}</div>
        {name && <p>👤 {name} · {phone || 'Teléfono pendiente'}</p>}{origin && <p>📍 {origin}</p>}{destination && <p>🏁 {destination}</p>}
        {route && <p className="text-emerald-400">{route.km} km · {route.min} min · Tarifa sugerida ${calculateTarifa(route.km,route.min).toFixed(2)} MXN <span className="text-xs text-gray-400">({route.source})</span></p>}
        {step < 5 && <div className="flex gap-2"><input aria-label="Respuesta" className="flex-1 min-w-0 bg-black border border-gray-700 rounded p-3" value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&submit()} placeholder={['Tu nombre','Teléfono','Origen','Destino','Oferta MXN'][step]}/><button disabled={busy} onClick={submit} className="bg-emerald-600 rounded px-4 disabled:opacity-50">{busy?'Calculando':'Enviar'}</button></div>}
        {sharedStatus && <p className="text-xs text-amber-300">{sharedStatus}</p>}{error && <p role="alert" className="text-red-400">{error}</p>}
        {step===5 && <div className="space-y-3"><p>Tu oferta: ${Number(offer).toFixed(2)} MXN</p><div className="flex flex-wrap gap-3"><button onClick={()=>requestRide(route ? calculateTarifa(route.km,route.min) : 0)} className="bg-emerald-600 px-4 py-2 rounded">Aceptar tarifa sugerida</button><button onClick={()=>requestRide(Number(offer))} className="bg-amber-500 text-black px-4 py-2 rounded">Enviar mi oferta al conductor</button></div></div>}
        {step===6 && <div className="space-y-3"><div aria-live="polite" className="bg-gray-800 p-4 rounded-xl">{driverMessage || 'Buscando a Ahmed Hassan...'}</div>{counter!==null && <div className="flex flex-wrap gap-3"><button onClick={acceptCounter} className="bg-emerald-600 px-4 py-2 rounded">Aceptar ${counter.toFixed(2)}</button><button onClick={()=>{setCounter(null);setDriverMessage('Tú: Prefiero mi oferta original. La negociación terminó.');if(active){actualizarEstado(active.id,'solicitado');persist({type:'update',id:active.id,accessToken:active.accessToken,estado:'solicitado'});}}} className="bg-gray-700 px-4 py-2 rounded">Rechazar</button></div>}<button onClick={reset} className="underline text-emerald-400">Solicitar otro viaje</button></div>}
      </div>
      {active && <div className="bg-gray-900 rounded-xl p-5 border border-white/10"><h2 className="font-bold">Viaje {active.id} · {active.estado.replaceAll('_',' ')}</h2>{active.conductor && <p className="text-gray-300">Conductor asignado: {active.conductor} · {active.vehiculo} · {CONDUCTOR.placa} · {CONDUCTOR.calificacion}</p>}<p className="text-sm">Cliente: {active.nombrePasajero || 'Sin nombre'} · {active.pasajero} · Oferta ${active.oferta.toFixed(2)} · {active.precioAcordado!==undefined?`Acordado $${active.precioAcordado.toFixed(2)}`:'En negociación'} MXN</p>{active.conductor && active.estado!=='finalizado' && <button className="mt-3 text-sm underline" onClick={()=>actualizarEstado(active.id,estados[Math.min(estados.indexOf(active.estado)+1,5)])}>Avanzar estado (demo)</button>}</div>}
    </section><section className="space-y-4"><h2 className="text-xl font-bold">Llegada del conductor y trayecto</h2><LiveMap estado={active?.estado||'solicitado'} origen={active?.origen||origin} destino={active?.destino||destination} asignadoAt={active?.asignadoAt}/><p className="text-xs text-gray-400">La ruta y el automóvil son ilustrativos. Ahmed Hassan es ficticio.</p><DemoQr /></section>
  </div>;
}
