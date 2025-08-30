'use client'

import { useState, useRef } from 'react'
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api'

type FacilityType = 'bin' | 'toilet' | 'water' | 'plug' | 'bench'

const TYPE_META: Record<FacilityType, { label: string; color: string }> = {
  bin:    { label: 'Bin',           color: '#16a34a' },
  toilet: { label: 'Toilet',        color: '#2563eb' },
  water:  { label: 'Water Station', color: '#0891b2' },
  plug:   { label: 'Power Plug',    color: '#a855f7' },
  bench:  { label: 'Bench',         color: '#92400e' },
}

export default function FacilityFilter() {
  const [filters, setFilters] = useState<Record<FacilityType, boolean>>({
    bin: true,
    toilet: true,
    water: true,
    plug: true,
    bench: true,
  });

const { isLoaded } = useLoadScript({
  googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
});

  const mapRef = useRef<google.maps.Map | null>(null);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);

  const [markers, setMarkers] = useState<{
    type: FacilityType;
    position: { lat: number; lng: number };
  }[]>([]);

  const getRandomLandLatLng = async (attempts = 8): Promise<{ lat: number; lng: number } | null> => {
    const g = (window as any).google as typeof google;
    const map = mapRef.current;
    const geocoder = geocoderRef.current;
    if (!g || !map || !geocoder) return null;

    const bounds = map.getBounds();
    let sw: google.maps.LatLng, ne: google.maps.LatLng;
    if (bounds) {
      sw = bounds.getSouthWest();
      ne = bounds.getNorthEast();
    } else {
      const c = map.getCenter();
      if (!c) return null;
      sw = new g.maps.LatLng(c.lat() - 0.05, c.lng() - 0.05);
      ne = new g.maps.LatLng(c.lat() + 0.05, c.lng() + 0.05);
    }

    for (let i = 0; i < attempts; i++) {
      const lat = sw.lat() + Math.random() * (ne.lat() - sw.lat());
      const lng = sw.lng() + Math.random() * (ne.lng() - sw.lng());
      const loc = { lat, lng };
      const ok = await new Promise<boolean>((resolve) => {
        geocoder.geocode({ location: loc }, (results, status) => {
          resolve(status === 'OK' && !!results && results.length > 0);
        });
      });
      if (ok) return loc;
    }
    return null;
  };

  const addRandomMarkers = async (type: FacilityType, count = 5) => {
    const newOnes: { type: FacilityType; position: { lat: number; lng: number } }[] = [];
    for (let i = 0; i < count; i++) {
      const loc = await getRandomLandLatLng();
      if (loc) newOnes.push({ type, position: loc });
    }
    if (newOnes.length) setMarkers(prev => [...prev, ...newOnes]);
  };

  const clearMarkers = (type: FacilityType) => {
    setMarkers(prev => prev.filter(m => m.type !== type));
  };

  const defaultCenter = { lat: -33.8688, lng: 151.2093 }; // Sydney

  return (
    <>
      <div className="h-16" />
      <div className="flex flex-wrap gap-2 mb-3" style={{ marginLeft: '20px' }}>
        {(Object.keys(TYPE_META) as FacilityType[]).map((t) => {
          const active = filters[t];
          return (
            <button
              key={t}
              type="button"
              onClick={() => {
                setFilters(s => {
                  const next = { ...s, [t]: !s[t] } as Record<FacilityType, boolean>;
                  if (!s[t]) {
                    addRandomMarkers(t, 5);
                  } else {
                    clearMarkers(t);
                  }
                  return next;
                });
              }}
              className="relative flex items-center justify-center rounded-full w-10 h-10 shadow-sm transition-transform hover:scale-105"
              aria-label={TYPE_META[t].label}
              title={TYPE_META[t].label}
              style={{
                background: TYPE_META[t].color,
                opacity: active ? 1 : 0.35,
              }}
            >
              <img src={`/icons/${t}.svg`} alt="" className="w-5 h-5 pointer-events-none" />
              {active && (
                <span className="absolute -top-1 -right-1 inline-block w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white" />
              )}
            </button>
          );
        })}
      </div>

      {isLoaded && (
        <GoogleMap
          mapContainerClassName="w-full min-h-[60vh] rounded-md overflow-hidden"
          center={defaultCenter}
          zoom={12}
          onLoad={(map) => {
            mapRef.current = map;
            geocoderRef.current = new google.maps.Geocoder();
          }}
        >
          {markers.map((m, i) => (
            <Marker
              key={`${m.type}-${i}-${m.position.lat.toFixed(5)}-${m.position.lng.toFixed(5)}`}
              position={m.position}
              icon={{
                url: `/icons/${m.type}.svg`,
                scaledSize: new google.maps.Size(28, 28),
                anchor: new google.maps.Point(14, 14),
              }}
            />
          ))}
        </GoogleMap>
      )}
    </>
  );
}