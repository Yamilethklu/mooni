import { NextResponse } from 'next/server';
import {db,configured} from '../../../lib/server/supabase-rest';
export async function POST(req:Request){
 if(!configured())return NextResponse.json({error:'Base de datos compartida no configurada'},{status:503});
 try{
  const body=await req.json();
  if(body.type==='passenger'){
   const {id,nombre,telefono}=body;
   if(!/^[a-f0-9-]{8,36}$/i.test(id)||typeof nombre!=='string'||nombre.trim().length<1||nombre.length>100||typeof telefono!=='string'||!/^\+?[0-9 ()-]{8,20}$/.test(telefono))return NextResponse.json({error:'Registro inválido'},{status:400});
   await db('mooni_passengers',{method:'POST',body:JSON.stringify({id,nombre:nombre.trim(),telefono,registrado_at:new Date().toISOString()}),headers:{Prefer:'return=minimal'}});
   return NextResponse.json({ok:true});
  }
  if(body.type==='trip'){
   const {id,pasajeroId,origen,destino,km,min,precioSugerido,oferta,estado,createdAt,accessToken}=body;
   if(!/^[a-f0-9-]{8,36}$/i.test(id)||!documentId(pasajeroId)||!documentId(accessToken)||!short(origen)||!short(destino)||!number(km)||!number(min)||!number(precioSugerido)||!number(oferta)||Math.abs(precioSugerido-(Math.round((30+km*8+min*2)*100)/100))>0.01||estado!=='buscando_conductor')return NextResponse.json({error:'Viaje inválido'},{status:400});
   await db('mooni_trips',{method:'POST',body:JSON.stringify({id,access_token:accessToken,pasajero_id:pasajeroId,origen,destino,km,min,precio_sugerido:precioSugerido,oferta,estado,creado_at:createdAt||new Date().toISOString()}),headers:{Prefer:'return=minimal'}});
   return NextResponse.json({ok:true});
  }
  if(body.type==='update'){
   const {id,accessToken,estado,precioAcordado}=body;
   if(!documentId(id)||!documentId(accessToken)||!['en_camino','en_viaje','finalizado','solicitado'].includes(estado))return NextResponse.json({error:'Actualización inválida'},{status:400});
   const rows=await db(`mooni_trips?select=id,precio_sugerido,oferta,estado&id=eq.${encodeURIComponent(id)}&access_token=eq.${encodeURIComponent(accessToken)}&limit=1`);
   if(!rows?.length)return NextResponse.json({error:'Viaje no encontrado'},{status:404});
   const current=rows[0];
   if(estado==='en_camino' && current.estado!=='buscando_conductor')return NextResponse.json({error:'Estado inválido'},{status:409});
   if(estado==='en_viaje' && current.estado!=='en_camino')return NextResponse.json({error:'Estado inválido'},{status:409});
   if(estado==='finalizado' && current.estado!=='en_viaje')return NextResponse.json({error:'Estado inválido'},{status:409});
   if(estado==='solicitado' && current.estado!=='buscando_conductor')return NextResponse.json({error:'Estado inválido'},{status:409});
   let fields:Record<string,unknown>={estado};
   if(estado==='en_camino'){
    const suggested=Number(current.precio_sugerido),offer=Number(current.oferta);
    const counter=Math.round(suggested*.9*100)/100;
    const valid=(offer>=suggested*.8&&precioAcordado===offer)||(offer<suggested*.8&&precioAcordado===counter);
    if(!valid)return NextResponse.json({error:'Precio inválido'},{status:400});
    fields={...fields,precio_acordado:precioAcordado,conductor:'Ahmed Hassan',vehiculo:'Toyota Corolla',asignado_at:new Date().toISOString()};
   }
   await db(`mooni_trips?id=eq.${encodeURIComponent(id)}&access_token=eq.${encodeURIComponent(accessToken)}`,{method:'PATCH',body:JSON.stringify(fields),headers:{Prefer:'return=minimal'}});
   return NextResponse.json({ok:true});
  }
  return NextResponse.json({error:'Tipo inválido'},{status:400});
 }catch{return NextResponse.json({error:'No se pudo guardar el registro'},{status:502})}
}
function documentId(x:unknown){return typeof x==='string'&&/^[a-f0-9-]{8,36}$/i.test(x)}
function short(x:unknown){return typeof x==='string'&&x.trim().length>0&&x.length<=250}
function number(x:unknown){return typeof x==='number'&&Number.isFinite(x)&&x>=0&&x<=100000}
