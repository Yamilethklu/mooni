'use client';
import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
export default function DemoQr() {
 const [url,setUrl]=useState('https://mooni-ten.vercel.app/');
 const [qr,setQr]=useState('');
 useEffect(()=>{const current=window.location.origin;const target=current.includes('localhost')||current.includes('127.0.0.1')?'https://mooni-ten.vercel.app/':`${current}/`;setUrl(target);QRCode.toDataURL(target,{width:220,margin:2,color:{dark:'#111827',light:'#ffffff'}}).then(setQr).catch(()=>setQr(''));},[]);
 return <div className="bg-gray-900 border border-white/10 rounded-xl p-5 space-y-3"><h3 className="font-bold">Invita a alguien al demo</h3><p className="text-sm text-gray-300">Escanea el QR para abrir MOONI, escribir nombre y teléfono y solicitar un viaje.</p>{qr && <img src={qr} alt="Código QR que abre el demo de MOONI" width={180} height={180} className="rounded bg-white p-2"/>}<a href={url} className="text-emerald-400 underline break-all" target="_blank" rel="noreferrer">{url}</a><p className="text-xs text-amber-300">Es un enlace al sitio, no vincula WhatsApp. Cada dispositivo guarda sus registros por separado; una base compartida es necesaria para verlos todos en un solo panel.</p></div>;
}
