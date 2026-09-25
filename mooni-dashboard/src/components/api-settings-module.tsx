'use client';
export default function ApiSettingsModule() {
  return (
    <div className="p-6 bg-gray-900 rounded-xl border border-white/10 text-white">
      <h2 className="text-xl font-bold mb-4">Configuración de APIs</h2>
      <div className="space-y-4">
        <input className="w-full p-2 bg-black border border-gray-700 rounded" placeholder="GOOGLE_MAPS_API_KEY" />
        <input className="w-full p-2 bg-black border border-gray-700 rounded" placeholder="WHATSAPP_TOKEN" />
        <button className="bg-emerald-600 px-4 py-2 rounded">Guardar y Testear</button>
      </div>
    </div>
  );
}
