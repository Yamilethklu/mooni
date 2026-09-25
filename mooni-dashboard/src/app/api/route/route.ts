import { NextResponse } from 'next/server';
export async function POST(req: Request) {
 try {
  const {origin,destination}=await req.json();
  if(typeof origin!=='string'||typeof destination!=='string'||!origin.trim()||!destination.trim()||origin.length>250||destination.length>250) return NextResponse.json({error:'Origen y destino válidos son obligatorios.'},{status:400});
  const key=process.env.GOOGLE_MAPS_API_KEY;
  if(!key) return NextResponse.json({error:'Configura GOOGLE_MAPS_API_KEY en Vercel para obtener distancia y tiempo reales.'},{status:503});
  const response=await fetch('https://routes.googleapis.com/directions/v2:computeRoutes',{method:'POST',headers:{'Content-Type':'application/json','X-Goog-Api-Key':key,'X-Goog-FieldMask':'routes.distanceMeters,routes.duration'},body:JSON.stringify({origin:{address:origin},destination:{address:destination},travelMode:'DRIVE',routingPreference:'TRAFFIC_AWARE'})});
  const data=await response.json(); if(!response.ok||!data.routes?.[0]) return NextResponse.json({error:'No se encontró una ruta. Revisa las direcciones y la configuración de Google Routes.'},{status:422});
  const r=data.routes[0];return NextResponse.json({km:Math.round(r.distanceMeters/10)/100,min:Math.ceil(parseFloat(r.duration)/60),source:'Google Routes'});
 }catch{return NextResponse.json({error:'Error al consultar la ruta.'},{status:500})}
}
