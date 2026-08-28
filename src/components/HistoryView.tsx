import React from "react";
import { motion } from "motion/react";
import { CityWeatherData } from "../types";

interface HistoryItem {
  timestamp: string;
  cityData: CityWeatherData;
}

interface HistoryViewProps {
  history: HistoryItem[];
  onSelectCity: (cityName: string) => void;
  onClearHistory: () => void;
  onNavigateToDashboard: () => void;
}

export default function HistoryView({
  history,
  onSelectCity,
  onClearHistory,
  onNavigateToDashboard,
}: HistoryViewProps) {
  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white/[0.03] backdrop-blur-xl rounded-[32px] border border-white/10 shadow-lg text-center h-[400px]">
        <span className="material-symbols-outlined text-5xl text-white/40 mb-4">
          history
        </span>
        <h3 className="text-lg font-semibold text-white">No Search History</h3>
        <p className="text-sm text-white/60 mt-1 max-w-sm">
          Your travel search history is empty. Start exploring weather data across different cities!
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
    <div className="flex flex-col gap-6" id="history-view-container">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-white">Explore Logs</h3>
          <p className="text-xs text-white/50 mt-1">
            Browse and recall previously viewed destinations from your current browsing session
          </p>
        </div>
        <button
          onClick={onClearHistory}
          className="text-xs text-rose-400 hover:text-rose-300 font-semibold border border-rose-500/20 hover:bg-rose-500/10 px-4 py-2 rounded-full transition-all cursor-pointer"
        >
          Clear History
        </button>
      </div>

      {/* Vertical Timeline */}
      <div className="relative border-l border-white/10 pl-6 ml-4 flex flex-col gap-8 py-2" id="history-timeline">
        {history.map((item, index) => {
          const { cityData, timestamp } = item;
          return (
            <motion.div
              key={`${cityData.cityName}-${index}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="relative group"
            >
              {/* Point Node */}
              <span className="absolute -left-[31px] top-1.5 h-4 w-4 rounded-full border-2 border-[#0EA5E9] bg-[#080B13] group-hover:bg-[#0EA5E9] transition-colors z-10"></span>

              {/* Time flag */}
              <span className="text-[10px] font-semibold uppercase text-white/40 tracking-wider block mb-2">
                {timestamp}
              </span>

              {/* Interactive history card */}
              <div
                onClick={() => onSelectCity(cityData.cityName)}
                className="bg-white/[0.03] backdrop-blur-xl border border-white/10 hover:border-[#0EA5E9]/30 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-lg transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-white/5 h-10 w-10 rounded-lg flex items-center justify-center text-[#0EA5E9] border border-white/5">
                    <span className="material-symbols-outlined fill text-xl">
                      {cityData.conditionIcon || "partly_cloudy_day"}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm leading-tight">
                      {cityData.cityName}, {cityData.country}
                    </h4>
                    <p className="text-xs text-white/50 mt-0.5">
                      {cityData.condition} • Humidity: {cityData.humidity}%
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-auto">
                  <span className="text-xl font-black text-white">
                    {cityData.temperature}°C
                  </span>
                  <span className="material-symbols-outlined text-white/30 text-base group-hover:text-[#0EA5E9] transition-colors">
                    arrow_forward_ios
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
