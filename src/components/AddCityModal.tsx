import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface AddCityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCity: (cityName: string) => Promise<boolean>;
}

export default function AddCityModal({
  isOpen,
  onClose,
  onAddCity,
}: AddCityModalProps) {
  const [cityName, setCityName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cityName.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const success = await onAddCity(cityName.trim());
      if (success) {
        setCityName("");
        onClose();
      } else {
        setError("Could not load weather data for this city. Please try another.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#080B13]/85 backdrop-blur-sm"
        ></motion.div>

        {/* Modal content card */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          className="bg-[#0D121F]/90 backdrop-blur-xl border border-white/10 w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl relative z-10 p-6 flex flex-col gap-5 text-white"
        >
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-bold text-white">Add New Destination</h3>
              <p className="text-xs text-white/50 mt-0.5">
                Explore local weather trends and active visitor volumes globally
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-white/10 text-white/50 hover:text-white rounded-full transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="cityNameInput"
                className="text-xs font-bold uppercase tracking-wider text-white/40"
              >
                City Name
              </label>
              <input
                id="cityNameInput"
                type="text"
                value={cityName}
                onChange={(e) => setCityName(e.target.value)}
                disabled={loading}
                autoFocus
                placeholder="e.g. Paris, Tokyo, Sydney"
                className="w-full bg-white/5 border border-white/10 focus:border-[#0EA5E9] focus:ring-1 focus:ring-[#0EA5E9] text-sm text-white placeholder-white/30 font-medium py-3 px-4 rounded-2xl focus:outline-none transition-colors"
              />
            </div>

            {/* Error alerts */}
            {error && (
              <div className="bg-rose-500/10 text-rose-300 p-3 rounded-xl text-xs font-medium flex items-start gap-2 border border-rose-500/20">
                <span className="material-symbols-outlined text-sm mt-0.5">error</span>
                <span>{error}</span>
              </div>
            )}

            {/* Suggestions */}
            <div className="flex flex-col gap-1.5 mt-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">
                Popular Quick Starts
              </span>
              <div className="flex flex-wrap gap-2">
                {["Tokyo", "London", "New York", "Paris"].map((city) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => setCityName(city)}
                    disabled={loading}
                    className="bg-white/5 hover:bg-white/10 text-[#0EA5E9] text-xs font-semibold px-3 py-1.5 rounded-full border border-white/5 hover:border-white/10 transition-colors cursor-pointer"
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 text-sm text-white/60 hover:bg-white/5 hover:text-white rounded-full font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !cityName.trim()}
                className="bg-[#0EA5E9] hover:bg-[#0284c7] text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-[0_0_15px_rgba(14,165,233,0.3)] transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Generating...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-sm">bolt</span>
                    Analyze City
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
