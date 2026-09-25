'use client';
import {useEffect,useState} from 'react';
export default function LiveMap({estado,origen,destino,asignadoAt}:{estado:string;origen:string;destino:string;asignadoAt?:string}) {
 const [now,setNow]=useState(0);
 useEffect(()=>{if (!asignadoAt || !['en_camino','en_viaje'].includes(estado)) return;setNow(Date.now());const id=window.setInterval(()=>setNow(Date.now()),200);return ()=>window.clearInterval(id)},[asignadoAt,estado]);
 const elapsed=asignadoAt && now ? Math.max(0,(now-new Date(asignadoAt).getTime())/1000) : 0;
 const arriving=estado==='en_camino';const riding=estado==='en_viaje';
 const first=Math.min(1,elapsed/30);const second=Math.min(1,Math.max(0,(elapsed-30)/30));
 const x=arriving?350-290*first:riding?60+280*second:estado==='finalizado'?340:350;
 const y=arriving?210+10*first:riding?220-155*second:estado==='finalizado'?65:210;
 const moving=arriving||riding||estado==='finalizado';
 return <div className="relative h-80 bg-[#101b29] rounded-xl overflow-hidden border border-white/10" role="img" aria-label={`Mapa ilustrativo: ${estado}`}><div className="absolute inset-0 opacity-30" style={{backgroundImage:'linear-gradient(30deg,transparent 47%,#375774 48%,#375774 50%,transparent 51%),linear-gradient(140deg,transparent 47%,#375774 48%,#375774 50%,transparent 51%)',backgroundSize:'85px 70px'}}/><svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300" preserveAspectRatio="none"><path d="M350 210 L60 220 L340 65" stroke="#fbbf24" strokeWidth="5" fill="none" strokeDasharray="10 6"/><circle cx="60" cy="220" r="13" fill="#047857"/><circle cx="340" cy="65" r="13" fill="#d97706"/>{moving&&<text x={x} y={y-12} textAnchor="middle" fontSize="27">🚕</text>}<text x="60" y="225" fill="white" fontSize="12" textAnchor="middle">A</text><text x="340" y="69" fill="white" fontSize="12" textAnchor="middle">B</text></svg><div className="absolute top-2 left-3 bg-black/75 rounded p-2 text-xs text-amber-300">{arriving?'🚕 Ahmed viene a recogerte':riding?'🚕 Viaje en curso':estado==='finalizado'?'✅ Viaje finalizado':'🚕 Esperando asignación'}</div><div className="absolute bottom-2 left-3 right-3 bg-black/75 rounded p-2 text-xs">{origen||'Origen'} → {destino||'Destino'} · {estado.replaceAll('_',' ')}</div></div>;
}
