'use client';
import { useState } from 'react';
import { Table, Workflow, Bot, Settings, Activity } from 'lucide-react';

// Componentes modulares
const AirtableModule = () => <div className="p-4 border border-white/10 rounded-lg">Tabla de Control estilo Airtable</div>;
const N8NCanvasModule = () => <div className="p-4 border border-white/10 rounded-lg">Canvas de Flujo n8n</div>;
const WhatsAppModule = () => <div className="p-4 border border-white/10 rounded-lg">Emulador WhatsApp & QR</div>;
const ApiSettingsModule = () => <div className="p-4 border border-white/10 rounded-lg">Configuración de APIs</div>;

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('table');

  const tabs = [
    { id: 'table', name: 'Airtable', icon: <Table size={18}/> },
    { id: 'flow', name: 'n8n Flow', icon: <Workflow size={18}/> },
    { id: 'chat', name: 'WhatsApp', icon: <Bot size={18}/> },
    { id: 'settings', name: 'Config', icon: <Settings size={18}/> }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-200 p-8">
      <header className="mb-8 border-b border-white/10 pb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2"><Activity className="text-emerald-500"/> MOONI SaaS Dashboard</h1>
        <div className="flex gap-2">
          {tabs.map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-md flex items-center gap-2 transition ${activeTab === tab.id ? 'bg-white/10 text-white' : 'hover:bg-white/5'}`}
            >
              {tab.icon} {tab.name}
            </button>
          ))}
        </div>
      </header>

      <main className="bg-[#121212] border border-white/10 rounded-xl p-6 min-h-[500px]">
        {activeTab === 'table' && <AirtableModule />}
        {activeTab === 'flow' && <N8NCanvasModule />}
        {activeTab === 'chat' && <WhatsAppModule />}
        {activeTab === 'settings' && <ApiSettingsModule />}
      </main>
    </div>
  );
}
