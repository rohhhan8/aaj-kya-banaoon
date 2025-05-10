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

  return (
    <motion.div 
      className="container mx-auto px-4 py-4"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="bg-white dark:bg-slate-800 shadow-lg rounded-xl p-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <Tabs 
              defaultValue="daily" 
              value={activeMode}
              onValueChange={handleModeChange}
              className="w-full md:w-auto"
            >
              <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="daily" className="font-quicksand">
                  <motion.div 
                    className="flex items-center gap-2" 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <i className="fas fa-clock text-saffron dark:text-marigold"></i>
                    <span>Daily Routine</span>
                  </motion.div>
                </TabsTrigger>
                <TabsTrigger value="special" className="font-quicksand">
                  <motion.div 
                    className="flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <i className="fas fa-star text-saffron dark:text-marigold"></i>
                    <span>Special Occasion</span>
                  </motion.div>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            {/* Tiffin Toggle */}
            <div className="flex items-center space-x-2">
              <Switch 
                id="lunch-tiffin" 
                checked={tiffinEnabled}
                onCheckedChange={handleTiffinToggle}
              />
              <Label htmlFor="lunch-tiffin" className="font-quicksand text-charcoal dark:text-white">
                <div className="flex items-center gap-2">
                  <i className="fas fa-utensils text-sm text-saffron dark:text-marigold"></i>
                  <span>Lunch Tiffin</span>
                </div>
              </Label>
            </div>
            
            {/* Time of Day Selection */}
            <div className="flex items-center space-x-2">
              <Select value={selectedTime} onValueChange={handleTimeChange}>
                <SelectTrigger className="w-[140px] font-quicksand">
                  <SelectValue placeholder="Time of Day" />
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
            
            {/* Family Size Selector */}
            <FamilySizeSelector
              familySize={familySize}
              onChange={onFamilySizeChange}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ModernModeToggle;