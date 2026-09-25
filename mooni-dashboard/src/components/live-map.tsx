'use client';
import { useState, useEffect } from 'react';
import { useMooniStore } from '../lib/mooni-store';

export default function LiveMap({ estado }: { estado: string }) {
  const [position, setPosition] = useState({ x: 10, y: 10 });

  useEffect(() => {
    if (estado === 'en_camino') {
      const interval = setInterval(() => {
        setPosition(prev => ({ x: prev.x + 1, y: prev.y + 0.5 }));
      }, 100);
      return () => clearInterval(interval);
    }
  }, [estado]);

  return (
    <div className="relative w-full h-64 bg-gray-950 rounded-xl overflow-hidden border border-white/10">
      <div className="absolute top-2 left-2 text-xs text-emerald-400">Mapa en vivo: {estado}</div>
      <div className="absolute transition-all duration-100 ease-linear" style={{ left: `${position.x}%`, top: `${position.y}%` }}>
        <div className="text-2xl">🚗</div>
      </div>
    </div>
  );
}
