'use client';
import { useState } from 'react';
import { Table, ArrowLeft, Activity } from 'lucide-react';
import InteractiveSimulation from '../components/interactive-simulation';
import AirtableModule from '../components/airtable-table';
import N8NCanvasModule from '../components/n8n-canvas';
import WhatsAppModule from '../components/whatsapp-emulator';
import ApiSettingsModule from '../components/api-settings-module';

export default function Home() {
  const [view, setView] = useState<'sim' | 'admin'>('sim');
  const [adminTab, setAdminTab] = useState('table');

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-200">
      <nav className="border-b border-white/10 p-4 flex justify-between items-center bg-[#121212]">
        <div className="flex items-center gap-2 font-bold text-white text-xl">
          <Activity className="text-emerald-500"/> MOONI 🚗
        </div>
        {view === 'sim' ? (
          <button onClick={() => setView('admin')} className="bg-emerald-600 px-4 py-2 rounded text-sm flex items-center gap-2">
            <Table size={16}/> Ir al Panel de Control
          </button>
        ) : (
          <button onClick={() => setView('sim')} className="bg-gray-700 px-4 py-2 rounded text-sm flex items-center gap-2">
            <ArrowLeft size={16}/> Volver a la Simulación
          </button>
        )}
      </nav>

      <main className="p-8">
        {view === 'sim' ? (
          <InteractiveSimulation />
        ) : (
          <div className="space-y-6">
             <div className="flex gap-4 border-b border-white/10 pb-4">
                {['table', 'flow', 'chat', 'settings'].map(t => (
                  <button key={t} onClick={() => setAdminTab(t)} className={`capitalize ${adminTab === t ? 'text-emerald-400' : 'text-gray-400'}`}>{t}</button>
                ))}
             </div>
             {adminTab === 'table' && <AirtableModule />}
             {adminTab === 'flow' && <N8NCanvasModule />}
             {adminTab === 'chat' && <WhatsAppModule />}
             {adminTab === 'settings' && <ApiSettingsModule />}
          </div>
        )}
      </main>
    </div>
  );
}
