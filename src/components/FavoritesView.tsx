import React from "react";
import { motion } from "motion/react";
import { CityWeatherData } from "../types";

interface FavoritesViewProps {
  favorites: CityWeatherData[];
  onSelectCity: (cityName: string) => void;
  onRemoveFavorite: (cityName: string) => void;
  onNavigateToDashboard: () => void;
}

export default function FavoritesView({
  favorites,
  onSelectCity,
  onRemoveFavorite,
  onNavigateToDashboard,
}: FavoritesViewProps) {
  if (favorites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white/[0.03] backdrop-blur-xl rounded-[32px] border border-white/10 shadow-lg text-center h-[400px]">
        <span className="material-symbols-outlined text-5xl text-white/40 mb-4">
          star_border
        </span>
        <h3 className="text-lg font-semibold text-white">No Favorites Pinned</h3>
        <p className="text-sm text-white/60 mt-1 max-w-sm">
          Pin cities to your favorites list from the main dashboard to monitor them at a glance.
        </p>
        <button
          onClick={onNavigateToDashboard}
          className="mt-6 bg-[#0EA5E9] hover:bg-[#0284c7] text-white text-xs font-semibold px-5 py-2.5 rounded-full transition-all shadow-[0_0_15px_rgba(14,165,233,0.3)] cursor-pointer"
        >
          Explore Weather
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6" id="favorites-view-container">
      <div>
        <h3 className="text-xl font-bold text-white">Pinned Destinations</h3>
        <p className="text-xs text-white/50 mt-1">
          Quickly switch between and compare weather stats for your favorite travel spots
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="favorites-grid">
        {favorites.map((city) => {
          return (
            <motion.div
              key={city.cityName}
              layoutId={`fav-${city.cityName}`}
              className="bg-white/[0.03] backdrop-blur-xl border border-white/10 hover:border-[#0EA5E9]/40 hover:shadow-lg rounded-2xl overflow-hidden transition-all duration-200 flex flex-col justify-between"
            >
              {/* Card Header & Main Temp */}
              <div className="p-5 flex-1 cursor-pointer" onClick={() => onSelectCity(city.cityName)}>
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <h4 className="font-bold text-white text-lg leading-tight">
                      {city.cityName}
                    </h4>
                    <p className="text-xs text-white/50 mt-0.5">{city.country}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveFavorite(city.cityName);
                    }}
                    className="p-1 text-amber-400 hover:text-white/85 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                    title="Remove from favorites"
                  >
                    <span className="material-symbols-outlined fill text-xl text-amber-400">star</span>
                  </button>
                </div>

                <div className="flex items-center gap-4 mt-6">
                  <span className="text-4xl font-extrabold text-white">
                    {city.temperature}°C
                  </span>
                  <div className="flex flex-col">
                    <span className="material-symbols-outlined text-[#0EA5E9] text-2xl fill">
                      {city.conditionIcon || "partly_cloudy_day"}
                    </span>
                    <span className="text-xs font-medium text-white/70">
                      {city.condition}
                    </span>
                  </div>
                </div>

                {/* Auxiliary Details */}
                <div className="grid grid-cols-2 gap-2 mt-6 pt-4 border-t border-white/10 text-xs">
                  <div className="flex flex-col">
                    <span className="text-white/40 text-[10px] uppercase font-semibold">Feels Like</span>
                    <span className="font-semibold text-white">{city.feelsLike}°C</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white/40 text-[10px] uppercase font-semibold">Air Quality</span>
                    <span className="font-semibold text-[#0EA5E9]">{city.airQuality}</span>
                  </div>
                </div>
              </div>

              {/* Card Footer Switch Action */}
              <div className="bg-white/[0.02] border-t border-white/10 px-5 py-3 flex justify-between items-center">
                <span className="text-[10px] font-medium text-white/40 truncate max-w-[150px]">
                  {city.localTime.split("•")[1] || "Local Time"}
                </span>
                <button
                  onClick={() => onSelectCity(city.cityName)}
                  className="text-xs text-[#0EA5E9] hover:text-sky-300 font-semibold flex items-center gap-0.5 cursor-pointer"
                >
                  View Details
                  <span className="material-symbols-outlined text-xs">arrow_forward</span>
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
