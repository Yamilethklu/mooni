import { NextResponse } from 'next/server';
import { timingSafeEqual } from 'node:crypto';
import {db,configured} from '../../../../lib/server/supabase-rest';
export async function GET(req:Request){
 const expected=process.env.MOONI_ADMIN_PASSWORD;
 if(!configured()||!expected)return NextResponse.json({error:'Panel compartido no configurado'},{status:503});
 const got=req.headers.get('x-mooni-admin-password')||'';
 const a=Buffer.from(got),b=Buffer.from(expected);
 if(a.length!==b.length||!timingSafeEqual(a,b))return NextResponse.json({error:'Clave incorrecta'},{status:401});
 try{
  const [passengers,trips]=await Promise.all([db('mooni_passengers?select=id,nombre,telefono,registrado_at&order=registrado_at.desc&limit=200'),db('mooni_trips?select=id,pasajero_id,origen,destino,conductor,estado,precio_acordado,creado_at&order=creado_at.desc&limit=200')]);
  return NextResponse.json({passengers,trips},{headers:{'Cache-Control':'private, no-store'}});
 }catch{return NextResponse.json({error:'Error al consultar la base'},{status:502})}
}
