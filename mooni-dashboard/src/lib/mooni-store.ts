import { create } from 'zustand';

export interface Viaje {
  id: string;
  pasajero: string;
  origen: string;
  destino: string;
  km: number;
  min: number;
  precioSugerido: number;
  oferta: number;
  estado: 'solicitado' | 'buscando_conductor' | 'asignado' | 'en_camino' | 'en_viaje' | 'finalizado';
}

interface MooniStore {
  viajes: Viaje[];
  agregarViaje: (viaje: Viaje) => void;
  actualizarEstado: (id: string, estado: Viaje['estado']) => void;
}

export const useMooniStore = create<MooniStore>((set) => ({
  viajes: [],
  agregarViaje: (viaje) => set((state) => ({ viajes: [...state.viajes, viaje] })),
  actualizarEstado: (id, estado) => set((state) => ({
    viajes: state.viajes.map(v => v.id === id ? { ...v, estado } : v)
  })),
}));

export const calculateTarifa = (km: number, min: number) => 30 + (km * 8) + (min * 2);
