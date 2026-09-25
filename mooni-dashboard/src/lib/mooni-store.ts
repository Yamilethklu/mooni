'use client';
import { useSyncExternalStore } from 'react';

export type Estado = 'solicitado' | 'buscando_conductor' | 'asignado' | 'en_camino' | 'en_viaje' | 'finalizado';
export interface Viaje { nombrePasajero?: string; conductor?: string; vehiculo?: string; precioAcordado?: number; asignadoAt?: string; id: string; pasajero: string; origen: string; destino: string; km: number; min: number; precioSugerido: number; oferta: number; estado: Estado; createdAt: string; }
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
export function actualizarEstado(id: string, estado: Estado) { viajes = viajes.map(v => v.id === id ? { ...v, estado, ...(estado === 'asignado' || estado === 'en_camino' ? { asignadoAt: v.asignadoAt || new Date().toISOString(), conductor: v.conductor || CONDUCTOR.nombre, vehiculo: v.vehiculo || CONDUCTOR.vehiculo } : {}) } : v); save(); }
export function asignarConductor(id: string, precio: number) { viajes = viajes.map(v => v.id === id ? { ...v, conductor: CONDUCTOR.nombre, vehiculo: CONDUCTOR.vehiculo, precioAcordado: precio, estado: 'en_camino' as Estado, asignadoAt: new Date().toISOString() } : v); save(); }
export const CONDUCTOR = { nombre: 'Ahmed Hassan', vehiculo: 'Toyota Corolla', placa: 'MNI-204', calificacion: '4.9 ★' } as const;
export const calculateTarifa = (km: number, min: number) => Math.round((30 + km * 8 + min * 2) * 100) / 100;
export const estados: Estado[] = ['solicitado', 'buscando_conductor', 'asignado', 'en_camino', 'en_viaje', 'finalizado'];

export interface Pasajero { id: string; nombre: string; telefono: string; registradoAt: string; }
const PASSENGERS_KEY = 'mooni-pasajeros-v1';
const EMPTY_PASSENGERS: Pasajero[] = [];
let pasajeros: Pasajero[] = EMPTY_PASSENGERS;
let passengersLoaded = false;
const passengerListeners = new Set<() => void>();
export function usePasajeros() { return useSyncExternalStore(fn => { passengerListeners.add(fn); if (!passengersLoaded && typeof window !== 'undefined') { passengersLoaded = true; try { const data=JSON.parse(localStorage.getItem(PASSENGERS_KEY)||'[]'); pasajeros=Array.isArray(data)?data:[]; } catch { pasajeros=[]; } queueMicrotask(()=>passengerListeners.forEach(listener=>listener())); } return ()=>{passengerListeners.delete(fn)}; }, ()=>pasajeros, ()=>EMPTY_PASSENGERS); }
export function registrarPasajero(nombre: string, telefono: string) { const p:Pasajero={id:crypto.randomUUID().slice(0,8).toUpperCase(),nombre,telefono,registradoAt:new Date().toISOString()}; pasajeros=[p,...pasajeros];localStorage.setItem(PASSENGERS_KEY,JSON.stringify(pasajeros));passengerListeners.forEach(fn=>fn());return p; }
