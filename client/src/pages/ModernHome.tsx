import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import UserGreeting from "@/components/UserGreeting";
import ModernModeToggle from "@/components/ModernModeToggle";
import ModernFilterBar from "@/components/ModernFilterBar";
import ModernContextualHeader from "@/components/ModernContextualHeader";
import ModernSuggestionGrid from "@/components/ModernSuggestionGrid";
import ModernFooter from "@/components/ModernFooter";
import AuthPrompt from "@/components/AuthPrompt";
import ThemeToggle from "@/components/ThemeToggle";
import useCurrentDateTime from "@/hooks/useCurrentDateTime";
import { DishTag, getDayAndMealContext } from "@/lib/utils";
import { useAuth } from "@/lib/authContext";

const ModernHome = () => {
  const { day, timeOfDay } = useCurrentDateTime();
  const [mode, setMode] = useState<"daily" | "special">("daily");
  const [showTiffin, setShowTiffin] = useState(false);
  const [activeFilters, setActiveFilters] = useState<DishTag[]>([]);
  const [selectedOccasion, setSelectedOccasion] = useState<string | undefined>();
  const [familySize, setFamilySize] = useState<number>(4);
  
  // Get context based on day and time
  const { contextTitle, contextDescription } = getDayAndMealContext(day, timeOfDay);
  
  const handleModeChange = (newMode: "daily" | "special") => {
    setMode(newMode);
    if (newMode === "daily") {
      setSelectedOccasion(undefined);
    }
  };
  
  const handleTiffinToggle = (tiffinEnabled: boolean) => {
    setShowTiffin(tiffinEnabled);
  };
  
  const handleFilterChange = (filters: DishTag[]) => {
    setActiveFilters(filters);
  };
  
  const handleOccasionSelect = (occasion: string) => {
    setSelectedOccasion(occasion);
  };

  const handleFamilySizeChange = (size: number) => {
    setFamilySize(size);
  };

  return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-background"
      >
        <Header 
          familySize={familySize} 
          onFamilySizeChange={handleFamilySizeChange} 
        />
        
        <div className="pt-6">
          <UserGreeting 
            timeOfDay={timeOfDay}
            day={day}
          />
          
          <ModernModeToggle 
            onModeChange={handleModeChange} 
            onTiffinToggle={handleTiffinToggle} 
          />
          
          <ModernFilterBar onFilterChange={handleFilterChange} />
          
          <ModernContextualHeader 
            mode={mode}
            dailyContext={{
              title: contextTitle,
              description: contextDescription
            }}
            specialContext={{
              onOccasionSelect: handleOccasionSelect
            }}
          />
          
          <ModernSuggestionGrid 
            mode={mode}
            day={day}
            timeOfDay={timeOfDay}
            showTiffin={showTiffin}
            activeFilters={activeFilters}
            selectedOccasion={selectedOccasion}
          />
        </div>
        
        <ModernFooter />
      </motion.div>
  );
};

export default ModernHome;