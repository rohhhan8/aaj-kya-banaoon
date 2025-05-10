import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import ModeToggle from "@/components/ModeToggle";
import FilterBar from "@/components/FilterBar";
import ContextualHeader from "@/components/ContextualHeader";
import SuggestionGrid from "@/components/SuggestionGrid";
import Footer from "@/components/Footer";
import useCurrentDateTime from "@/hooks/useCurrentDateTime";
import { DishTag, getDayAndMealContext } from "@/lib/utils";

const Home = () => {
  const { day, timeOfDay } = useCurrentDateTime();
  const [mode, setMode] = useState<"daily" | "special">("daily");
  const [showTiffin, setShowTiffin] = useState(false);
  const [activeFilters, setActiveFilters] = useState<DishTag[]>([]);
  const [selectedOccasion, setSelectedOccasion] = useState<string | undefined>();
  
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

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Header familySize={4} />
      
      <ModeToggle 
        onModeChange={handleModeChange} 
        onTiffinToggle={handleTiffinToggle} 
      />
      
      <FilterBar onFilterChange={handleFilterChange} />
      
      <ContextualHeader 
        mode={mode}
        dailyContext={{
          title: contextTitle,
          description: contextDescription
        }}
        specialContext={{
          onOccasionSelect: handleOccasionSelect
        }}
      />
      
      <SuggestionGrid 
        mode={mode}
        day={day}
        timeOfDay={timeOfDay}
        showTiffin={showTiffin}
        activeFilters={activeFilters}
        selectedOccasion={selectedOccasion}
      />
      
      <Footer />
    </motion.div>
  );
};

export default Home;
