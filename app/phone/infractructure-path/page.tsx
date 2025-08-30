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
    bin: false,
    toilet: false,
    water: false,
    plug: false,
    bench: false,
  });

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    language: 'en',
    region: 'US',
  });

  const mapRef = useRef<google.maps.Map | null>(null);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);

  const [markers, setMarkers] = useState<{
    type: FacilityType;
    position: { lat: number; lng: number };
  }[]>([]);

  const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(null);

  const hashStr = (s: string) => {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  };

  const seeded = (seed: number) => {
    let x = seed >>> 0;
    return () => {
      x ^= x << 13; x >>>= 0;
      x ^= x >> 17; x >>>= 0;
      x ^= x << 5;  x >>>= 0;
      return (x >>> 0) / 4294967296;
    };
  };

  const toNearby = (center: { lat: number; lng: number }, rMeters: number, u: number, v: number) => {
    const w = rMeters * Math.sqrt(u);
    const t = 2 * Math.PI * v;
    const dx = w * Math.cos(t);
    const dy = w * Math.sin(t);
    const dLat = dy / 111320;
    const dLng = dx / (111320 * Math.cos(center.lat * Math.PI / 180));
    return { lat: center.lat + dLat, lng: center.lng + dLng };
  };

  const getFixedNearbyPoints = (center: { lat: number; lng: number }, type: FacilityType, count = 5, radiusMeters = 600) => {
    const seedStr = `${type}:${center.lat.toFixed(4)}:${center.lng.toFixed(4)}:${count}:${radiusMeters}`;
    const rnd = seeded(hashStr(seedStr));
    const res = [] as { lat: number; lng: number }[];
    for (let i = 0; i < count; i++) {
      const u = rnd();
      const v = rnd();
      res.push(toNearby(center, radiusMeters, u, v));
    }
    return res;
  };

  const getRandomNearbyLatLng = (center: { lat: number; lng: number }, radiusMeters = 800) => {
    const r = radiusMeters;
    const u = Math.random();
    const v = Math.random();
    const w = r * Math.sqrt(u);
    const t = 2 * Math.PI * v;
    const dx = w * Math.cos(t);
    const dy = w * Math.sin(t);
    const dLat = dy / 111320;
    const dLng = dx / (111320 * Math.cos(center.lat * Math.PI / 180));
    return { lat: center.lat + dLat, lng: center.lng + dLng };
  };

  const getRandomLandNear = async (center: { lat: number; lng: number }, attempts = 8, radiusMeters = 800): Promise<{ lat: number; lng: number } | null> => {
    const geocoder = geocoderRef.current;
    if (!geocoder) return getRandomNearbyLatLng(center, radiusMeters);
    for (let i = 0; i < attempts; i++) {
      const loc = getRandomNearbyLatLng(center, radiusMeters);
      const ok = await new Promise<boolean>((resolve) => {
        geocoder.geocode({ location: loc }, (results, status) => {
          resolve(status === 'OK' && !!results && results.length > 0);
        });
      });
      if (ok) return loc;
    }
    return null;
  };

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

  const addFixedMarkers = (type: FacilityType, count = 5) => {
    const base = userPos;
    const list: { type: FacilityType; position: { lat: number; lng: number } }[] = [];
    if (base) {
      const pts = getFixedNearbyPoints(base, type, count);
      for (const p of pts) list.push({ type, position: p });
    }
    if (list.length) setMarkers(prev => [...prev, ...list]);
  };

  const clearMarkers = (type: FacilityType) => {
    setMarkers(prev => prev.filter(m => m.type !== type));
  };

  const defaultCenter = { lat: -33.8688, lng: 151.2093 }; // Sydney

  const mapOptions = {
    styles: [
      { featureType: 'poi', stylers: [{ visibility: 'off' }] },
      { featureType: 'poi.school', stylers: [{ visibility: 'off' }] },
      { featureType: 'poi.medical', stylers: [{ visibility: 'off' }] },
      { featureType: 'poi.place_of_worship', stylers: [{ visibility: 'off' }] },
      { featureType: 'poi.business', stylers: [{ visibility: 'off' }] },
      { featureType: 'transit', stylers: [{ visibility: 'off' }] },
      { featureType: 'road.arterial', elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
      { featureType: 'road.local', elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
      { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
    ],
  } as google.maps.MapOptions;

  return (
    <div className="w-screen h-screen pt-13 flex flex-col">
      <div className="fixed right-4 top-24 flex flex-col gap-3 z-[1000]">
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
                    addFixedMarkers(t, 5);
                  } else {
                    clearMarkers(t);
                  }
                  return next;
                });
              }}
              className="relative flex items-center justify-center rounded-full w-14 h-14 shadow-sm transition-transform hover:scale-105"
              aria-label={TYPE_META[t].label}
              title={TYPE_META[t].label}
              style={{
                background: TYPE_META[t].color,
                opacity: 1,
              }}
            >
              <img src={`/icons/${t}.svg`} alt="" className="w-7 h-7 pointer-events-none" />
              {active && (
                <span className="absolute -top-1 -right-1 inline-block w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white" />
              )}
            </button>
          );
        })}
      </div>

      {isLoaded && (
        <GoogleMap
          mapContainerClassName="w-full overflow-hidden flex-grow"
          center={userPos ?? defaultCenter}
          zoom={12}
          options={mapOptions}
          onLoad={(map) => {
            mapRef.current = map;
            geocoderRef.current = new google.maps.Geocoder();
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(
                (pos) => {
                  const p = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                  setUserPos(p);
                  map.panTo(p);
                },
                () => {},
                { enableHighAccuracy: true, maximumAge: 10000, timeout: 10000 }
              );
            }
          }}
        >
          {userPos && (
            <Marker
              position={userPos}
              zIndex={Number.MAX_SAFE_INTEGER}
              icon={{
                url: "/icons/location.svg",
                scaledSize: new google.maps.Size(36, 36),
                anchor: new google.maps.Point(18, 18),
              }}
              options={{
                optimized: false
              }}
            />
          )}
          {markers.map((m, i) => (
            <Marker
              key={`${m.type}-${i}-${m.position.lat.toFixed(5)}-${m.position.lng.toFixed(5)}`}
              position={m.position}
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                fillColor: TYPE_META[m.type].color,
                fillOpacity: 1,
                strokeColor: TYPE_META[m.type].color,
                strokeOpacity: 1,
                strokeWeight: 1,
                scale: 6,
              }}
            />
          ))}
        </GoogleMap>
      )}
    </div>
  );
}