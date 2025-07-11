import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
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
  const { day: autoDay, timeOfDay: autoTimeOfDay } = useCurrentDateTime();
  const { user } = useAuth();
  const [mode, setMode] = useState<"daily" | "special">("daily");
  const [showTiffin, setShowTiffin] = useState(false);
  const [activeFilters, setActiveFilters] = useState<DishTag[]>([]);
  const [selectedOccasion, setSelectedOccasion] = useState<string | undefined>();
  const [familySize, setFamilySize] = useState<number>(4);
  const [authPromptOpen, setAuthPromptOpen] = useState(false);
  const [authPromptReason, setAuthPromptReason] = useState<'filter' | 'tiffin' | 'favorite' | 'occasion'>('filter');
  const [manualTimeOfDay, setManualTimeOfDay] = useState<string>("auto");
  
  // Create a ref for the suggestions section to scroll to
  const suggestionsRef = useRef<HTMLDivElement>(null);
  
  // Use either manual or auto time of day
  const timeOfDay = manualTimeOfDay === "auto" ? autoTimeOfDay : manualTimeOfDay;
  const day = autoDay;
  
  // Check if user has already seen the prompt and chosen to continue as guest
  const hasGuestAccess = typeof window !== 'undefined' && localStorage.getItem('guestAccess') === 'true';
  
  // Get context based on day and time
  const { contextTitle, contextDescription } = getDayAndMealContext(day, timeOfDay);
  
  // Function to scroll to suggestions
  const scrollToSuggestions = () => {
    if (suggestionsRef.current) {
      setTimeout(() => {
        suggestionsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100); // Small delay to ensure content has rendered
    }
  };
  
  const showAuthPromptIfNeeded = (reason: 'filter' | 'tiffin' | 'favorite' | 'occasion') => {
    // If user is authenticated or has already chosen to continue as guest, don't show prompt
    if (user || hasGuestAccess) return false;
    
    setAuthPromptReason(reason);
    setAuthPromptOpen(true);
    return true;
  };
  
  const handleModeChange = (newMode: "daily" | "special") => {
    // If switching to special mode, prompt for auth
    if (newMode === "special" && !user && !hasGuestAccess) {
      showAuthPromptIfNeeded('occasion');
      return;
    }
    
    setMode(newMode);
    if (newMode === "daily") {
      setSelectedOccasion(undefined);
    }
    
    // Removed auto-scrolling from mode change
  };
  
  const handleTiffinToggle = (tiffinEnabled: boolean) => {
    // First interaction point - prompt for auth
    if (tiffinEnabled && !showTiffin && !user && !hasGuestAccess) {
      showAuthPromptIfNeeded('tiffin');
      return;
    }
    
    setShowTiffin(tiffinEnabled);
  };
  
  const handleFilterChange = (filters: DishTag[]) => {
    // If adding filters and not already authenticated, prompt
    if (filters.length > 0 && activeFilters.length === 0 && !user && !hasGuestAccess) {
      showAuthPromptIfNeeded('filter');
      return;
    }
    
    setActiveFilters(filters);
  };
  
  const handleOccasionSelect = (occasion: string) => {
    // Occasion selection requires auth
    if (!user && !hasGuestAccess) {
      showAuthPromptIfNeeded('occasion');
      return;
    }
    
    setSelectedOccasion(occasion);
    
    // Scroll to suggestions when occasion is selected
    scrollToSuggestions();
  };

  const handleFamilySizeChange = (size: number) => {
    setFamilySize(size);
  };
  
  const handleTimeOfDayChange = (time: string) => {
    setManualTimeOfDay(time);
  };
  
  const handleCloseAuthPrompt = () => {
    setAuthPromptOpen(false);
  };

  return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-background"
      >
        <Header />
        
        <div className="pt-6">
          <ModernModeToggle 
            onModeChange={handleModeChange} 
            onTiffinToggle={handleTiffinToggle}
            familySize={familySize}
            onFamilySizeChange={handleFamilySizeChange}
            onTimeChange={handleTimeOfDayChange}
          />
          
          <ModernFilterBar onFilterChange={handleFilterChange} />
          
          <ModernContextualHeader 
            mode={mode}
            day={day}
            timeOfDay={timeOfDay}
            dailyContext={{
              title: contextTitle,
              description: contextDescription
            }}
            specialContext={{
              onOccasionSelect: handleOccasionSelect
            }}
          />
          
          {/* Added ref to the suggestions grid for scrolling */}
          <div ref={suggestionsRef}>
          <ModernSuggestionGrid 
            mode={mode}
            day={day}
            timeOfDay={timeOfDay}
            showTiffin={showTiffin}
            activeFilters={activeFilters}
            selectedOccasion={selectedOccasion}
          />
          </div>
        </div>
        
        <ModernFooter />

        {/* Auth prompt dialog */}
        <AuthPrompt 
          isOpen={authPromptOpen}
          onClose={handleCloseAuthPrompt}
          reason={authPromptReason}
        />
      </motion.div>
  );
};

export default ModernHome;