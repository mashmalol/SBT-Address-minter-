import React, { useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { LatLng } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin } from 'lucide-react';

// Fix for default marker icons in react-leaflet
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapSelectorProps {
  onLocationSelect: (lat: number, lng: number) => void;
  selectedLocation?: { lat: number; lng: number };
}

function LocationMarker({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
  const [position, setPosition] = useState<LatLng | null>(null);

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });

  return position === null ? null : <Marker position={position} />;
}

export const MapSelector: React.FC<MapSelectorProps> = ({ onLocationSelect, selectedLocation }) => {
  return (
    <div className="w-full h-[500px] rounded-lg overflow-hidden border-2 border-gray-200 shadow-lg">
      <div className="bg-blue-600 text-white p-3 flex items-center gap-2">
        <MapPin className="w-5 h-5" />
        <h3 className="font-semibold">Select Delivery Location</h3>
      </div>
      
      <MapContainer
        center={selectedLocation || [40.7128, -74.0060]} // Default to New York
        zoom={13}
        className="h-[calc(100%-52px)] w-full"
        style={{ height: 'calc(100% - 52px)' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker onLocationSelect={onLocationSelect} />
        {selectedLocation && <Marker position={[selectedLocation.lat, selectedLocation.lng]} />}
      </MapContainer>
    </div>
  );
};
