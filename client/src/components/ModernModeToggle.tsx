import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import FamilySizeSelector from "./FamilySizeSelector";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface ModernModeToggleProps {
  onModeChange: (mode: "daily" | "special") => void;
  onTiffinToggle: (showTiffin: boolean) => void;
  familySize: number;
  onFamilySizeChange: (size: number) => void;
  onTimeChange?: (time: string) => void;
}

const ModernModeToggle = ({ 
  onModeChange, 
  onTiffinToggle, 
  familySize, 
  onFamilySizeChange,
  onTimeChange 
}: ModernModeToggleProps) => {
  const [activeMode, setActiveMode] = useState<"daily" | "special">("daily");
  const [tiffinEnabled, setTiffinEnabled] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string>("auto");
  const [vegOnly, setVegOnly] = useState(false);

  const handleModeChange = (value: string) => {
    const newMode = value as "daily" | "special";
    setActiveMode(newMode);
    onModeChange(newMode);
  };

  const handleTiffinToggle = (checked: boolean) => {
    setTiffinEnabled(checked);
    onTiffinToggle(checked);
  };
  
  const handleTimeChange = (value: string) => {
    setSelectedTime(value);
    if (onTimeChange) {
      onTimeChange(value);
    }
  };
  
  const handleVegToggle = (checked: boolean) => {
    setVegOnly(checked);
    // We would implement passing this to a parent component if needed
  };

  return (
    <motion.div 
      className="container mx-auto px-4 py-4"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="bg-white dark:bg-slate-800 shadow-lg rounded-xl p-6">
        {/* Main mode toggle */}
        <div className="mb-5">
          <div className="flex justify-center mb-1">
            <div className="p-2 rounded-full shadow-md flex gap-3">
              <motion.button
                className={`px-7 py-2.5 rounded-full font-quicksand flex items-center justify-center gap-3 transition-all duration-300 ease-in-out ${
                  activeMode === 'daily' 
                    ? 'bg-spice-brown dark:bg-teal-500 text-white font-medium shadow-md' 
                    : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300'
                }`}
                onClick={() => handleModeChange('daily')}
                whileTap={{ scale: 0.95 }}
                type="button"
              >
                <i className={`fas fa-calendar-day text-lg transition-colors duration-300 ${
                  activeMode === 'daily' ? 'text-white' : 'text-spice-brown dark:text-teal-400'
                }`}></i>
                <span>Daily Routine</span>
              </motion.button>
              
              <motion.button
                className={`px-7 py-2.5 rounded-full font-quicksand flex items-center justify-center gap-3 transition-all duration-300 ease-in-out ${
                  activeMode === 'special' 
                    ? 'bg-spice-brown dark:bg-teal-500 text-white font-medium shadow-md' 
                    : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300'
                }`}
                onClick={() => handleModeChange('special')}
                whileTap={{ scale: 0.95 }}
                type="button"
              >
                <i className={`fas fa-star text-lg transition-colors duration-300 ${
                  activeMode === 'special' ? 'text-white' : 'text-spice-brown dark:text-teal-400'
                }`}></i>
                <span>Special Occasion</span>
              </motion.button>
            </div>
          </div>
        </div>
        
        {/* Toggle options in a uniform grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {/* Time of Day Selection */}
          <div className="bg-cream/70 dark:bg-slate-700/50 rounded-lg p-3 shadow-sm">
            <div className="mb-1 text-xs text-charcoal/70 dark:text-white/70 font-medium">Time of Day</div>
            <Select value={selectedTime} onValueChange={handleTimeChange}>
              <SelectTrigger className="w-full border-none bg-transparent shadow-none font-quicksand">
                <div className="flex items-center gap-2">
                  <i className="fas fa-sun text-spice-brown dark:text-marigold"></i>
                  <SelectValue placeholder="Auto Detect" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">Auto Detect</SelectItem>
                <SelectItem value="Morning">Morning</SelectItem>
                <SelectItem value="Afternoon">Afternoon</SelectItem>
                <SelectItem value="Evening">Evening</SelectItem>
                <SelectItem value="Night">Night</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Family Size Selection - Compact version */}
          <div className="bg-cream/70 dark:bg-slate-700/50 rounded-lg p-3 shadow-sm">
            <div className="mb-1 text-xs text-charcoal/70 dark:text-white/70 font-medium">Family Size</div>
            <div className="flex items-center justify-between">
              <button 
                onClick={() => familySize > 1 && onFamilySizeChange(familySize - 1)}
                className="h-8 w-8 rounded-full bg-white dark:bg-slate-600 flex items-center justify-center text-charcoal dark:text-white"
              >
                <i className="fas fa-minus text-xs"></i>
              </button>
              
              <div className="flex items-center gap-2">
                <i className="fas fa-user-friends text-spice-brown dark:text-marigold"></i>
                <span className="font-quicksand font-medium text-lg">{familySize}</span>
                <span className="text-xs text-charcoal/70 dark:text-white/70">{familySize === 1 ? 'person' : 'people'}</span>
              </div>
              
              <button 
                onClick={() => familySize < 10 && onFamilySizeChange(familySize + 1)}
                className="h-8 w-8 rounded-full bg-white dark:bg-slate-600 flex items-center justify-center text-charcoal dark:text-white"
              >
                <i className="fas fa-plus text-xs"></i>
              </button>
            </div>
          </div>
          
          {/* Lunch Tiffin Toggle */}
          <div className="bg-cream/70 dark:bg-slate-700/50 rounded-lg p-3 shadow-sm">
            <div className="mb-1 text-xs text-charcoal/70 dark:text-white/70 font-medium">Lunch Options</div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <i className="fas fa-utensils text-spice-brown dark:text-marigold"></i>
                <span className="font-quicksand font-medium">Lunch Tiffin</span>
              </div>
              <Switch 
                id="lunch-tiffin" 
                checked={tiffinEnabled}
                onCheckedChange={handleTiffinToggle}
              />
            </div>
          </div>
          
          {/* Veg/Non-Veg Toggle */}
          <div className="bg-cream/70 dark:bg-slate-700/50 rounded-lg p-3 shadow-sm">
            <div className="mb-1 text-xs text-charcoal/70 dark:text-white/70 font-medium">Diet Preference</div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <i className="fas fa-leaf text-green-500 dark:text-green-400"></i>
                <span className="font-quicksand font-medium">Vegetarian Only</span>
              </div>
              <Switch 
                id="veg-only" 
                checked={vegOnly}
                onCheckedChange={handleVegToggle}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ModernModeToggle;