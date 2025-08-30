'use client'

import { useMemo, useState, useEffect } from 'react'

type FacilityType = 'bin' | 'toilet' | 'water' | 'plug' | 'bench'

type FacilityDetails = {
  venue?: string      // Restaurant/Mall/Station etc
  floor?: string      // Floor/Location
  hours?: string      // Operating hours
  notes?: string
}

type Facility = {
  id: number
  name: string
  type: FacilityType
  x: number
  y: number
  details?: FacilityDetails
}

type Road = {
  id: string
  points: string  // SVG path data
  type: 'main' | 'secondary' | 'pedestrian'
}

const MAP_W = 2000
const MAP_H = 1400

const FACILITIES: Facility[] = [
  // Central Plaza area
  { id: 1,  name: 'Bin - Plaza N',  type: 'bin',    x: 980,  y: 560 },
  {
    id: 2,  name: 'Toilet - Plaza', type: 'toilet', x: 1020, y: 640,
    details: { venue: 'Central Plaza Mall', floor: 'B1 (South Wing)', hours: 'Daily 07:00–23:00' }
  },
  { id: 3,  name: 'Water - Plaza',  type: 'water',  x: 940,  y: 620 },
  { id: 4,  name: 'Plug - Kiosk',   type: 'plug',   x: 1060, y: 600 },

  // Park area
  { id: 5,  name: 'Water - Park',   type: 'water',  x: 620,  y: 360 },
  { id: 6,  name: 'Bin - Park',     type: 'bin',    x: 520,  y: 420 },
  {
    id: 7,  name: 'Toilet - Park',  type: 'toilet', x: 700,  y: 440,
    details: { venue: 'City Park Pavilion', floor: 'Ground (West side)', hours: '06:00–20:00' }
  },

  // Riverside walkway
  { id: 8,  name: 'Water - Riverside', type: 'water',  x: 1540, y: 380 },
  { id: 9,  name: 'Bin - Riverside',   type: 'bin',    x: 1620, y: 460 },
  { id: 10, name: 'Plug - Pier',       type: 'plug',   x: 1480, y: 480 },

  // Community/Food court area
  {
    id: 11, name: 'Toilet - Alley', type: 'toilet', x: 820,  y: 980,
    details: { venue: 'Laneway Food Court', floor: 'L2 (North block)', hours: '10:00–22:00' }
  },
  { id: 12, name: 'Plug - Cafe',   type: 'plug',   x: 900,  y: 960 },
  { id: 13, name: 'Bin - Alley',   type: 'bin',    x: 980,  y: 940 },

  // Station area
  { id: 14, name: 'Water - Station', type: 'water',  x: 380,  y: 980 },
  {
    id: 15, name: 'Toilet - Station',type: 'toilet', x: 320,  y: 920,
    details: { venue: 'Central Station', floor: 'Concourse (near Gate C)', hours: '24/7', notes: 'Baby changing facilities' }
  },
  { id: 16, name: 'Plug - Station',  type: 'plug',   x: 440,  y: 940 },

  // Shopping district
  {
    id: 17, name: 'Toilet - Westfield', type: 'toilet', x: 1200, y: 800,
    details: { venue: 'Westfield Shopping Centre', floor: 'Level 2 (Food Court)', hours: 'Mon-Sat 09:00–21:00, Sun 10:00–19:00', notes: 'Parent rooms available' }
  },
  { id: 18, name: 'Water - Westfield', type: 'water', x: 1250, y: 780 },
  
  // Library area
  {
    id: 19, name: 'Toilet - Library', type: 'toilet', x: 600, y: 700,
    details: { venue: 'City Library', floor: 'Ground Floor (East)', hours: 'Mon-Fri 09:00–20:00, Sat-Sun 10:00–17:00', notes: 'Wheelchair accessible' }
  },
  
  // Restaurant district
  {
    id: 20, name: 'Toilet - Italian Restaurant', type: 'toilet', x: 1400, y: 900,
    details: { venue: 'Bella Vista Restaurant', floor: 'Ground Floor (Back)', hours: 'Tue-Sun 11:30–22:00, Closed Mon', notes: 'Customers only' }
  },
  
  // Cinema complex
  {
    id: 21, name: 'Toilet - Cinema', type: 'toilet', x: 850, y: 750,
    details: { venue: 'Galaxy Cinema Complex', floor: 'Level 1 (Near Screen 3)', hours: 'Daily 10:00–01:00', notes: 'Accessible during movie hours' }
  },
  
  // Sports center
  {
    id: 22, name: 'Toilet - Gym', type: 'toilet', x: 1600, y: 1100,
    details: { venue: 'FitLife Sports Center', floor: 'Ground Floor (Reception)', hours: 'Mon-Fri 05:00–23:00, Sat-Sun 07:00–21:00', notes: 'Members and visitors' }
  },
  
  // Coffee shop
  {
    id: 23, name: 'Toilet - Starbucks', type: 'toilet', x: 1100, y: 500,
    details: { venue: 'Starbucks Coffee', floor: 'Ground Floor', hours: 'Daily 06:30–22:00', notes: 'WiFi password required' }
  },
  
  // Hotel
  {
    id: 24, name: 'Toilet - Hotel Lobby', type: 'toilet', x: 400, y: 600,
    details: { venue: 'Grand Hotel Sydney', floor: 'Lobby Level', hours: '24/7', notes: 'Luxury facilities, public access' }
  },
]

// Static road paths - more realistic with curves and intersections
const ROADS: Road[] = [
  // Main arterial roads
  {
    id: 'main-1',
    type: 'main',
    points: 'M 100,800 L 400,800 Q 450,800 480,830 L 600,950 Q 630,980 670,980 L 1400,980 Q 1450,980 1480,950 L 1600,830 Q 1630,800 1680,800 L 1900,800'
  },
  {
    id: 'main-2',
    type: 'main',
    points: 'M 1000,50 L 1000,300 Q 1000,350 980,380 L 950,450 Q 930,480 930,520 L 930,700 Q 930,750 960,780 L 1050,870 Q 1080,900 1080,950 L 1080,1350'
  },
  {
    id: 'main-3',
    type: 'main',
    points: 'M 50,400 L 300,400 Q 350,400 380,430 L 450,500 Q 480,530 520,530 L 1200,530 Q 1250,530 1280,560 L 1350,630 Q 1380,660 1430,660 L 1950,660'
  },
  
  // Secondary roads with natural curves
  {
    id: 'sec-1',
    type: 'secondary',
    points: 'M 500,200 L 500,300 Q 500,340 530,360 L 650,460 Q 680,480 680,520 L 680,750 Q 680,800 650,830 L 550,930 Q 520,960 520,1000 L 520,1200'
  },
  {
    id: 'sec-2',
    type: 'secondary',
    points: 'M 1400,200 L 1400,350 Q 1400,400 1370,430 L 1250,550 Q 1220,580 1220,630 L 1220,900 Q 1220,950 1250,980 L 1350,1080 Q 1380,1110 1380,1160 L 1380,1300'
  },
  {
    id: 'sec-3',
    type: 'secondary',
    points: 'M 200,1100 L 400,1100 Q 450,1100 480,1070 L 580,970 Q 610,940 660,940 L 900,940 Q 950,940 980,970 L 1080,1070 Q 1110,1100 1160,1100 L 1800,1100'
  },
  {
    id: 'sec-4',
    type: 'secondary',
    points: 'M 200,250 L 350,250 Q 400,250 430,280 L 530,380 Q 560,410 610,410 L 800,410 Q 850,410 880,380 L 980,280 Q 1010,250 1060,250 L 1700,250'
  },
  
  // Curved connecting roads
  {
    id: 'curve-1',
    type: 'secondary',
    points: 'M 300,600 Q 350,620 400,600 L 500,550 Q 550,530 600,550 L 700,600 Q 750,620 800,600'
  },
  {
    id: 'curve-2',
    type: 'secondary',
    points: 'M 1200,300 Q 1250,320 1300,300 L 1400,250 Q 1450,230 1500,250 L 1600,300 Q 1650,320 1700,300'
  },
  
  // Natural pedestrian paths
  {
    id: 'ped-1',
    type: 'pedestrian',
    points: 'M 520,420 Q 540,400 570,390 L 620,370 Q 650,360 680,380 L 700,440'
  },
  {
    id: 'ped-2',
    type: 'pedestrian',
    points: 'M 900,600 Q 920,610 940,620 L 980,630 Q 1000,635 1020,640 L 1040,630 Q 1050,620 1060,600'
  },
  {
    id: 'ped-3',
    type: 'pedestrian',
    points: 'M 1450,500 Q 1470,480 1500,470 L 1540,460 Q 1570,450 1590,470 L 1620,500 Q 1640,520 1650,550'
  },
  {
    id: 'ped-4',
    type: 'pedestrian',
    points: 'M 850,900 Q 870,920 900,930 L 940,940 Q 970,945 1000,940 L 1040,930 Q 1070,920 1100,900'
  },
  {
    id: 'ped-5',
    type: 'pedestrian',
    points: 'M 300,700 Q 320,720 340,740 L 380,780 Q 400,800 420,780 L 460,740 Q 480,720 500,700'
  }
]

const TYPE_META: Record<FacilityType, { label: string; color: string }> = {
  bin:    { label: 'Bin',           color: '#16a34a' },
  toilet: { label: 'Toilet',        color: '#2563eb' },
  water:  { label: 'Water Station', color: '#0891b2' },
  plug:   { label: 'Power Plug',    color: '#a855f7' },
  bench:  { label: 'Bench',         color: '#92400e' },
}

// Road styles
const ROAD_STYLES = {
  main: { 
    stroke: '#6b7280', 
    strokeWidth: 8, 
    strokeDasharray: 'none',
    opacity: 0.3 
  },
  secondary: { 
    stroke: '#9ca3af', 
    strokeWidth: 5, 
    strokeDasharray: 'none',
    opacity: 0.25 
  },
  pedestrian: { 
    stroke: '#d1d5db', 
    strokeWidth: 3, 
    strokeDasharray: '8 4',
    opacity: 0.4 
  }
}


export default function InfrastructurePage() {
  // Filters
  const [filters, setFilters] = useState<Record<FacilityType, boolean>>({
    bin: true, toilet: true, water: true, plug: true, bench: true,
  })
  
  // Fixed user location - doesn't change with clicks
  const [me] = useState<{ x: number; y: number }>({ x: 1000, y: 600 })
  
  // Details panel
  const [selected, setSelected] = useState<Facility | null>(null)

  // ESC key handler and click outside handler
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') setSelected(null) }
    
    const handleClickOutside = (e: MouseEvent) => {
      const modal = document.getElementById('facility-modal')
      if (modal && !modal.contains(e.target as Node)) {
        setSelected(null)
      }
    }
    
    window.addEventListener('keydown', onEsc)
    if (selected) {
      setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside)
      }, 100)
    }
    
    return () => {
      window.removeEventListener('keydown', onEsc)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [selected])

  // Calculate visible facilities
  const visibleFacilities = useMemo(() => {
    return FACILITIES.filter(f => filters[f.type]);
  }, [filters]);

  // Handle clicking on facilities only
  function handleFacilityClick(facility: Facility) {
    setSelected(facility)
  }

  // Calculate distance for display
  const distance = selected ? Math.round(Math.hypot(selected.x - me.x, selected.y - me.y)) : 0

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Fixed header with filters */}
      <div className="flex-shrink-0 bg-white border-b shadow-sm">
        <div className="px-4 py-3">
          {/* Title */}
          <div className='px-4 py-6'></div>

          
          {/* First row: Facility type filters */}
          <div className="flex flex-wrap gap-2 mb-3">
            {(Object.keys(TYPE_META) as FacilityType[]).map((t) => {
              const active = filters[t];
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setFilters(s => ({ ...s, [t]: !s[t] }))}
                  className="relative flex items-center justify-center rounded-full w-10 h-10 shadow-sm transition-transform hover:scale-105"
                  aria-label={TYPE_META[t].label}
                  title={TYPE_META[t].label}
                  style={{ 
                    background: TYPE_META[t].color,
                    opacity: active ? 1 : 0.35
                  }}
                >
                  <img src={`/icons/${t}.svg`} alt="" className="w-5 h-5 pointer-events-none" />
                  {active && <span className="absolute -top-1 -right-1 inline-block w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white" />}
                </button>
              );
            })}
          </div>
          
        </div>
      </div>

      {/* Main content area - Added mt-4 for spacing from header */}
      <div className="flex-1 overflow-hidden mt-4">
        <div className="h-full p-4">
          {/* Map section - now takes full width */}
          <div className="bg-white rounded-xl shadow-lg p-3 flex flex-col h-full">
            <div className="relative w-full rounded-lg overflow-hidden" style={{ minHeight: '400px' }}>
              {/* Maintain aspect ratio based on the original virtual map size */}
              <div style={{ paddingBottom: `${(MAP_H / MAP_W) * 100}%` }} />

              {/* Background image */}
              <img
                src="/bg1.png"
                alt="Map background"
                className="absolute inset-0 w-full h-full object-contain bg-black"
                style={{ cursor: 'default' }}
              />

              {/* Interactive overlay using the same coordinate system (MAP_W x MAP_H) */}
              <svg
                viewBox={`0 0 ${MAP_W} ${MAP_H}`}
                className="absolute inset-0 w-full h-full"
                preserveAspectRatio="xMidYMid slice"
              >
                {/* Facility markers (clickable) */}
                {visibleFacilities.map((f) => (
                  <g
                    key={f.id}
                    transform={`translate(${f.x}, ${f.y})`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleFacilityClick(f)}
                  >
                    {selected?.id === f.id && <circle r="28" fill="none" stroke="#111827" strokeWidth="4" />}
                    <circle r="24" fill={TYPE_META[f.type].color} opacity={0.25} />
                    <circle r="14" fill={TYPE_META[f.type].color} />
                    <image x={20} y={-36} width={32} height={32} href={`/icons/${f.type}.svg`} />
                    <text x={30} y={18} fontSize="26" fill="#334155" fontWeight="600">{f.name}</text>
                  </g>
                ))}

                {/* User location marker (fixed) */}
                <g transform={`translate(${me.x}, ${me.y})`} pointerEvents="none">
                  <circle r="26" fill="#ef4444" opacity="0.3" />
                  <circle r="20" fill="#dc2626" />
                  <circle r="8" fill="white" />
                  <text x={-20} y={-28} fontSize="42" fontWeight="700">📍</text>
                  <text x={26} y={10} fontSize="28" fill="#111827" fontWeight="700">You are here</text>
                </g>

                {/* Border */}
                <rect x="1" y="1" width={MAP_W-2} height={MAP_H-2} fill="none" stroke="#94a3b8" />
              </svg>
            </div>

            <div className="px-2 py-2 text-sm text-gray-500 border-t mt-2">
              💡 Tip: Click facilities (especially 🚻) for details • Click outside modal to close • Press ESC to close
            </div>
          </div>
        </div>
      </div>

      {/* Modal for facility details - smaller, no dark overlay */}
      {selected && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
        >
          <div 
            id="facility-modal"
            className="bg-white rounded-xl shadow-2xl p-5 max-w-sm w-auto pointer-events-auto border border-gray-200"
            style={{ minWidth: '320px' }}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <div className="mb-1">
                  <img src={`/icons/${selected.type}.svg`} alt={TYPE_META[selected.type].label} className="inline-block w-6 h-6" />
                </div>
                <h2 className="text-lg font-bold">{selected.name}</h2>
                <div className="text-xs text-gray-500 mt-1">
                  Type: {TYPE_META[selected.type].label}
                </div>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="text-gray-400 hover:text-gray-600 text-xl leading-none p-1"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Details section for toilets */}
            {selected.type === 'toilet' && selected.details && (
              <div className="space-y-2 mb-3 bg-blue-50 rounded-lg p-3 text-sm">
                <InfoRow label="📍 Venue" value={selected.details.venue ?? '—'} />
                <InfoRow label="🏢 Floor" value={selected.details.floor ?? '—'} />
                <InfoRow label="🕐 Hours" value={selected.details.hours ?? '—'} />
                {selected.details.notes && <InfoRow label="ℹ️ Notes" value={selected.details.notes} />}
              </div>
            )}

            {/* Distance info */}
            <div className="p-2 bg-gray-50 rounded-lg mb-3 text-sm">
              <div className="text-gray-700 font-medium">Distance from your location: {distance}m</div>
              <div className="text-xs text-gray-600 mt-1">Estimated walk time: {Math.ceil(distance / 80)} min</div>
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button className="bg-emerald-600 text-white rounded-lg py-2 text-sm hover:bg-emerald-700 transition font-medium">
                Navigate
              </button>
              <button className="bg-gray-100 text-gray-800 rounded-lg py-2 text-sm hover:bg-gray-200 transition font-medium">
                Report issue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3 pb-2 border-b border-gray-100 last:border-0">
      <div className="text-gray-600 text-sm">{label}</div>
      <div className="font-medium text-gray-800 text-sm text-right">{value}</div>
    </div>
  )
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

