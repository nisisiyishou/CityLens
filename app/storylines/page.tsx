'use client'

import { useState } from 'react'

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
        story: "In 1917, this station became the epicenter of Australia's largest general strike. Over 100,000 workers walked off the job, paralyzing the city for weeks."
      },
      {
        id: 2,
        order: 2,
        name: "Old Tram Depot",
        teaser: "Secret meeting place of the Transport Workers Union",
        walkTime: "6 min",
        walkDistance: "450m",
        totalTime: "11 min",
        story: "Behind these brick walls, tramway workers planned the strikes that would change Sydney's labor laws forever. The depot's hidden basement served as a makeshift union hall."
      },
      {
        id: 3,
        order: 3,
        name: "Darling Harbour Wharf",
        teaser: "Where dock workers defied the bosses",
        walkTime: "8 min",
        walkDistance: "620m",
        totalTime: "24 min",
        story: "The 'Green Bans' movement started here in 1971, when construction workers refused to demolish historic buildings, combining labor rights with environmental activism."
      },
      {
        id: 4,
        order: 4,
        name: "Hyde Park Corner",
        teaser: "Speaker's corner for workers' rights",
        walkTime: "12 min",
        walkDistance: "900m",
        totalTime: "41 min",
        story: "Every Sunday from 1920-1950, union leaders would stand on improvised platforms here, speaking to crowds about workers' rights and social justice."
      },
      {
        id: 5,
        order: 5,
        name: "Old Brewery Lane",
        teaser: "Where female factory workers organized",
        walkTime: "5 min",
        walkDistance: "300m",
        totalTime: "51 min",
        story: "In 1888, women working in nearby factories held their first organized meeting in this narrow lane, demanding equal pay and safer working conditions."
      },
      {
        id: 6,
        order: 6,
        name: "Union Square (now demolished)",
        teaser: "The heart of Sydney's labor movement",
        walkTime: "4 min",
        walkDistance: "280m",
        totalTime: "55 min",
        story: "Once stood here was the original headquarters of the Labor Council. Though the building is gone, the legacy of worker solidarity remains in Sydney's progressive labor laws."
      }
    ]
  },
  {
    id: 2,
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
    id: 3,
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold mb-4">Forgotten Sydney Stories</h1>
          <p className="text-xl mb-6 opacity-90">
            Discover the hidden histories beneath your feet. Walk curated routes through Sydney's forgotten stories, from demolished buildings to lost communities.
          </p>
          <div className="flex space-x-4 text-sm">
            <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
              {mockRoutes.length} Routes Available
            </span>
            <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
              {mockRoutes.reduce((sum, route) => sum + route.stops, 0)} Story Points
            </span>
          </div>
        </div>
      </div>

      {/* Routes Grid */}
      {!selectedRoute && (
        <div className="container mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold mb-8">Choose Your Story Route</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockRoutes.map((route) => (
              <div
                key={route.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedRoute(route)}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{route.title}</h3>
                      <p className="text-gray-600 text-sm mb-4">{route.summary}</p>
                    </div>
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
            ← Back to Routes
          </button>

          {/* Route Header */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h1 className="text-3xl font-bold mb-2">{selectedRoute.title}</h1>
            <p className="text-gray-600 mb-4">{selectedRoute.summary}</p>
            
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center space-x-2">
                <span className="text-gray-500">📍</span>
                <span>{selectedRoute.distance}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-500">⏱️</span>
                <span>{selectedRoute.duration}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-500">🎯</span>
                <span>{selectedRoute.stops} stops</span>
              </div>
            </div>

            <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
              Start Route
            </button>
          </div>

          {/* Timeline of Stops */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">Route Timeline</h2>
            
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-8 top-4 bottom-4 w-0.5 bg-gray-300"></div>
              
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
                        <h3 className="text-lg font-semibold">{stop.name}</h3>
                        <div className="text-right text-sm text-gray-500">
                          <div>{stop.walkTime}</div>
                          <div>{stop.walkDistance}</div>
                          <div className="font-medium">Total: {stop.totalTime}</div>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mb-3 italic">{stop.teaser}</p>
                      
                      <button
                        onClick={() => setSelectedStop(stop)}
                        className="text-green-600 hover:text-green-700 font-medium"
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
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold mb-1">{selectedStop.name}</h2>
                  <p className="text-green-600 italic">{selectedStop.teaser}</p>
                </div>
                <button
                  onClick={() => setSelectedStop(null)}
                  className="text-gray-400 hover:text-gray-600 text-xl"
                >
                  ✕
                </button>
              </div>
              
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  {selectedStop.story}
                </p>
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <button className="text-green-600 hover:text-green-700">
                    📍 Get Directions
                  </button>
                  <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                    Mark as Visited
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}