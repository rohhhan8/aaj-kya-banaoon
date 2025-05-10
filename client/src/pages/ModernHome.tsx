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
  const { user } = useAuth();
  const [mode, setMode] = useState<"daily" | "special">("daily");
  const [showTiffin, setShowTiffin] = useState(false);
  const [activeFilters, setActiveFilters] = useState<DishTag[]>([]);
  const [selectedOccasion, setSelectedOccasion] = useState<string | undefined>();
  const [familySize, setFamilySize] = useState<number>(4);
  const [authPromptOpen, setAuthPromptOpen] = useState(false);
  const [authPromptReason, setAuthPromptReason] = useState<'filter' | 'tiffin' | 'favorite' | 'occasion'>('filter');
  
  // Check if user has already seen the prompt and chosen to continue as guest
  const hasGuestAccess = typeof window !== 'undefined' && localStorage.getItem('guestAccess') === 'true';
  
  // Get context based on day and time
  const { contextTitle, contextDescription } = getDayAndMealContext(day, timeOfDay);
  
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
  };

  const handleFamilySizeChange = (size: number) => {
    setFamilySize(size);
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