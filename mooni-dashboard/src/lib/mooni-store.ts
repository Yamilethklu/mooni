'use client';
import { useSyncExternalStore } from 'react';

export type Estado = 'solicitado' | 'buscando_conductor' | 'asignado' | 'en_camino' | 'en_viaje' | 'finalizado';
export interface Viaje { id: string; pasajero: string; origen: string; destino: string; km: number; min: number; precioSugerido: number; oferta: number; estado: Estado; createdAt: string; }
const KEY = 'mooni-viajes-v1';
const EMPTY: Viaje[] = [];
let viajes: Viaje[] = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();
function emit() { listeners.forEach(fn => fn()); }
function init() {
  if (loaded || typeof window === 'undefined') return;
  loaded = true;
  try { const raw = JSON.parse(localStorage.getItem(KEY) || '[]'); viajes = Array.isArray(raw) ? raw : []; } catch { viajes = []; }
  emit();
}
function save() { localStorage.setItem(KEY, JSON.stringify(viajes)); emit(); }
export function useViajes() { return useSyncExternalStore(fn => { listeners.add(fn); init(); return () => { listeners.delete(fn); }; }, () => viajes, () => EMPTY); }
export function agregarViaje(v: Viaje) { viajes = [v, ...viajes]; save(); }
export function actualizarEstado(id: string, estado: Estado) { viajes = viajes.map(v => v.id === id ? { ...v, estado } : v); save(); }
export const calculateTarifa = (km: number, min: number) => Math.round((30 + km * 8 + min * 2) * 100) / 100;
export const estados: Estado[] = ['solicitado', 'buscando_conductor', 'asignado', 'en_camino', 'en_viaje', 'finalizado'];
