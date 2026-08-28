import React from "react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAddModal: () => void;
  favoritesCount: number;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  onOpenAddModal,
  favoritesCount,
}: SidebarProps) {
  return (
    <aside
      id="side-nav-bar"
      className="hidden md:flex flex-col h-full w-64 fixed left-0 top-0 bg-[#080B13]/60 backdrop-blur-xl border-r border-white/10 py-8 px-4 gap-4 z-40"
    >
      {/* Brand Header */}
      <div className="flex items-center gap-4 mb-8 px-2" id="sidebar-header">
        <img
          id="sidebar-brand-logo"
          className="w-12 h-12 rounded-full object-cover shadow-sm bg-white/10 border border-white/10"
          alt="City Explorer Logo"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuA4po9TQE-LrrYzZNYVBl1HLCJ6kFvV5BIN8nFP4z7k6XZV_CxYuC3TeMcLouYtzwcniMAnwttVB-VCohobDEDVbwE2VtXRqa4U_boli1srQ2LVLWOjhqk2hGse5sBp-vXmOc1k3dcqr1Lje7v6mnLNO_F8YVvyl1LIVCLiMzsJSVe4Dye7MbWz3wF0YvmHP4RCzTLoHmT6I-irU_J6JqxfZ2hob8gfQmobtvB0PCRLCYwhhYfT-oP8TQ"
        />
        <div>
          <h1 className="font-semibold text-white text-base leading-tight">
            City Explorer
          </h1>
          <p className="text-[11px] text-white/50 font-medium leading-none mt-1">
            Local Weather & Tourism
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav className="flex-1 flex flex-col gap-2" id="sidebar-nav">
        {/* Dashboard */}
        <button
          id="tab-dashboard"
          onClick={() => setActiveTab("dashboard")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-full transition-all duration-150 group text-left cursor-pointer border ${
            activeTab === "dashboard"
              ? "bg-white/10 text-white border-white/10 font-semibold"
              : "text-white/60 hover:bg-white/5 hover:text-white border-transparent"
          }`}
        >
          <span className={`material-symbols-outlined ${activeTab === "dashboard" ? "fill text-[#0EA5E9]" : "text-white/40 group-hover:text-white/80"}`}>
            dashboard
          </span>
          <span className="text-sm">Dashboard</span>
        </button>

        {/* Favorites */}
        <button
          id="tab-favorites"
          onClick={() => setActiveTab("favorites")}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-full transition-all duration-150 group cursor-pointer border ${
            activeTab === "favorites"
              ? "bg-white/10 text-white border-white/10 font-semibold"
              : "text-white/60 hover:bg-white/5 hover:text-white border-transparent"
          }`}
        >
          <div className="flex items-center gap-3">
            <span className={`material-symbols-outlined ${activeTab === "favorites" ? "fill text-[#0EA5E9]" : "text-white/40 group-hover:text-white/80"}`}>
              star
            </span>
            <span className="text-sm">Favorites</span>
          </div>
          {favoritesCount > 0 && (
            <span className="bg-[#0EA5E9] text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
              {favoritesCount}
            </span>
          )}
        </button>

        {/* Map */}
        <button
          id="tab-map"
          onClick={() => setActiveTab("map")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-full transition-all duration-150 group text-left cursor-pointer border ${
            activeTab === "map"
              ? "bg-white/10 text-white border-white/10 font-semibold"
              : "text-white/60 hover:bg-white/5 hover:text-white border-transparent"
          }`}
        >
          <span className={`material-symbols-outlined ${activeTab === "map" ? "fill text-[#0EA5E9]" : "text-white/40 group-hover:text-white/80"}`}>
            map
          </span>
          <span className="text-sm">Map</span>
        </button>

        {/* History */}
        <button
          id="tab-history"
          onClick={() => setActiveTab("history")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-full transition-all duration-150 group text-left cursor-pointer border ${
            activeTab === "history"
              ? "bg-white/10 text-white border-white/10 font-semibold"
              : "text-white/60 hover:bg-white/5 hover:text-white border-transparent"
          }`}
        >
          <span className={`material-symbols-outlined ${activeTab === "history" ? "fill text-[#0EA5E9]" : "text-white/40 group-hover:text-white/80"}`}>
            history
          </span>
          <span className="text-sm">History</span>
        </button>
      </nav>

      {/* CTA Button */}
      <button
        id="sidebar-add-city-btn"
        onClick={onOpenAddModal}
        className="w-full bg-[#0EA5E9] hover:bg-[#0284c7] text-white text-sm font-semibold py-3 rounded-full transition-all shadow-[0_0_15px_rgba(14,165,233,0.3)] cursor-pointer"
      >
        Add New City
      </button>

      {/* Footer Navigation items */}
      <div className="flex flex-col gap-1 mt-4 pt-4 border-t border-white/10" id="sidebar-footer">
        <button
          id="sidebar-help-btn"
          onClick={() => alert("City Explorer Help: Use the search bar above to look up any city globally. Pinned favorites allow quick switching. Click tourist sights to view crowd levels.")}
          className="w-full flex items-center gap-3 px-4 py-2 text-white/60 hover:bg-white/5 hover:text-white rounded-full transition-all text-left cursor-pointer"
        >
          <span className="material-symbols-outlined text-base text-white/40">help</span>
          <span className="text-xs font-medium">Help</span>
        </button>
        <button
          id="sidebar-feedback-btn"
          onClick={() => {
            const fb = prompt("We value your feedback! Tell us what you think of City Explorer:");
            if (fb) alert("Thank you for your valuable feedback!");
          }}
          className="w-full flex items-center gap-3 px-4 py-2 text-white/60 hover:bg-white/5 hover:text-white rounded-full transition-all text-left cursor-pointer"
        >
          <span className="material-symbols-outlined text-base text-white/40">feedback</span>
          <span className="text-xs font-medium">Feedback</span>
        </button>
      </div>
    </aside>
  );
}
