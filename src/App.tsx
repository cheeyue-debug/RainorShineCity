import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CityWeatherData } from "./types";
import Sidebar from "./components/Sidebar";
import MapView from "./components/MapView";
import FavoritesView from "./components/FavoritesView";
import HistoryView from "./components/HistoryView";
import AddCityModal from "./components/AddCityModal";

// Stock high-res fallbacks for categories if needed
const categoryImages: { [key: string]: string } = {
  skyline: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=150&h=150&fit=crop",
  garden: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=150&h=150&fit=crop",
  temple: "https://images.unsplash.com/photo-1528164344705-47542687000d?w=150&h=150&fit=crop",
  museum: "https://images.unsplash.com/photo-1580136579312-94651dfd596d?w=150&h=150&fit=crop",
  zoo: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=150&h=150&fit=crop",
  park: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=150&h=150&fit=crop",
  monument: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=150&h=150&fit=crop",
  beach: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=150&h=150&fit=crop",
  landmark: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=150&h=150&fit=crop"
};

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [cityData, setCityData] = useState<CityWeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<CityWeatherData[]>([]);
  const [history, setHistory] = useState<Array<{ timestamp: string; cityData: CityWeatherData }>>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [alertClosed, setAlertClosed] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  // Initial load
  useEffect(() => {
    fetchCityWeather("Singapore", true);
  }, []);

  const fetchCityWeather = async (cityName: string, addToHistory = true): Promise<boolean> => {
    setLoading(true);
    try {
      const res = await fetch("/api/weather", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city: cityName }),
      });
      if (!res.ok) {
        throw new Error("Failed to fetch weather data");
      }
      const data: CityWeatherData = await res.json();
      setCityData(data);
      setAlertClosed(false);

      if (addToHistory) {
        const now = new Date();
        const timestamp = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        setHistory((prev) => [
          { timestamp, cityData: data },
          ...prev.filter((h) => h.cityData.cityName.toLowerCase() !== data.cityName.toLowerCase()),
        ]);
      }
      return true;
    } catch (err) {
      console.error("Error fetching city weather:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    fetchCityWeather(searchQuery.trim());
    setSearchQuery("");
    setActiveTab("dashboard");
  };

  const handleSelectCity = (cityName: string) => {
    fetchCityWeather(cityName, true);
    setActiveTab("dashboard");
  };

  const handleRemoveFavorite = (cityName: string) => {
    setFavorites((prev) =>
      prev.filter((fav) => fav.cityName.toLowerCase() !== cityName.toLowerCase())
    );
  };

  const isStarred = cityData
    ? favorites.some((fav) => fav.cityName.toLowerCase() === cityData.cityName.toLowerCase())
    : false;

  const toggleStar = () => {
    if (!cityData) return;
    if (isStarred) {
      handleRemoveFavorite(cityData.cityName);
    } else {
      setFavorites((prev) => [...prev, cityData]);
    }
  };

  const handleShareClick = () => {
    if (!cityData) return;
    const url = `${window.location.origin}?city=${encodeURIComponent(cityData.cityName)}`;
    navigator.clipboard.writeText(url);
    setShareSuccess(true);
    setTimeout(() => setShareSuccess(false), 2500);
  };

  return (
    <div className="flex min-h-screen text-white bg-[#080B13] relative overflow-hidden font-sans select-none" id="app-root">
      {/* Background Glowing Blur Bubbles (Immersive UI theme) */}
      <div className="absolute top-[-200px] right-[-100px] w-[600px] h-[600px] bg-[#0EA5E9] rounded-full blur-[160px] opacity-20 pointer-events-none"></div>
      <div className="absolute bottom-[-150px] left-[-100px] w-[500px] h-[500px] bg-[#6366F1] rounded-full blur-[140px] opacity-20 pointer-events-none"></div>
      <div className="absolute top-[20%] left-[10%] w-[300px] h-[300px] bg-[#A855F7] rounded-full blur-[120px] opacity-10 pointer-events-none"></div>

      {/* SideNavBar (Desktop Only) */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        favoritesCount={favorites.length}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:ml-64 w-full relative z-10" id="main-layout">
        {/* TopNavBar */}
        <header
          id="top-nav-bar"
          className="flex justify-between items-center w-full px-4 md:px-8 h-16 sticky top-0 z-30 bg-[#080B13]/40 backdrop-blur-md border-b border-white/10"
        >
          {/* Mobile Title (Hidden on Desktop) */}
          <div className="md:hidden flex items-center gap-2" id="mobile-brand">
            <span className="text-xl font-bold text-[#0EA5E9]">SkyGuide</span>
          </div>

          {/* Search bar form */}
          <form
            onSubmit={handleSearchSubmit}
            id="search-form"
            className="hidden md:flex flex-1 max-w-md relative"
          >
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40">
              search
            </span>
            <input
              id="search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for a city..."
              className="w-full bg-white/5 border border-white/10 text-white placeholder-white/40 text-sm py-2 pl-11 pr-4 rounded-full focus:outline-none focus:border-[#0EA5E9] focus:ring-1 focus:ring-[#0EA5E9] transition-colors"
            />
          </form>

          {/* Quick suggestions on desktop for quick testing */}
          <div className="hidden lg:flex items-center gap-2 ml-4">
            {["Tokyo", "London", "New York"].map((c) => (
              <button
                key={c}
                onClick={() => handleSelectCity(c)}
                className="bg-white/5 hover:bg-white/10 text-white/80 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors cursor-pointer border border-white/5"
              >
                {c}
              </button>
            ))}
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3 md:gap-4 ml-auto" id="header-actions">
            {/* Mobile Search Button */}
            <button
              onClick={() => {
                const query = prompt("Enter a city to explore:");
                if (query) {
                  fetchCityWeather(query);
                  setActiveTab("dashboard");
                }
              }}
              className="md:hidden p-2 text-white/80 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
              aria-label="Search"
            >
              <span className="material-symbols-outlined">search</span>
            </button>

            {/* Notifications Button */}
            <button
              onClick={() => alert("All travel channels are operating with low delays.")}
              className="p-2 text-white/80 hover:bg-white/10 rounded-full transition-colors relative cursor-pointer"
              aria-label="Notifications"
            >
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-[#080B13]"></span>
            </button>

            {/* Settings Button */}
            <button
              onClick={() => alert("Settings panel will allow metric/imperial preferences.")}
              className="p-2 text-white/80 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
              aria-label="Settings"
            >
              <span className="material-symbols-outlined">settings</span>
            </button>

            {/* User Profile Headshot */}
            <img
              alt="User Headshot Profile"
              className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover border border-white/10 cursor-pointer hover:opacity-95 transition-opacity"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSNxHJQ5ShW5A4SExCvF0Oqm7dj9IXaof-29bx-Ao69JLbBkRTcIqTN-os1QQBenWB9EgjqYQ0bI1thh9C1J1PvUUY3K0eq3blJQx0DhHtAcArAA3QkBiTHl73_MNCEi-0vByxMublrA7sSdymcfEgakTwd1A1ZZhUeWvQ9e7nrVOs1LPMjC6M7EMm5HEn-hptZ1XQHVnc8IEaGzgJKH26LqK_tminXVDYZ8I-BGMwsSjBN5-wbQ5zcA"
            />
          </div>
        </header>

        {/* Dynamic Content Body */}
        <main className="flex-1 p-4 md:p-8 bg-transparent pb-24 md:pb-8" id="dashboard-body">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32" id="loading-spinner">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0059bb]"></div>
              <p className="text-sm font-semibold text-[#414754] mt-4">
                Analyzing destination weather & tourism guides...
              </p>
            </div>
          ) : (
            <div className="max-w-7xl mx-auto flex flex-col gap-6" id="view-router">
              {/* Active Tab Router */}
              {activeTab === "favorites" ? (
                <FavoritesView
                  favorites={favorites}
                  onSelectCity={handleSelectCity}
                  onRemoveFavorite={handleRemoveFavorite}
                  onNavigateToDashboard={() => setActiveTab("dashboard")}
                />
              ) : activeTab === "map" ? (
                <MapView cityData={cityData} />
              ) : activeTab === "history" ? (
                <HistoryView
                  history={history}
                  onSelectCity={handleSelectCity}
                  onClearHistory={() => setHistory([])}
                  onNavigateToDashboard={() => setActiveTab("dashboard")}
                />
              ) : (
                /* Primary Dashboard View */
                cityData && (
                  <div className="flex flex-col gap-6" id="weather-dashboard-view">
                    {/* Page Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
                      <div>
                        <div className="flex items-center gap-3">
                          <h2 className="text-2xl font-extrabold text-white tracking-tight">
                            {cityData.cityName} Weather & Tourism
                          </h2>

                          {/* Star favorite toggle */}
                          <button
                            onClick={toggleStar}
                            className="p-1 hover:bg-white/10 rounded-full text-amber-400 hover:scale-105 transition-all cursor-pointer"
                            title={isStarred ? "Remove from favorites" : "Pin to favorites"}
                          >
                            <span className={`material-symbols-outlined text-2xl ${isStarred ? "fill text-amber-400" : "text-white/60"}`}>
                              star
                            </span>
                          </button>
                        </div>
                        <p className="text-xs text-white/50 flex items-center gap-1.5 mt-1.5 font-medium">
                          <span className="material-symbols-outlined text-sm">schedule</span>
                          <span>{cityData.localTime}</span>
                        </p>
                      </div>

                      <div className="flex gap-2 relative">
                        <button
                          onClick={handleShareClick}
                          className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs text-white/80 hover:bg-white/10 transition-colors flex items-center gap-2 font-semibold cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-xs">share</span>
                          Share
                        </button>

                        {/* Copy Success Popover */}
                        <AnimatePresence>
                          {shareSuccess && (
                            <motion.div
                              initial={{ opacity: 0, y: 10, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 10, scale: 0.95 }}
                              className="absolute right-0 bottom-11 bg-white/10 backdrop-blur-md text-white border border-white/10 text-[11px] font-bold py-1.5 px-3 rounded-lg shadow-md whitespace-nowrap z-30"
                            >
                              Copied dashboard link!
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* Active Advisory Alert Warning Banner */}
                    {cityData.alert && cityData.alert.title && !alertClosed && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="bg-amber-950/60 text-amber-200 rounded-xl p-4 flex items-start gap-4 shadow-sm border border-amber-500/20 backdrop-blur-md"
                        id="advisory-warning-banner"
                      >
                        <span className="material-symbols-outlined text-amber-400 text-xl mt-0.5 fill">
                          warning
                        </span>
                        <div className="flex-1">
                          <h3 className="text-sm font-bold tracking-wide text-amber-200">
                            {cityData.alert.title}
                          </h3>
                          <p className="text-xs text-amber-200/85 leading-relaxed mt-1">
                            {cityData.alert.message}
                          </p>
                        </div>
                        <button
                          onClick={() => setAlertClosed(true)}
                          className="text-amber-300 hover:text-amber-100 transition-colors cursor-pointer"
                          aria-label="Dismiss alert"
                        >
                          <span className="material-symbols-outlined text-lg">close</span>
                        </button>
                      </motion.div>
                    )}

                    {/* Bento Grid Layout (Columns: 8 left, 4 right) */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="dashboard-bento-grid">
                      {/* Left Side: Real-time Weather Hero + 5 Day forecast */}
                      <div className="lg:col-span-8 flex flex-col bg-white/[0.03] backdrop-blur-xl rounded-[32px] border border-white/10 shadow-lg overflow-hidden relative">
                        {/* Background Graphic overlay */}
                        <div className="absolute inset-0 opacity-10 pointer-events-none bg-gradient-to-tr from-[#0EA5E9] to-transparent"></div>

                        {/* Top: Current Conditions Hero */}
                        <div className="p-6 md:p-8 flex-1 flex flex-col justify-between relative z-10">
                          <div className="flex justify-between items-start gap-4 mb-8">
                            <div>
                              <h3 className="text-xs font-bold uppercase tracking-wider text-white/40">
                                CURRENT CONDITIONS
                              </h3>
                              <div className="flex items-center gap-6 mt-4">
                                <div className="text-[70px] md:text-[90px] font-thin leading-none tracking-tighter text-white flex items-start">
                                  <span>{cityData.temperature}</span>
                                  <span className="text-3xl md:text-4xl mt-3 opacity-50">°C</span>
                                </div>
                                <div className="flex flex-col">
                                  <span className="material-symbols-outlined text-4xl text-[#0EA5E9] fill">
                                    {cityData.conditionIcon || "partly_cloudy_day"}
                                  </span>
                                  <span className="text-lg font-light text-white/80 mt-1">
                                    {cityData.condition}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Dynamic Air Quality chip */}
                            <span className="bg-white/5 border border-white/10 backdrop-blur-md text-white text-[11px] font-medium px-4 py-2 rounded-full flex items-center gap-1.5 shadow-sm">
                              <span className="material-symbols-outlined text-xs text-[#0EA5E9]">air</span>
                              Air Quality: {cityData.airQuality}
                            </span>
                          </div>

                          {/* Weather Auxiliary Metrics Grid */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                            <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl flex items-center gap-3 hover:bg-white/[0.04] transition-colors">
                              <span className="material-symbols-outlined text-[#0EA5E9] text-2xl">
                                water_drop
                              </span>
                              <div>
                                <p className="text-[10px] uppercase font-bold text-white/40 tracking-wider">
                                  Humidity
                                </p>
                                <p className="text-sm font-semibold text-white">
                                  {cityData.humidity}%
                                </p>
                              </div>
                            </div>

                            <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl flex items-center gap-3 hover:bg-white/[0.04] transition-colors">
                              <span className="material-symbols-outlined text-[#0EA5E9] text-2xl">
                                air
                              </span>
                              <div>
                                <p className="text-[10px] uppercase font-bold text-white/40 tracking-wider">
                                  Wind
                                </p>
                                <p className="text-sm font-semibold text-white">
                                  {cityData.windSpeed} km/h
                                </p>
                              </div>
                            </div>

                            <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl flex items-center gap-3 hover:bg-white/[0.04] transition-colors">
                              <span className="material-symbols-outlined text-[#0EA5E9] text-2xl">
                                thermostat
                              </span>
                              <div>
                                <p className="text-[10px] uppercase font-bold text-white/40 tracking-wider">
                                  Feels Like
                                </p>
                                <p className="text-sm font-semibold text-white">
                                  {cityData.feelsLike}°C
                                </p>
                              </div>
                            </div>

                            <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl flex items-center gap-3 hover:bg-white/[0.04] transition-colors">
                              <span className="material-symbols-outlined text-[#0EA5E9] text-2xl">
                                visibility
                              </span>
                              <div>
                                <p className="text-[10px] uppercase font-bold text-white/40 tracking-wider">
                                  Visibility
                                </p>
                                <p className="text-sm font-semibold text-white">
                                  {cityData.visibility} km
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Bottom: 5-Day outlook integrated footer */}
                        <div className="bg-white/[0.02] border-t border-white/10 p-5 md:px-8">
                          <h4 className="text-[11px] font-bold text-white/40 uppercase tracking-wider mb-4">
                            5-DAY OUTLOOK
                          </h4>
                          <div className="flex justify-between items-center gap-2">
                            {cityData.forecast.map((forecastDay, idx) => (
                              <div
                                key={`${forecastDay.day}-${idx}`}
                                className="flex flex-col items-center flex-1"
                              >
                                <span className="text-xs font-semibold text-white/50">
                                  {forecastDay.day}
                                </span>
                                <span className="material-symbols-outlined text-[#0EA5E9] text-xl my-2 fill">
                                  {forecastDay.condition}
                                </span>
                                <span className="text-sm font-bold text-white">
                                  {forecastDay.temp}°
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Right Side: Tourism Attraction Panel */}
                      <div className="lg:col-span-4 flex flex-col bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[32px] p-6 justify-between min-h-[480px]">
                        <div>
                          <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-extrabold text-white tracking-tight">
                              Top Attractions
                            </h3>
                            <button
                              onClick={() => setActiveTab("map")}
                              className="text-xs font-semibold text-[#0EA5E9] hover:text-sky-300 transition-colors cursor-pointer"
                            >
                              View Map
                            </button>
                          </div>

                          {/* Attraction listing */}
                          <div className="flex flex-col gap-4">
                            {cityData.attractions.map((attraction, index) => {
                              const isClosed = attraction.status === "CLOSED";
                              const isHighVol = attraction.volume.toLowerCase().includes("high");
                              const isLowVol = attraction.volume.toLowerCase().includes("low");
                              const isModVol = attraction.volume.toLowerCase().includes("mod");
                              const imageUrl =
                                attraction.imageUrl ||
                                categoryImages[attraction.category] ||
                                categoryImages.landmark;

                              return (
                                <div key={attraction.name} className="flex flex-col gap-4">
                                  {index > 0 && <div className="h-px bg-white/10 w-full" />}
                                  <div
                                    onClick={() => setActiveTab("map")}
                                    className={`flex items-center gap-4 p-2.5 rounded-2xl hover:bg-white/5 cursor-pointer group transition-all border border-transparent hover:border-white/10 ${
                                      isClosed ? "opacity-60" : ""
                                    }`}
                                  >
                                    <div className="relative">
                                      <img
                                        src={imageUrl}
                                        alt={attraction.name}
                                        className={`w-16 h-16 rounded-xl object-cover bg-white/10 border border-white/10 shadow-sm transition-all ${
                                          isClosed ? "grayscale opacity-50" : ""
                                        }`}
                                      />
                                      {isClosed && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-xl">
                                          <span className="material-symbols-outlined text-white text-base">
                                            build
                                          </span>
                                        </div>
                                      )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                      <h4
                                        className={`font-medium text-sm truncate group-hover:text-[#0EA5E9] transition-colors ${
                                          isClosed ? "text-white/40 line-through decoration-white/40" : "text-white"
                                        }`}
                                      >
                                        {attraction.name}
                                      </h4>

                                      <div className="flex items-center gap-2 mt-1.5">
                                        <span
                                          className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                                            isClosed
                                              ? "bg-white/5 text-white/50"
                                              : "bg-[#0EA5E9]/10 text-[#0EA5E9] border border-[#0EA5E9]/20"
                                          }`}
                                        >
                                          {attraction.status}
                                        </span>

                                        {/* Dynamic Volume badges */}
                                        {isHighVol && (
                                          <span className="text-[11px] text-rose-400 font-semibold flex items-center gap-1">
                                            <span className="material-symbols-outlined text-sm">
                                              groups
                                            </span>
                                            High Vol
                                          </span>
                                        )}
                                        {isModVol && (
                                          <span className="text-[11px] text-white/60 font-semibold flex items-center gap-1">
                                            <span className="material-symbols-outlined text-sm">
                                              group
                                            </span>
                                            Mod Vol
                                          </span>
                                        )}
                                        {isLowVol && (
                                          <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                                            <span className="material-symbols-outlined text-sm">
                                              person
                                            </span>
                                            Low Vol
                                          </span>
                                        )}
                                        {isClosed && (
                                          <span className="text-[11px] text-white/40 font-medium italic flex items-center gap-1">
                                            Maintenance
                                          </span>
                                        )}
                                      </div>
                                    </div>

                                    <span className="material-symbols-outlined text-white/30 group-hover:text-[#0EA5E9] group-hover:translate-x-0.5 transition-all text-lg">
                                      chevron_right
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        <button
                          onClick={() => setActiveTab("map")}
                          className="w-full mt-6 py-2.5 border border-white/10 rounded-full text-xs font-semibold text-white/80 hover:bg-white/5 transition-all cursor-pointer text-center"
                        >
                          View All Attractions
                        </button>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </main>
      </div>

      {/* Bottom Navigation Bar (Mobile Only) */}
      <nav
        id="mobile-bottom-nav"
        className="md:hidden fixed bottom-0 left-0 w-full bg-[#080B13]/80 backdrop-blur-md border-t border-white/10 flex justify-around items-center h-16 z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.3)] pb-safe"
      >
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`flex flex-col items-center justify-center w-full h-full cursor-pointer ${
            activeTab === "dashboard" ? "text-[#0EA5E9]" : "text-white/40"
          }`}
        >
          <span className={`material-symbols-outlined text-xl ${activeTab === "dashboard" ? "fill text-[#0EA5E9]" : ""}`}>
            dashboard
          </span>
          <span className="text-[10px] font-bold mt-1">Dashboard</span>
        </button>

        <button
          onClick={() => setActiveTab("favorites")}
          className={`flex flex-col items-center justify-center w-full h-full cursor-pointer ${
            activeTab === "favorites" ? "text-[#0EA5E9]" : "text-white/40"
          }`}
        >
          <span className={`material-symbols-outlined text-xl ${activeTab === "favorites" ? "fill text-[#0EA5E9]" : ""}`}>
            star
          </span>
          <span className="text-[10px] font-bold mt-1">Favorites</span>
        </button>

        <button
          onClick={() => setActiveTab("map")}
          className={`flex flex-col items-center justify-center w-full h-full cursor-pointer ${
            activeTab === "map" ? "text-[#0EA5E9]" : "text-white/40"
          }`}
        >
          <span className={`material-symbols-outlined text-xl ${activeTab === "map" ? "fill text-[#0EA5E9]" : ""}`}>
            map
          </span>
          <span className="text-[10px] font-bold mt-1">Map</span>
        </button>

        <button
          onClick={() => setActiveTab("history")}
          className={`flex flex-col items-center justify-center w-full h-full cursor-pointer ${
            activeTab === "history" ? "text-[#0EA5E9]" : "text-white/40"
          }`}
        >
          <span className={`material-symbols-outlined text-xl ${activeTab === "history" ? "fill text-[#0EA5E9]" : ""}`}>
            history
          </span>
          <span className="text-[10px] font-bold mt-1">History</span>
        </button>
      </nav>

      {/* Add City Modal Dialog overlay */}
      <AddCityModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddCity={async (name) => {
          const success = await fetchCityWeather(name, true);
          if (success) setActiveTab("dashboard");
          return success;
        }}
      />
    </div>
  );
}
