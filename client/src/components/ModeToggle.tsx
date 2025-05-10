import { useState } from "react";
import { motion } from "framer-motion";

interface ModeToggleProps {
  onModeChange: (mode: "daily" | "special") => void;
  onTiffinToggle: (showTiffin: boolean) => void;
}

const ModeToggle = ({ onModeChange, onTiffinToggle }: ModeToggleProps) => {
  const [activeMode, setActiveMode] = useState<"daily" | "special">("daily");
  const [tiffinEnabled, setTiffinEnabled] = useState(false);

  const handleModeChange = (mode: "daily" | "special") => {
    setActiveMode(mode);
    onModeChange(mode);
  };

  const handleTiffinToggle = () => {
    setTiffinEnabled(!tiffinEnabled);
    onTiffinToggle(!tiffinEnabled);
  };

  return (
    <motion.div 
      className="bg-white shadow-md"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex mb-4 md:mb-0">
            <button 
              onClick={() => handleModeChange("daily")}
              className={`px-6 py-3 font-quicksand font-semibold rounded-l-lg ${
                activeMode === "daily" 
                  ? "bg-tomato-red text-white" 
                  : "bg-gray-200 text-charcoal"
              } transition-colors duration-200`}
            >
              <i className="fas fa-clock mr-2"></i>Daily Routine
            </button>
            <button 
              onClick={() => handleModeChange("special")}
              className={`px-6 py-3 font-quicksand font-semibold rounded-r-lg ${
                activeMode === "special" 
                  ? "bg-tomato-red text-white" 
                  : "bg-gray-200 text-charcoal"
              } transition-colors duration-200`}
            >
              <i className="fas fa-star mr-2"></i>Special Occasion
            </button>
          </div>
          
          <div className="flex items-center space-x-3">
            <span className="font-quicksand text-charcoal">Lunch Tiffin</span>
            <div className="relative inline-block w-12 mr-2 align-middle select-none">
              <input 
                type="checkbox" 
                name="toggle" 
                id="tiffin-toggle" 
                checked={tiffinEnabled}
                onChange={handleTiffinToggle}
                className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-gray-300 appearance-none cursor-pointer focus:outline-none transition-all duration-300 ease-in-out" 
              />
              <label 
                htmlFor="tiffin-toggle" 
                className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer transition-all duration-300 ease-in-out"
              ></label>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ModeToggle;
