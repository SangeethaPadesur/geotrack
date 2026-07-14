import { useMemo, useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import type { Driver } from "../hooks/useFleetStream";
import { useFPS } from "../hooks/useFPS";


interface MapControllerProps {
  selectedDriverPosition: [number, number] | null;
  mapCenter: [number, number];
  onBoundsChange: (bounds: L.LatLngBounds) => void;
}

interface FleetMapProps {
  selectedDriverPosition: [number, number] | null;
  activeFilter: "all" | "active" | "idle" | "delayed";
  fleet: Driver[];
  center: [number, number];
}

const MapController = ({ selectedDriverPosition, mapCenter, onBoundsChange }: MapControllerProps) => {
  const map = useMap();

  useEffect(() => {
    if(mapCenter){
        map.setView(mapCenter, 13);
    }
  }, [mapCenter]);

  useEffect(() => {
    if (selectedDriverPosition) {
      map.flyTo(selectedDriverPosition, 16, { animate: true, duration: 1.5 });
    }
  }, [selectedDriverPosition]);

  useEffect(() => {
    const updateBounds = () => {
      onBoundsChange(map.getBounds());
    };
    
    map.on('moveend', updateBounds);
    map.on('zoomend', updateBounds);
    updateBounds();
    
    return () => {
      map.off('moveend', updateBounds);
      map.off('zoomend', updateBounds);
    };
  }, [map, onBoundsChange]);

  return null;
}


export const Map = ({ selectedDriverPosition, activeFilter, fleet, center }: FleetMapProps) => {
  const fps = useFPS();
  const [bounds, setBounds] = useState<L.LatLngBounds | null>(null);

  const filteredFleet = useMemo(() => {
    let result = fleet;
    if (activeFilter !== "all") {
      result = result.filter((driver) => driver.status === activeFilter);
    }
    if (bounds) {
      result = result.filter((driver) => {
        const lat = driver.position[0];
        const lng = driver.position[1];
        return lat >= bounds.getSouth() && lat <= bounds.getNorth() &&
               lng >= bounds.getWest() && lng <= bounds.getEast();
      });
    }
    return result;
  }, [fleet, activeFilter, bounds]);

  const colorMap = useMemo(() => ({
    active: "#16a34a",
    idle: "#ca8a04",
    delayed: "#dc2626"
  }), []);

  return (
    <div className="relative w-full h-full overflow-hidden bg-slate-100">
      <div className="absolute top-4 right-4 z-[1000] bg-black/80 text-white px-3 py-1 rounded text-xs font-mono">
        {fps} FPS
      </div>
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={true}
        className="w-full h-full"
        preferCanvas={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {filteredFleet.map((driver) => (
          <CircleMarker key={driver.id} center={driver.position} radius={7} pathOptions={{
              fillColor: colorMap[driver.status],
              fillOpacity: 0.9,
              color: "#ffffff", // Pure white outer border line
              weight: 2,
            }}>
            <Popup className="custom-leaflet-popup">
              <div className="p-2 text-slate-900 font-sans">
                <h3 className="font-bold text-sm">{driver.name}</h3>
                <p className="text-xs text-slate-500 capitalize mt-1">Status: {driver.status}</p>
              </div>
            </Popup>
          </CircleMarker>
        ))}

        <MapController selectedDriverPosition={selectedDriverPosition} mapCenter={center} onBoundsChange={setBounds} />
      </MapContainer>
    </div>
  );
}
