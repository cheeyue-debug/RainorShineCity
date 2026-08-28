import React, { useState } from "react";
import { motion } from "motion/react";
import { CityWeatherData, AttractionItem } from "../types";

interface MapViewProps {
  cityData: CityWeatherData | null;
}

export default function MapView({ cityData }: MapViewProps) {
  const [selectedPin, setSelectedPin] = useState<AttractionItem | null>(null);

  if (!cityData) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white/[0.03] backdrop-blur-xl rounded-[32px] border border-white/10 shadow-lg text-center h-[500px]">
        <span className="material-symbols-outlined text-5xl text-white/40 mb-4 animate-pulse">
          map
        </span>
        <h3 className="text-lg font-semibold text-white">No City Loaded</h3>
        <p className="text-sm text-white/60 mt-1 max-w-sm">
          Please search for a city or choose a suggestion to load the travel map.
        </p>
      </div>
    );
  }

  // Predefined stylized map pin coordinates relative to a 100x100 SVG viewport
  const pinCoordinates = [
    { x: 35, y: 40 },
    { x: 65, y: 30 },
    { x: 25, y: 70 },
    { x: 55, y: 75 },
  ];

  const handlePinClick = (attraction: AttractionItem) => {
    setSelectedPin(attraction);
  };

  return (
    <div className="flex flex-col gap-6" id="map-view-container">
      {/* Map Layout Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-white">
            {cityData.cityName} Tourism Map
          </h3>
          <p className="text-xs text-white/50 mt-1">
            Interactive coordinates of active weather conditions and live tourist volumes
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0EA5E9]"></span>
            <span className="text-white/60">Open / Low Vol</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span className="text-white/60">Open / Busy</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            <span className="text-white/60">Closed</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive Map Canvas Container */}
        <div className="lg:col-span-8 bg-gradient-to-tr from-white/[0.02] to-white/[0.05] border border-white/10 rounded-[32px] relative overflow-hidden h-[450px] shadow-lg flex items-center justify-center">
          {/* Stylized background grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

          {/* Abstract landmass representation */}
          <svg className="absolute inset-0 w-full h-full opacity-40 select-none pointer-events-none" viewBox="0 0 400 300" fill="none">
            <path
              d="M50,150 Q100,50 200,100 T350,120 Q380,200 300,250 T100,220 Z"
              fill="rgba(14, 165, 233, 0.12)"
              filter="blur(1px)"
            />
            <path
              d="M120,60 Q180,20 220,80 T300,60 Q340,110 300,140 Z"
              fill="rgba(99, 102, 241, 0.1)"
              filter="blur(2px)"
            />
          </svg>

          {/* Dynamic weather overview marker floating */}
          <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-md border border-white/10 px-3 py-2 rounded-xl shadow-md z-10 flex items-center gap-2.5 text-xs">
            <span className="material-symbols-outlined text-[#0EA5E9] fill text-lg">
              {cityData.conditionIcon || "partly_cloudy_day"}
            </span>
            <div>
              <p className="font-semibold text-white">{cityData.temperature}°C</p>
              <p className="text-[10px] text-white/50">{cityData.condition}</p>
            </div>
          </div>

          {/* Attraction Pin Overlays */}
          {cityData.attractions.map((attraction, index) => {
            const coords = pinCoordinates[index] || { x: 50, y: 50 };
            const isOpen = attraction.status === "OPEN";
            const isHighVol = attraction.volume.toLowerCase().includes("high");
            const isMaintenance = attraction.volume.toLowerCase().includes("maintenance") || attraction.status === "CLOSED";

            let markerColor = "bg-[#0EA5E9]"; // Standard open
            if (isHighVol) markerColor = "bg-amber-500";
            if (isMaintenance) markerColor = "bg-rose-500";

            return (
              <button
                key={attraction.name}
                onClick={() => handlePinClick(attraction)}
                style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-20 focus:outline-none"
              >
                <div className="relative flex items-center justify-center">
                  {/* Ping animation effect */}
                  {isOpen && !isHighVol && (
                    <span className="animate-ping absolute inline-flex h-6 w-6 rounded-full bg-[#0EA5E9] opacity-40"></span>
                  )}
                  {isHighVol && (
                    <span className="animate-ping absolute inline-flex h-6 w-6 rounded-full bg-amber-500 opacity-40"></span>
                  )}

                  {/* Marker Circle */}
                  <div className={`h-8 w-8 rounded-full ${markerColor} text-white flex items-center justify-center shadow-md relative z-10 transform group-hover:scale-110 transition-transform`}>
                    <span className="material-symbols-outlined text-sm">
                      {attraction.category === "garden" ? "park" : 
                       attraction.category === "skyline" ? "apartment" : 
                       attraction.category === "temple" ? "temple_buddhist" : 
                       attraction.category === "museum" ? "museum" : 
                       attraction.category === "zoo" ? "pets" : 
                       attraction.category === "park" ? "forest" : 
                       attraction.category === "monument" ? "statue" : 
                       attraction.category === "beach" ? "beach_access" : "explore"}
                    </span>
                  </div>

                  {/* Inline text tip */}
                  <div className="absolute top-10 whitespace-nowrap bg-slate-900 border border-white/10 shadow-lg text-white text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity z-30 pointer-events-none font-medium">
                    {attraction.name}
                  </div>
                </div>
              </button>
            );
          })}

          {/* Central Compass Icon */}
          <div className="absolute bottom-4 right-4 text-white/20 select-none">
            <span className="material-symbols-outlined text-4xl transform rotate-45">
              explore
            </span>
          </div>
        </div>

        {/* Selected Location Details Sidebar (interactive detail panel) */}
        <div className="lg:col-span-4 flex flex-col justify-between bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[32px] p-6 shadow-lg min-h-[450px]">
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white/40 mb-4">
              Location details
            </h4>

            {selectedPin ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <h5 className="font-bold text-white text-base leading-snug">
                    {selectedPin.name}
                  </h5>
                  <span
                    className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full border ${
                      selectedPin.status === "OPEN"
                        ? "text-[#0EA5E9] bg-[#0EA5E9]/10 border-[#0EA5E9]/20"
                        : "text-rose-400 bg-rose-500/10 border-rose-500/20"
                    }`}
                  >
                    {selectedPin.status}
                  </span>
                </div>

                <div className="flex flex-col gap-2 bg-white/[0.02] p-4 rounded-2xl border border-white/5 text-xs">
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-white/40">Crowd Density</span>
                    <span className={`font-semibold ${
                      selectedPin.volume.includes("High") ? "text-amber-400 font-bold" :
                      selectedPin.volume.includes("Low") ? "text-emerald-400 font-bold" : "text-white"
                    }`}>{selectedPin.volume}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-white/40">Category</span>
                    <span className="font-semibold capitalize text-white">
                      {selectedPin.category}
                    </span>
                  </div>
                </div>

                <div>
                  <h6 className="text-[11px] font-bold text-white/40 uppercase tracking-wide mb-1">
                    Live Crowd Insight
                  </h6>
                  <p className="text-xs text-white/80 leading-relaxed">
                    {selectedPin.statusRationale || 
                      "Attraction is operating normal hours. Real-time visitor counts indicate average transit queue speeds across main ticket gates."}
                  </p>
                </div>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center text-white/40">
                <span className="material-symbols-outlined text-4xl mb-3 animate-bounce">
                  touch_app
                </span>
                <p className="text-xs font-medium max-w-[200px]">
                  Click any landmark marker pin on the map canvas to inspect live visitor volumes.
                </p>
              </div>
            )}
          </div>

          <div className="border-t border-white/10 pt-4 mt-6 text-xs text-white/40">
            <p className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm text-[#0EA5E9]">info</span>
              Volume alerts updated every 15 mins.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
