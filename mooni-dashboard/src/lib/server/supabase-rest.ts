import 'server-only';
export function configured() { return !!(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY); }
export async function db(path: string, init: RequestInit = {}) {
 const url=process.env.SUPABASE_URL;const key=process.env.SUPABASE_SERVICE_ROLE_KEY;
 if(!url||!key) throw new Error('Supabase no configurado');
 const res=await fetch(`${url.replace(/\/$/,'')}/rest/v1/${path}`,{...init,headers:{apikey:key,Authorization:`Bearer ${key}`,'Content-Type':'application/json',...init.headers},cache:'no-store'});
 if(!res.ok) throw new Error(`Error de base de datos (${res.status})`);
 if(res.status===204)return null;
 return res.json();
}
