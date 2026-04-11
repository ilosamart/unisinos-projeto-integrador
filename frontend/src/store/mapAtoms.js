import { atom } from "jotai";

// Átomos para armazenar os GeoJSONs
export const municipiosGeoJsonAtom = atom(null);
export const estadoGeoJsonAtom = atom(null);

// Átomo derivado para verificar se tudo foi carregado
export const isGeoDataLoadedAtom = atom(
  (get) =>
    get(municipiosGeoJsonAtom) !== null && get(estadoGeoJsonAtom) !== null,
);
