'use client'

import { useState, useEffect } from 'react'

// A-Frame JSX aliases to avoid TS errors
const AScene: any = 'a-scene'
const ASky: any = 'a-sky'
const AEntity: any = 'a-entity'

// Inline VRSkyModal component to avoid import issues
function VRSkyModal({
  open,
  src,
  onClose,
}: {
  open: boolean
  src?: string
  onClose: () => void
}) {
  const [mounted, setMounted] = useState(false)
  const [ready, setReady] = useState(false)
  const [pano, setPano] = useState('/images/vr/sechelt.jpg')

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!open) { setReady(false); return }
    let alive = true
    import('aframe').then(() => alive && setReady(true))
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    const onPopState = () => onClose()
    
    document.addEventListener('keydown', onKey)
    window.addEventListener('popstate', onPopState)
    document.body.classList.add('overflow-hidden')
    
    // Push history state for back button support
    history.pushState({ modal: 'vr' }, '', location.href)
    
    return () => {
      alive = false
      document.removeEventListener('keydown', onKey)
      window.removeEventListener('popstate', onPopState)
      document.body.classList.remove('overflow-hidden')
    }
  }, [open, onClose])

  useEffect(() => {
    if (!open) return
    const candidate = src || '/images/vr/sechelt.jpg'
    const img = new Image()
    img.onload = () => setPano(candidate)
    img.onerror = () => setPano('/images/vr/sechelt.jpg')
    img.src = candidate
  }, [open, src])

  if (!mounted || !open || !ready) return null

  return (
    <div className="fixed inset-0 z-[60] bg-black" suppressHydrationWarning>
      <div className="absolute top-0 left-0 right-0 p-4 z-[70] pointer-events-none flex justify-end">
        <button
          onClick={() => {
            onClose()
            try { history.back() } catch {}
          }}
          className="pointer-events-auto bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors"
        >
          Exit 360°
        </button>
      </div>

      <div
        className="absolute top-0 left-0 right-0 h-16 z-[65]"
        onClick={onClose}
      />

      <div className="w-full h-full">
        <AScene embedded vr-mode-ui="enabled: true" className="w-full h-full">
          <ASky src={pano} rotation="0 -90 0" />
          <AEntity 
            camera 
            look-controls="touchEnabled: true; mouseEnabled: true; magicWindowTrackingEnabled: true" 
            wasd-controls-enabled="false" 
          />
        </AScene>
      </div>
    </div>
  )
}

// Urban Green Trail routes data
const greenTrailRoutes = [
  {
    id: 1,
    title: "Urban Green Trail",
    summary: "Discover hidden pockets of nature and community-driven sustainability woven through Sydney's urban fabric",
    distance: "2.7 km",
    duration: "50 min",
    stops: 6,
    theme: "Green Spaces & Sustainability",
    era: "1970s-Present",
    difficulty: "Easy",
    totalCO2Saved: "47 tonnes annually",
    totalWaterTreated: "3.2 million liters/year",
    totalFoodProduced: "350kg annually",
    stops_detail: [
      {
        id: 1,
        order: 1,
        name: "Forgotten Creek Daylight",
        teaser: "Where an ancient waterway was brought back from the pipes",
        walkTime: "Start",
        walkDistance: "0m",
        totalTime: "0 min",
        story: "This creek flowed here for thousands of years before being buried under concrete in 1923. In 2019, community activists convinced the council to 'daylight' it again, creating this small urban oasis where native fish have returned.",
        impact: "Habitat restored for 12+ native species",
        year: "2019",
        type: "Water Restoration",
        vrImageUrl: "/images/vr/forgotten-creek-360.jpg"
      },
      {
        id: 2,
        order: 2,
        name: "The Guerrilla Garden",
        teaser: "A vacant lot transformed by neighborhood rebels",
        walkTime: "7 min",
        walkDistance: "520m",
        totalTime: "12 min",
        story: "The 'Green Bans' movement started here in 1971, when construction workers refused to demolish historic buildings, combining labor rights with environmental activism.",
        impact: "150kg vegetables grown annually",
        year: "2015",
        type: "Community Garden"
      },
      {
        id: 3,
        order: 3,
        name: "Living Machine Rain Garden",
        teaser: "Where storm water becomes clean water naturally",
        walkTime: "6 min",
        walkDistance: "430m",
        totalTime: "23 min",
        story: "This engineered wetland treats 2 million liters of street runoff each year using only plants and beneficial bacteria. The curved design mimics natural creek bends, and the native sedges can remove 85% of urban pollutants.",
        impact: "2M liters water treated annually",
        year: "2017",
        type: "Water Treatment",
        vrImageUrl: "/images/vr/rain-garden-360.jpg"
      },
      {
        id: 4,
        order: 4,
        name: "Rooftop Forest",
        teaser: "A secret garden floating above the street",
        walkTime: "8 min",
        walkDistance: "580m",
        totalTime: "36 min",
        story: "This office building's rooftop supports a micro-forest with over 200 native plants. It absorbs 15 tonnes of CO2 annually and provides habitat for 30+ bird species. The building's energy costs dropped 30% after installation.",
        impact: "15 tonnes CO2 absorbed/year",
        year: "2020",
        type: "Green Roof",
        vrImageUrl: "/images/vr/rooftop-forest-360.jpg"
      },
      {
        id: 5,
        order: 5,
        name: "The Survivor Tree",
        teaser: "A 300-year-old fig that refused to be developed",
        walkTime: "5 min",
        walkDistance: "380m",
        totalTime: "46 min",
        story: "When developers wanted to remove this massive Moreton Bay Fig in 1988, local residents chained themselves to its trunk for 3 weeks. The tree won. Its root system now anchors a small park, and its canopy covers half a city block.",
        impact: "32 tonnes CO2 stored in trunk",
        year: "1988 (saved)",
        type: "Heritage Tree"
      },
      {
        id: 6,
        order: 6,
        name: "Pocket Food Forest",
        teaser: "Where commuters harvest free lunch",
        walkTime: "4 min",
        walkDistance: "290m",
        totalTime: "50 min",
        story: "This narrow strip between buildings was transformed into a public food forest with fruit trees, herb spirals, and edible flowers. Office workers regularly harvest ingredients for lunch, and the space produces 200kg of free food annually.",
        impact: "200kg free food/year",
        year: "2021",
        type: "Food Forest"
      }
    ]
  },
  {
    id: 2,
    title: "Waterways Revival Trail",
    summary: "Follow Sydney's hidden creeks and wetlands back to life through urban restoration projects",
    distance: "3.4 km",
    duration: "65 min",
    stops: 5,
    theme: "Water & Wetlands",
    era: "1990s-Present",
    difficulty: "Moderate",
    totalCO2Saved: "23 tonnes annually",
    totalWaterTreated: "8.5 million liters/year",
    totalFoodProduced: "0kg annually",
    stops_detail: [
      {
        id: 1,
        order: 1,
        name: "Restored Wetland Basin",
        teaser: "Where shopping center runoff becomes bird habitat",
        walkTime: "Start",
        walkDistance: "0m",
        totalTime: "0 min",
        story: "This constructed wetland intercepts runoff from three shopping centers, filtering pollutants through native rushes and sedges before the water reaches the harbor. Over 40 bird species now use this site.",
        impact: "5M liters treated annually",
        year: "2016",
        type: "Constructed Wetland"
      },
      {
        id: 2,
        order: 2,
        name: "Underground River Viewing Portal",
        teaser: "Peek at the creek that flows beneath the street",
        walkTime: "12 min",
        walkDistance: "850m",
        totalTime: "17 min",
        story: "Through this glass viewing panel, you can see Johnstons Creek flowing beneath the city. It was channeled underground in 1860 but still carries stormwater to the harbor. Plans are underway to daylight more sections.",
        impact: "Educational site for 5000+ visitors/year",
        year: "2020",
        type: "Urban Stream"
      },
      {
        id: 3,
        order: 3,
        name: "Floating Garden Pontoons",
        teaser: "Gardens that rise and fall with the tide",
        walkTime: "8 min",
        walkDistance: "640m",
        totalTime: "33 min",
        story: "These floating gardens filter harbor water while providing green space that moves with the tide. Started as an art project in 2018, they now host workshops on water quality and climate adaptation.",
        impact: "1.5M liters filtered annually",
        year: "2018",
        type: "Floating Garden"
      },
      {
        id: 4,
        order: 4,
        name: "Bioswale Network",
        teaser: "Street gardens that drink the rain",
        walkTime: "10 min",
        walkDistance: "720m",
        totalTime: "53 min",
        story: "This chain of planted depressions captures street runoff before it hits the storm drains. Native grasses and shrubs filter out oil, heavy metals, and litter while creating corridors for urban wildlife.",
        impact: "2M liters intercepted annually",
        year: "2019",
        type: "Green Infrastructure"
      },
      {
        id: 5,
        order: 5,
        name: "Tidal Pool Restoration",
        teaser: "Where concrete seawalls became living shores",
        walkTime: "12 min",
        walkDistance: "920m",
        totalTime: "65 min",
        story: "Engineers and marine biologists replaced flat concrete walls with textured panels that mimic natural rock pools. Now home to oysters, barnacles, and small fish that had disappeared from this stretch of harbor.",
        impact: "400m of marine habitat restored",
        year: "2021",
        type: "Marine Restoration"
      }
    ]
  },
  {
    id: 3,
    title: "Native Species Trail",
    summary: "Meet the original plants and animals reclaiming their place in the urban landscape",
    distance: "2.1 km",
    duration: "40 min",
    stops: 5,
    theme: "Native Wildlife",
    era: "Pre-1788-Present",
    difficulty: "Easy",
    totalCO2Saved: "31 tonnes annually",
    totalWaterTreated: "0 liters/year",
    totalFoodProduced: "80kg annually",
    stops_detail: [
      {
        id: 1,
        order: 1,
        name: "Ancient Scribbly Gums",
        teaser: "Trees with 40,000-year-old stories",
        walkTime: "Start",
        walkDistance: "0m",
        totalTime: "0 min",
        story: "These scribbly gum trees are descendants of the original forest that covered this area. The zigzag marks on their bark are made by moth larvae - the same patterns Indigenous peoples read like books for thousands of years.",
        impact: "Habitat for 25+ native species",
        year: "40,000+ years old",
        type: "Ancient Trees"
      },
      {
        id: 2,
        order: 2,
        name: "Urban Beehive Collective",
        teaser: "Where native bees build cities in the city",
        walkTime: "8 min",
        walkDistance: "590m",
        totalTime: "13 min",
        story: "Over 300 species of native bees live in Sydney, and this artificial cliff face provides nesting sites for species that build their homes in sandstone crevices. No honey, but essential pollination services.",
        impact: "Pollination for 2km radius",
        year: "2017",
        type: "Pollinator Habitat"
      },
      {
        id: 3,
        order: 3,
        name: "Banksia Scrub Remnant",
        teaser: "The last stand of Sydney's original bushland",
        walkTime: "5 min",
        walkDistance: "380m",
        totalTime: "23 min",
        story: "This 200-square-meter patch is all that remains of the banksia scrubland that once covered the entire district. Volunteers have been removing weeds and replanting native species since 1995.",
        impact: "Seed bank for restoration projects",
        year: "1995 (restoration began)",
        type: "Remnant Bushland"
      },
      {
        id: 4,
        order: 4,
        name: "Possum Highway Bridges",
        teaser: "Rope bridges for urban marsupials",
        walkTime: "7 min",
        walkDistance: "520m",
        totalTime: "37 min",
        story: "These rope and pole bridges help possums, gliders, and other arboreal mammals cross busy roads safely. Motion-sensor cameras have recorded over 1,000 crossings since installation.",
        impact: "Wildlife corridor restored",
        year: "2019",
        type: "Wildlife Corridor"
      },
      {
        id: 5,
        order: 5,
        name: "Bush Tucker Learning Garden",
        teaser: "Where office workers learn to forage",
        walkTime: "3 min",
        walkDistance: "240m",
        totalTime: "40 min",
        story: "This garden grows traditional Aboriginal food plants like wattleseed, saltbush, and native mint. Regular workshops teach sustainable harvesting and traditional preparation methods.",
        impact: "80kg traditional foods/year",
        year: "2020",
        type: "Cultural Garden"
      }
    ]
  }
]

export default function GreenTrailPage() {
  const [selectedRoute, setSelectedRoute] = useState<any>(null)
  const [selectedStop, setSelectedStop] = useState<any>(null)
  const [showVR, setShowVR] = useState(false)
  const [vrSrc, setVrSrc] = useState<string>('')

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 via-green-500 to-emerald-600 text-white">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold mb-4">Sydney Green Trails</h1>
          <p className="text-xl mb-6 opacity-90 max-w-3xl">
            Explore multiple green story routes through Sydney's urban landscape. From hidden waterways to native wildlife corridors, discover how nature and community activism are reshaping the city.
          </p>
          
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2">
              <div className="text-sm opacity-90">{greenTrailRoutes.length} Green Routes</div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2">
              <div className="text-sm opacity-90">{greenTrailRoutes.reduce((sum, route) => sum + route.stops, 0)} Nature Points</div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2">
              <div className="text-sm opacity-90">Easy to Moderate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Routes Selection */}
      {!selectedRoute && (
        <div className="container mx-auto px-4 py-12">
          <h2 className="text-3xl font-bold mb-8">Choose Your Green Adventure</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {greenTrailRoutes.map((route) => (
              <div
                key={route.id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
                onClick={() => setSelectedRoute(route)}
              >
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold mb-2">{route.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{route.summary}</p>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Distance:</span>
                      <span className="font-medium">{route.distance}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Duration:</span>
                      <span className="font-medium">{route.duration}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Stops:</span>
                      <span className="font-medium">{route.stops} locations</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">
                      {route.theme}
                    </span>
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                      {route.era}
                    </span>
                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">
                      {route.difficulty}
                    </span>
                  </div>

                  {route.totalCO2Saved && (
                    <div className="bg-green-50 p-3 rounded-lg mb-4">
                      <div className="text-xs text-green-700 font-medium mb-1">Environmental Impact:</div>
                      <div className="text-xs text-green-600">
                        CO2: {route.totalCO2Saved} • Water: {route.totalWaterTreated}
                      </div>
                    </div>
                  )}

                  <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors">
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
            ← Back to Green Routes
          </button>

          {/* Route Header */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h1 className="text-3xl font-bold mb-2">{selectedRoute.title}</h1>
            <p className="text-gray-600 mb-4">{selectedRoute.summary}</p>
            
            {selectedRoute.totalCO2Saved && (
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="text-lg font-bold text-green-700">{selectedRoute.totalCO2Saved}</div>
                  <div className="text-sm text-green-600">CO2 absorbed annually</div>
                </div>
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="text-lg font-bold text-blue-700">{selectedRoute.totalWaterTreated}</div>
                  <div className="text-sm text-blue-600">Water treated per year</div>
                </div>
                <div className="bg-orange-50 rounded-lg p-4">
                  <div className="text-lg font-bold text-orange-700">{selectedRoute.totalFoodProduced}</div>
                  <div className="text-sm text-orange-600">Food grown annually</div>
                </div>
              </div>
            )}
            
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center space-x-2">
                <span>📍</span>
                <span>{selectedRoute.distance}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>⏱️</span>
                <span>{selectedRoute.duration}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>🌱</span>
                <span>{selectedRoute.stops} stops</span>
              </div>
            </div>

            <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
              Start Route
            </button>
          </div>

          {/* Timeline of Stops */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">Route Timeline</h2>
            
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-8 top-4 bottom-4 w-0.5 bg-gradient-to-b from-green-400 to-green-600"></div>
              
              <div className="space-y-6">
                {selectedRoute.stops_detail.map((stop: any, index: number) => (
                  <div key={stop.id} className="flex items-start space-x-4">
                    {/* Stop number circle */}
                    <div className="flex-shrink-0 w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-lg relative z-10">
                      {stop.order}
                    </div>
                    
                    {/* Stop content */}
                    <div className="flex-grow bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">
                              {stop.type}
                            </span>
                            <span className="text-gray-500 text-xs">{stop.year}</span>
                          </div>
                          <h3 className="text-lg font-semibold">{stop.name}</h3>
                          <p className="text-green-600 mb-2 italic text-sm">{stop.teaser}</p>
                          <p className="text-emerald-700 font-medium text-xs mb-2">
                            Impact: {stop.impact}
                          </p>
                        </div>
                        <div className="text-right text-sm text-gray-500">
                          <div>{stop.walkTime}</div>
                          <div>{stop.walkDistance}</div>
                          <div className="font-medium">Total: {stop.totalTime}</div>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => setSelectedStop(stop)}
                        className="text-green-600 hover:text-green-700 font-medium text-sm"
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

      {/* Story Detail Modal */}
      {selectedStop && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-grow">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">
                      {selectedStop.type}
                    </span>
                    <span className="text-gray-500 text-sm">{selectedStop.year}</span>
                  </div>
                  <h2 className="text-2xl font-bold mb-2">{selectedStop.name}</h2>
                  <p className="text-green-600 italic text-lg">{selectedStop.teaser}</p>
                </div>
                <button
                  onClick={() => setSelectedStop(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl ml-4"
                >
                  ×
                </button>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg mb-6">
                <div className="font-semibold text-emerald-700 mb-1">Environmental Impact:</div>
                <div className="text-emerald-600">{selectedStop.impact}</div>
              </div>
              
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed text-lg">
                  {selectedStop.story}
                </p>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row gap-3">
                  <button className="flex-1 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium">
                    Get Directions
                  </button>
                  {selectedStop?.vrImageUrl && (
                    <button
                      onClick={() => { 
                        setVrSrc(selectedStop.vrImageUrl)
                        setShowVR(true) 
                      }}
                      className="flex-1 bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium"
                    >
                      View in 360°
                    </button>
                  )}
                  <button className="flex-1 bg-emerald-600 text-white px-4 py-3 rounded-lg hover:bg-emerald-700 transition-colors font-medium">
                    Mark as Visited
                  </button>
                </div>
                <button className="w-full mt-3 bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 transition-colors">
                  Share This Green Story
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-emerald-600 to-green-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Explore Sydney's Green Stories?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Download routes, grab your reusable water bottle, and discover how your city is growing greener one story at a time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors">
              Download All Routes
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors">
              Share Green Trails
            </button>
          </div>
        </div>
      </div>

      {/* VR Modal */}
      <VRSkyModal open={showVR} src={vrSrc} onClose={() => setShowVR(false)} />
    </div>
  )
}