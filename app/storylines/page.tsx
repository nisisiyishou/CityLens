'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

// A-Frame JSX aliases to silence TS
const AScene: any = 'a-scene'
const ASky: any = 'a-sky'
const AEntity: any = 'a-entity'

// Mock data for demo
const mockRoutes = [
  {
    id: 1,
    title: "Hidden Labor Stories",
    summary: "Discover the forgotten workers who built Sydney's foundations",
    distance: "2.3 km",
    duration: "55 min",
    stops: 6,
    theme: "Labor History",
    era: "1890s-1930s",
    difficulty: "Easy",
    stops_detail: [
      {
        id: 1,
        order: 1,
        name: "Central Railway Station",
        teaser: "Where thousands of workers gathered for the great strikes",
        walkTime: "Start",
        walkDistance: "0m",
        totalTime: "0 min",
        story: "In 1917, this station became the epicenter of Australia's largest general strike. Over 100,000 workers walked off the job, paralyzing the city for weeks.",
        vrImageUrl: "/images/vr/central-station-1917-360.jpg",
        year: "1917"
      },
      {
        id: 2,
        order: 2,
        name: "Old Tram Depot",
        teaser: "Secret meeting place of the Transport Workers Union",
        walkTime: "6 min",
        walkDistance: "450m",
        totalTime: "11 min",
        story: "Behind these brick walls, tramway workers planned the strikes that would change Sydney's labor laws forever. The depot's hidden basement served as a makeshift union hall.",
        vrImageUrl: "/images/vr/old-tram-depot-360.jpg",
        year: "1920s"
      },
      {
        id: 3,
        order: 3,
        name: "Darling Harbour Wharf",
        teaser: "Where dock workers defied the bosses",
        walkTime: "8 min",
        walkDistance: "620m",
        totalTime: "24 min",
        story: "The 'Green Bans' movement started here in 1971, when construction workers refused to demolish historic buildings, combining labor rights with environmental activism.",
        vrImageUrl: "/images/vr/darling-harbour-360.jpg",
        year: "1971"
      },
      {
        id: 4,
        order: 4,
        name: "Hyde Park Corner",
        teaser: "Speaker's corner for workers' rights",
        walkTime: "12 min",
        walkDistance: "900m",
        totalTime: "41 min",
        story: "Every Sunday from 1920-1950, union leaders would stand on improvised platforms here, speaking to crowds about workers' rights and social justice.",
        vrImageUrl: "/images/vr/hyde-park-corner-360.jpg",
        year: "1920-1950"
      },
      {
        id: 5,
        order: 5,
        name: "Old Brewery Lane",
        teaser: "Where female factory workers organized",
        walkTime: "5 min",
        walkDistance: "300m",
        totalTime: "51 min",
        story: "In 1888, women working in nearby factories held their first organized meeting in this narrow lane, demanding equal pay and safer working conditions.",
        vrImageUrl: "/images/vr/old-brewery-lane-360.jpg",
        year: "1888"
      },
      {
        id: 6,
        order: 6,
        name: "Union Square (now demolished)",
        teaser: "The heart of Sydney's labor movement",
        walkTime: "4 min",
        walkDistance: "280m",
        totalTime: "55 min",
        story: "Once stood here was the original headquarters of the Labor Council. Though the building is gone, the legacy of worker solidarity remains in Sydney's progressive labor laws.",
        vrImageUrl: "/images/vr/union-square-360.jpg",
        year: "Early 1900s"
      }
    ]
  },
  {
    id: 2,
    title: "Urban Green Trail",
    summary: "Explore hidden pockets of nature and sustainability woven through the city",
    distance: "2.7 km", 
    duration: "50 min",
    stops: 6,
    theme: "Green Spaces",
    era: "1970s-Present",
    difficulty: "Easy",
    stops_detail: [
      {
        id: 1,
        order: 1,
        name: "Forgotten Creek Daylight",
        teaser: "Where an ancient waterway was brought back from the pipes",
        walkTime: "Start",
        walkDistance: "0m",
        totalTime: "0 min",
        story: "This creek flowed here for thousands of years before being buried under concrete in 1923. In 2019, community activists convinced the council to 'daylight' it again, creating this small urban oasis where native fish have returned."
      },
      {
        id: 2,
        order: 2,
        name: "The Guerrilla Garden",
        teaser: "A vacant lot transformed by neighborhood rebels",
        walkTime: "7 min",
        walkDistance: "520m",
        totalTime: "12 min",
        story: "Started illegally in 2015 when residents got tired of looking at this empty lot. They planted vegetables at night, installed rain collection barrels, and created Sydney's first 'guerrilla garden.' The council tried to remove it twice before officially adopting it."
      },
      {
        id: 3,
        order: 3,
        name: "Living Machine Rain Garden",
        teaser: "Where storm water becomes clean water naturally",
        walkTime: "6 min",
        walkDistance: "430m",
        totalTime: "23 min",
        story: "This engineered wetland treats 2 million liters of street runoff each year using only plants and beneficial bacteria. The curved design mimics natural creek bends, and the native sedges can remove 85% of urban pollutants."
      },
      {
        id: 4,
        order: 4,
        name: "Rooftop Forest",
        teaser: "A secret garden floating above the street",
        walkTime: "8 min",
        walkDistance: "580m",
        totalTime: "36 min",
        story: "This office building's rooftop supports a micro-forest with over 200 native plants. It absorbs 15 tonnes of CO2 annually and provides habitat for 30+ bird species. The building's energy costs dropped 30% after installation."
      },
      {
        id: 5,
        order: 5,
        name: "The Survivor Tree",
        teaser: "A 300-year-old fig that refused to be developed",
        walkTime: "5 min",
        walkDistance: "380m",
        totalTime: "46 min",
        story: "When developers wanted to remove this massive Moreton Bay Fig in 1988, local residents chained themselves to its trunk for 3 weeks. The tree won. Its root system now anchors a small park, and its canopy covers half a city block."
      },
      {
        id: 6,
        order: 6,
        name: "Pocket Food Forest",
        teaser: "Where commuters harvest free lunch",
        walkTime: "4 min",
        walkDistance: "290m",
        totalTime: "50 min",
        story: "This narrow strip between buildings was transformed into a public food forest with fruit trees, herb spirals, and edible flowers. Office workers regularly harvest ingredients for lunch, and the space produces 200kg of free food annually."
      }
    ]
  },
  {
    id: 3,
    title: "Forgotten Women's Stories",
    summary: "Uncover the pioneering women who shaped Sydney's history",
    distance: "1.8 km", 
    duration: "45 min",
    stops: 5,
    theme: "Women's History",
    era: "1880s-1920s",
    difficulty: "Easy",
    stops_detail: [
      {
        id: 1,
        order: 1,
        name: "The Women's Club (former site)",
        teaser: "Australia's first women's professional club",
        walkTime: "Start",
        walkDistance: "0m",
        totalTime: "0 min",
        story: "Established in 1901, this was where professional women gathered to discuss careers, politics, and social reform when such topics were forbidden elsewhere."
      },
      {
        id: 2,
        order: 2,
        name: "Rose Scott's House (demolished)",
        teaser: "The suffragette who never married",
        walkTime: "7 min",
        walkDistance: "530m",
        totalTime: "12 min",
        story: "Rose Scott lived here while campaigning for women's voting rights. She famously declared 'I have never been married because I have never found a man who could command my respect.'"
      },
      {
        id: 3,
        order: 3,
        name: "The Dawn Building",
        teaser: "Home of Australia's first feminist newspaper",
        walkTime: "6 min",
        walkDistance: "420m",
        totalTime: "23 min",
        story: "From 1888 to 1905, 'The Dawn' was published here - Australia's first journal written by women for women, covering everything from fashion to politics."
      },
      {
        id: 4,
        order: 4,
        name: "Royal Hospital for Women (original site)",
        teaser: "Where the first female doctors practiced",
        walkTime: "10 min",
        walkDistance: "750m",
        totalTime: "38 min",
        story: "Dr. Dagmar Berne, one of Australia's first female doctors, established her practice here in 1897, treating patients who were refused care elsewhere."
      },
      {
        id: 5,
        order: 5,
        name: "Elizabeth Street Markets",
        teaser: "Where women entrepreneurs thrived",
        walkTime: "7 min",
        walkDistance: "480m",
        totalTime: "45 min",
        story: "Long before women could own property easily, this market was run by female traders who built thriving businesses selling everything from flowers to fabric."
      }
    ]
  },
  {
    id: 4,
    title: "Lost Architecture Trail",
    summary: "Walk through Sydney's vanished buildings and forgotten skylines", 
    distance: "3.1 km",
    duration: "75 min",
    stops: 7,
    theme: "Architecture",
    era: "1850s-1960s", 
    difficulty: "Moderate",
    stops_detail: [
      {
        id: 1,
        order: 1,
        name: "Grand Central Hotel (demolished 1971)",
        teaser: "Sydney's lost architectural gem",
        walkTime: "Start",
        walkDistance: "0m", 
        totalTime: "0 min",
        story: "Once stood here was a magnificent 6-story hotel with ornate Victorian facade. Demolished for a parking lot, it represented the architectural vandalism of the 1970s."
      },
      {
        id: 2,
        order: 2,
        name: "The Old Markets (site)",
        teaser: "Where iron and glass created Sydney's first mall",
        walkTime: "8 min",
        walkDistance: "600m",
        totalTime: "13 min", 
        story: "Built in 1869, these cast-iron and glass pavilions were Sydney's answer to London's Crystal Palace. The delicate ironwork was sold for scrap in 1960."
      },
      {
        id: 3,
        order: 3,
        name: "Theatre Royal (fourth incarnation)",
        teaser: "The theater that burned down four times",
        walkTime: "5 min",
        walkDistance: "380m",
        totalTime: "23 min",
        story: "This corner has seen four different Theatre Royals since 1827. Each one grander than the last, each one eventually destroyed by fire, earthquake, or developers."
      },
      {
        id: 4,
        order: 4,
        name: "Old Government House Stables",
        teaser: "Colonial grandeur in everyday buildings", 
        walkTime: "12 min",
        walkDistance: "850m",
        totalTime: "40 min",
        story: "These servant quarters showed the same architectural attention as the main house - Georgian proportions, sandstone blocks, and cedar details that rivaled palaces."
      },
      {
        id: 5,
        order: 5,
        name: "The Demolished Synagogue",
        teaser: "Moorish architecture in colonial Sydney",
        walkTime: "9 min", 
        walkDistance: "680m",
        totalTime: "54 min",
        story: "Built in 1878 with horseshoe arches and geometric tiles, this synagogue brought Middle Eastern architectural style to Sydney, decades before it became fashionable."
      },
      {
        id: 6,
        order: 6,
        name: "Lost Terrace Houses of Bent Street",
        teaser: "When entire streets vanished overnight",
        walkTime: "6 min",
        walkDistance: "450m", 
        totalTime: "65 min",
        story: "An entire street of 1880s terrace houses with iron lacework balconies was demolished in 1962 for urban renewal. Only photographs remain."
      },
      {
        id: 7,
        order: 7, 
        name: "The Old Customs House Tower",
        teaser: "Sydney's first attempt at a skyscraper",
        walkTime: "10 min",
        walkDistance: "720m",
        totalTime: "75 min",
        story: "This 12-story tower built in 1885 was considered daringly tall. Its clock tower was a landmark for ships entering the harbor until demolished in 1955."
      }
    ]
  }
]

export default function StorylinesPage() {
  const [selectedRoute, setSelectedRoute] = useState<any>(null)
  const [selectedStop, setSelectedStop] = useState<any>(null)
  const [isNarrating, setIsNarrating] = useState(false)
  const [showVRViewer, setShowVRViewer] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  // Mount guard so VR only renders on client
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  // A-Frame readiness + pano fallback
  const [aframeReady, setAframeReady] = useState(false)
  const [panoSrc, setPanoSrc] = useState("/images/vr/sechelt.jpg")

  // Load A-Frame only when the VR viewer opens, then mark ready
  useEffect(() => {
    let alive = true
    if (showVRViewer) {
      import('aframe').then(() => {
        if (alive) setAframeReady(true)
      })
    } else {
      setAframeReady(false)
    }
    return () => { alive = false }
  }, [showVRViewer])

  // Preflight the pano image; fallback to sample if missing
  useEffect(() => {
    if (!showVRViewer || !selectedStop) return
    const candidate = selectedStop.vrImageUrl || "/images/vr/sechelt.jpg"
    const img = new Image()
    img.onload = () => setPanoSrc(candidate)
    img.onerror = () => setPanoSrc("/images/vr/sechelt.jpg")
    img.src = candidate
  }, [showVRViewer, selectedStop])

  // Close VR on Escape key
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showVRViewer) setShowVRViewer(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [showVRViewer])

  // Push a history entry when VR opens so Back closes the modal
  useEffect(() => {
    if (!showVRViewer) return

    const onPopState = () => setShowVRViewer(false)
    window.addEventListener('popstate', onPopState)

    // Push a dummy state to trap the first Back press
    history.pushState({ modal: 'vr' }, '', location.href)

    return () => {
      window.removeEventListener('popstate', onPopState)
    }
  }, [showVRViewer])

  // Sync closing if user exits VR mode via headset/system UI
  useEffect(() => {
    if (!aframeReady || !showVRViewer) return
    const scene = document.querySelector('a-scene') as any
    if (!scene) return

    const onExit = () => setShowVRViewer(false)
    scene.addEventListener('exit-vr', onExit)
    return () => scene.removeEventListener('exit-vr', onExit)
  }, [aframeReady, showVRViewer])

  // Prevent body scroll when VR viewer is open
  useEffect(() => {
    document.body.classList.toggle('overflow-hidden', showVRViewer)
    return () => document.body.classList.remove('overflow-hidden')
  }, [showVRViewer])

  // Text-to-speech narration
  const handleNarrate = (text: string) => {
    if (isNarrating) {
      speechSynthesis.cancel()
      setIsNarrating(false)
      return
    }

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.8
    utterance.pitch = 1
    utterance.volume = 0.8
    
    utterance.onstart = () => setIsNarrating(true)
    utterance.onend = () => setIsNarrating(false)
    utterance.onerror = () => setIsNarrating(false)
    
    speechSynthesis.speak(utterance)
  }

  // Open VR viewer
  const openVRViewer = () => {
    setShowVRViewer(true)
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl md:text-4xl font-bold mb-3">Forgotten Sydney Stories</h1>
          <p className="text-sm md:text-xl mb-4 opacity-90">
            Discover the hidden histories beneath your feet. Walk curated routes through Sydney's forgotten stories, from demolished buildings to lost communities.
          </p>
          <div className="flex space-x-2 text-xs">
            <span className="bg-white bg-opacity-20 px-2 py-1 rounded-full">
              {mockRoutes.length} Routes Available
            </span>
            <span className="bg-white bg-opacity-20 px-2 py-1 rounded-full">
              {mockRoutes.reduce((sum, route) => sum + route.stops, 0)} Story Points
            </span>
          </div>
        </div>
      </div>

      {/* Routes Grid */}
      {!selectedRoute && (
        <div className="container mx-auto px-4 py-8">
          <h2 className="text-xl md:text-2xl font-bold mb-6">Choose Your Story Route</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockRoutes.map((route) => (
              <div
                key={route.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedRoute(route)}
              >
                <div className="p-4">
                  <div className="mb-3">
                    <h3 className="text-lg md:text-xl font-semibold mb-2">{route.title}</h3>
                    <p className="text-gray-600 text-xs md:text-sm mb-3">{route.summary}</p>
                  </div>
                  
                  <div className="space-y-1 mb-3">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Distance:</span>
                      <span className="font-medium">{route.distance}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Duration:</span>
                      <span className="font-medium">{route.duration}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Stops:</span>
                      <span className="font-medium">{route.stops} locations</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-3">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                      {route.theme}
                    </span>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                      {route.era}
                    </span>
                    <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">
                      {route.difficulty}
                    </span>
                  </div>

                  <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors text-sm">
                    Explore Route
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Route Detail View */}
      {selectedRoute && (
        <div className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <button
            onClick={() => {
              setSelectedRoute(null)
              setSelectedStop(null)
            }}
            className="mb-6 text-green-600 hover:text-green-700 flex items-center"
          >
            ← Back to Routes
          </button>

          {/* Route Header */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <h1 className="text-xl md:text-3xl font-bold mb-2">{selectedRoute.title}</h1>
            <p className="text-gray-600 mb-3 text-sm md:text-base">{selectedRoute.summary}</p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              <div className="flex items-center space-x-1 text-xs">
                <span className="text-gray-500">📍</span>
                <span>{selectedRoute.distance}</span>
              </div>
              <div className="flex items-center space-x-1 text-xs">
                <span className="text-gray-500">⏱️</span>
                <span>{selectedRoute.duration}</span>
              </div>
              <div className="flex items-center space-x-1 text-xs">
                <span className="text-gray-500">🎯</span>
                <span>{selectedRoute.stops} stops</span>
              </div>
            </div>

            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm">
              Start Route
            </button>
          </div>

          {/* Timeline of Stops */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg md:text-2xl font-bold mb-4">Route Timeline</h2>
            
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-gray-300"></div>
              
              <div className="space-y-4">
                {selectedRoute.stops_detail.map((stop: any, index: number) => (
                  <div key={stop.id} className="flex items-start space-x-3">
                    {/* Stop number circle */}
                    <div className="flex-shrink-0 w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm relative z-10">
                      {stop.order}
                    </div>
                    
                    {/* Stop content */}
                    <div className="flex-grow bg-gray-50 rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-sm md:text-lg font-semibold">{stop.name}</h3>
                        <div className="text-right text-xs text-gray-500">
                          <div>{stop.walkTime}</div>
                          <div>{stop.walkDistance}</div>
                          <div className="font-medium">Total: {stop.totalTime}</div>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mb-2 italic text-xs">{stop.teaser}</p>
                      
                      <button
                        onClick={() => setSelectedStop(stop)}
                        className="text-green-600 hover:text-green-700 font-medium text-xs"
                      >
                        Read Full Story →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Story Detail Modal with Immersive Features */}
      {selectedStop && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2">
          <div className="bg-white rounded-lg max-w-lg w-full max-h-[85vh] overflow-y-auto">
            <div className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h2 className="text-lg md:text-2xl font-bold mb-1">{selectedStop.name}</h2>
                  <p className="text-green-600 italic text-sm">{selectedStop.teaser}</p>
                </div>
                <button
                  onClick={() => {
                    setSelectedStop(null)
                    speechSynthesis.cancel()
                    setIsNarrating(false)
                    setShowVRViewer(false)
                  }}
                  className="text-gray-400 hover:text-gray-600 text-lg"
                >
                  ✕
                </button>
              </div>
              
              <div className="mb-4">
                <p className="text-gray-700 leading-relaxed text-sm">
                  {selectedStop.story}
                </p>
              </div>

              {/* Immersive Experience Controls */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg mb-4">
                <h3 className="font-semibold text-gray-800 mb-2 text-sm">Immersive Experience</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {/* Audio Narration */}
                  <button
                    onClick={() => handleNarrate(selectedStop.story)}
                    className={`flex items-center justify-center space-x-2 px-3 py-2 rounded-lg transition-colors text-xs ${
                      isNarrating 
                        ? 'bg-red-500 hover:bg-red-600 text-white' 
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                  >
                    <span className="text-sm">
                      {isNarrating ? '⏹️' : '🔊'}
                    </span>
                    <span className="font-medium">
                      {isNarrating ? 'Stop Narration' : 'Play Narration'}
                    </span>
                  </button>

                  {/* VR/360° Viewer */}
                  <button
                    onClick={openVRViewer}
                    className="flex items-center justify-center space-x-2 bg-purple-500 hover:bg-purple-600 text-white px-3 py-2 rounded-lg transition-colors text-xs"
                  >
                    <span className="text-sm">🕶️</span>
                    <span className="font-medium">View in 360°</span>
                  </button>
                </div>
              </div>
              
              <div className="pt-3 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row gap-2">
                  <button className="text-green-600 hover:text-green-700 text-sm flex-1 py-2">
                    📍 Get Directions
                  </button>
                  <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm flex-1">
                    Mark as Visited
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VR/360° Viewer Modal (A-Frame) */}
      {mounted && aframeReady && showVRViewer && selectedStop && (
        <div className="fixed inset-0 z-[60] bg-black" suppressHydrationWarning>
          {/* Top bar overlay that doesn't block drags on the scene */}
          <div className="absolute top-0 left-0 right-0 p-4 z-[70] pointer-events-none flex justify-end">
            <button
              onClick={() => {
                setShowVRViewer(false)
                // Go back one history entry if we pushed one when opening
                try { history.back() } catch {}
              }}
              className="pointer-events-auto bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors"
            >
              Exit 360°
            </button>
          </div>

          {/* Clickable top hit-area to close (doesn't block scene drags below this strip) */}
          <div
            className="absolute top-0 left-0 right-0 h-16 z-[65]"
            onClick={() => setShowVRViewer(false)}
          />

          {/* A-Frame scene fills the screen */}
          <div className="w-full h-full">
            <AScene
              embedded
              vr-mode-ui="enabled: true"
              className="w-full h-full"
            >
              {/* Use preflight-checked image source */}
              <ASky
                src={panoSrc}
                rotation="0 -90 0"
              />

              {/* Allow touch/mouse look controls on phones/desktops */}
              <AEntity
                camera
                look-controls="touchEnabled: true; mouseEnabled: true; magicWindowTrackingEnabled: true"
                wasd-controls-enabled="false"
              />
            </AScene>
          </div>
        </div>
      )}

      {/* Hidden Audio Element */}
      <audio ref={audioRef} className="hidden" />
    </div>
  )
}