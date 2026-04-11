import React, { useEffect } from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from "react-leaflet";
import { useAtom, useSetAtom } from "jotai";
import {
  municipiosGeoJsonAtom,
  estadoGeoJsonAtom,
  isGeoDataLoadedAtom,
} from "../store/mapAtoms";
import { config } from "../config";

function MapController() {
  const setMunicipios = useSetAtom(municipiosGeoJsonAtom);
  const setEstado = useSetAtom(estadoGeoJsonAtom);

  useEffect(() => {
    // Função para carregar os dados
    const loadGeoData = async () => {
      try {
        const [resMunicipios, resEstado] = await Promise.all([
          fetch("./geojson-municipios-rs.json"),
          fetch("./geojson-estado-rs.json"),
        ]);

        const municipiosData = await resMunicipios.json();
        const estadoData = await resEstado.json();

        setMunicipios(municipiosData);
        setEstado(estadoData);
        console.log("GeoJSONs carregados globalmente via Jotai");
      } catch (error) {
        console.error("Erro ao carregar GeoJSONs:", error);
      }
    };

    loadGeoData();
  }, [setMunicipios, setEstado]);

  return null; // Este componente apenas gerencia dados
}

export const MapaRS = (props) => {
  const [municipiosData] = useAtom(municipiosGeoJsonAtom);
  const [estadoData] = useAtom(estadoGeoJsonAtom);
  const [isLoaded] = useAtom(isGeoDataLoadedAtom);

  const styles = {
    estadoMarker: {
      weight: 1,
      opacity: 0.5,
      fillOpacity: 0.5,
      color: "white",
    },
    municipioMarker: {
      weight: 1,
      opacity: 0.5,
      fillOpacity: 0.5,
      color: "orange",
    },
  };

  const onEachMunicipio = (municipio, layer) => {
    const nome = municipio.properties.name;

    // Bind do Tooltip (Rótulo)
    layer.bindTooltip(nome, { sticky: false });

    // Eventos de interação
    layer.on({
      mouseover: (e) => {
        const l = e.target;
        l.setStyle({
          ...styles.municipioMarker,
          weight: styles.municipioMarker.weight * 2,
          opacity: styles.municipioMarker.opacity * 2,
          fillOpacity: styles.municipioMarker.fillOpacity * 2,
        });
        console.log("Entrou em:", nome);
      },
      mouseout: (e) => {
        const l = e.target;
        l.setStyle({ ...styles.municipioMarker });
        console.log("Saiu de:", nome);
      },
      click: () => {
        console.log("Clicou em:", nome);
      },
    });
  };

  return (
    // lat, long do RS:
    <MapContainer
      center={config.coordenadasRS}
      zoom={7}
      scrollWheelZoom={true}
      style={{ height: "100vh", width: "100vw" }}
    >
      <MapController />
      {/* <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />*/}

      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />

      {isLoaded && (
        <>
          <GeoJSON data={estadoData} style={styles.estadoMarker} />
          <GeoJSON
            data={municipiosData}
            style={styles.municipioMarker}
            onEachFeature={onEachMunicipio}
          />
        </>
      )}
    </MapContainer>
  );
};
