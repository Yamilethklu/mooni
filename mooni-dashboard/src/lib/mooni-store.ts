export interface Viaje {
  id: string;
  telefono: string;
  origen: string;
  destino: string;
  km: number;
  min: number;
  precioSugerido: number;
  oferta: number;
  estado: 'solicitado' | 'buscando_conductor' | 'asignado' | 'en_camino' | 'en_viaje' | 'finalizado';
}

export const calculateTarifa = (km: number, min: number) => 30 + (km * 8) + (min * 2);
