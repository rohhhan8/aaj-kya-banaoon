import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ModernSuggestionCard from "./ModernSuggestionCard";
import LoadingSpinner from "./LoadingSpinner";
import { DishTag, DishSuggestion } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";
import { 
  Festival, 
  getFestivalById
  // getFestivalDishes removed as we will fetch from backend
} from "@/lib/festivalData";
import { useAuth } from "@/lib/authContext";

interface ModernSuggestionGridProps {
  mode: "daily" | "special";
  day: string;
  timeOfDay: string;
  showTiffin: boolean;
  activeFilters: DishTag[];
  selectedOccasion?: string;
}

const ModernSuggestionGrid = ({ 
  mode, 
  day, 
  timeOfDay, 
  showTiffin, 
  activeFilters,
  selectedOccasion 
}: ModernSuggestionGridProps) => {
  const { user } = useAuth();
  const [selectedFestival, setSelectedFestival] = useState<Festival | null>(null);

  // Effect to get festival details (name, image etc.) if selectedOccasion is a festival ID
  useEffect(() => {
    if (mode === 'special' && selectedOccasion) {
      const festival = getFestivalById(selectedOccasion);
      setSelectedFestival(festival || null);
    } else {
      setSelectedFestival(null);
    }
  }, [mode, selectedOccasion]);

  // Fetch suggestions based on mode (daily or special)
  const fetchDailySuggestions = async () => {
    const queryParams = new URLSearchParams({
      day,
      timeOfDay
    });
    
    if (activeFilters.length > 0) {
      queryParams.append('tags', activeFilters.join(','));
    }
    
    const res = await fetch(`/api/suggestions/daily?${queryParams.toString()}`);
    if (!res.ok) {
      throw new Error('Failed to fetch daily suggestions');
    }
    return res.json();
  };
  
  const fetchSpecialSuggestions = async () => {
    if (!selectedOccasion) return [];
    
    const queryParams = new URLSearchParams();
    if (activeFilters.length > 0) {
      queryParams.append('tags', activeFilters.join(','));
    }
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    const res = await fetch(`/api/suggestions/occasion/${selectedOccasion}${queryString}`);
    if (!res.ok) {
      throw new Error('Failed to fetch special suggestions');
    }
    return res.json();
  };
  
  const fetchTiffinSuggestions = async () => {
    const queryParams = new URLSearchParams({
      day,
      timeOfDay: 'Afternoon'
    });
    
    if (activeFilters.length > 0) {
      queryParams.append('tags', activeFilters.join(','));
    }
    
    const res = await fetch(`/api/suggestions/daily?${queryParams.toString()}`);
    if (!res.ok) {
      throw new Error('Failed to fetch tiffin suggestions');
    }
    return res.json();
  };
  
  // Queries
  const { 
    data: dailySuggestions = [], 
    isLoading: isLoadingDaily 
  } = useQuery({ 
    queryKey: ['/api/suggestions/daily', day, timeOfDay, activeFilters.join(',')],
    queryFn: fetchDailySuggestions,
    enabled: mode === 'daily'
  });
  
  const { 
    data: specialSuggestions = [], 
    isLoading: isLoadingSpecial 
  } = useQuery({ 
    queryKey: ['/api/suggestions/special', selectedOccasion, activeFilters.join(',')],
    queryFn: fetchSpecialSuggestions,
    enabled: mode === 'special' && !!selectedOccasion
  });
  
  const { 
    data: tiffinSuggestions = [], 
    isLoading: isLoadingTiffin 
  } = useQuery({ 
    queryKey: ['/api/suggestions/tiffin', day, activeFilters.join(',')],
    queryFn: fetchTiffinSuggestions,
    enabled: showTiffin
  });

  const handleSeeMore = (dish: DishSuggestion) => {
    // In a real app, this could navigate to a details page or show similar dishes
    console.log("See more like:", dish.name);
  };

  // Loading state
  if ((mode === 'daily' && isLoadingDaily) || 
      (mode === 'special' && isLoadingSpecial) || 
      (showTiffin && isLoadingTiffin)) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white dark:bg-slate-800 shadow-lg rounded-xl p-8 flex justify-center">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pb-16">
      {/* Main Suggestions */}
      <AnimatePresence>
        {mode === 'daily' && dailySuggestions.length > 0 ? (
          <motion.div 
            key="daily-suggestions"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="py-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {dailySuggestions.map((dish: DishSuggestion, index: number) => (
                <ModernSuggestionCard
                  key={dish.id}
                  id={dish.id}
                  name={dish.name}
                  description={dish.description}
                  imageUrl={dish.imageUrl}
                  tags={dish.tags}
                  index={index}
                  onSeeMore={() => handleSeeMore(dish)}
                  onAuthPrompt={(reason) => console.log(reason)} // We would implement this later
                />
              ))}
            </div>
          </motion.div>
        ) : mode === 'daily' && (
          <motion.div 
            key="no-daily-suggestions"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white dark:bg-slate-800 shadow-lg rounded-xl p-8 my-8 text-center"
          >
            <div className="text-5xl text-saffron dark:text-marigold mb-4">
              <i className="fas fa-utensils"></i>
            </div>
            <h3 className="text-xl font-playfair font-bold text-charcoal dark:text-white mb-2">No dishes found</h3>
            <p className="text-spice-brown dark:text-slate-300">Try adjusting your filters or selecting a different time of day</p>
          </motion.div>
        )}
        
        {mode === 'special' && selectedOccasion && specialSuggestions.length > 0 ? (
          <motion.div 
            key="special-suggestions-data"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="py-4"
          >
            {/* Optional: Display festival-specific header if selectedOccasion was a festival */}
            {selectedFestival && (
            <div className="bg-white dark:bg-slate-800 shadow-lg rounded-xl p-6 mb-6">
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                <div className="md:w-1/3 aspect-video rounded-lg overflow-hidden">
                  <img 
                    src={selectedFestival.imageUrl} 
                    alt={selectedFestival.name} 
                    className="w-full h-full object-cover"
                    loading="eager"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://placehold.co/300x200/f4e9d6/5c3d2e?text=${encodeURIComponent(selectedFestival.name)}`;
                    }}
                  />
                </div>
                <div className="md:w-2/3">
                  <h2 className="text-3xl font-playfair font-bold text-charcoal dark:text-white mb-2">
                    {selectedFestival.name}
                  </h2>
                  <p className="text-spice-brown dark:text-slate-300 mb-4">
                    {selectedFestival.description}
                  </p>
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-charcoal dark:text-white mb-1">Significance</h3>
                    <p className="text-spice-brown dark:text-slate-300">
                      {selectedFestival.significance}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-1">
                    <span className="text-sm font-medium text-charcoal dark:text-white">Region:</span>
                    <span className="px-2 py-0.5 bg-saffron/20 dark:bg-marigold/20 text-saffron dark:text-marigold rounded-full text-xs">
                      {selectedFestival.region}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            )}

            {/* Grid for displaying dishes from backend */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {specialSuggestions.map((dish: DishSuggestion, index: number) => (
                <ModernSuggestionCard
                  key={dish.id}
                  id={dish.id}
                  name={dish.name}
                  description={dish.description}
                  imageUrl={dish.imageUrl}
                  tags={dish.tags}
                  index={index}
                  onSeeMore={() => handleSeeMore(dish)}
                  onAuthPrompt={(reason) => console.log(reason)}
                />
              ))}
            </div>
          </motion.div>
        ) : mode === 'special' && selectedOccasion && !isLoadingSpecial && specialSuggestions.length === 0 ? (
          // No suggestions found for the special occasion
          <motion.div 
            key="no-special-suggestions"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white dark:bg-slate-800 shadow-lg rounded-xl p-8 my-8 text-center"
          >
            <div className="text-5xl text-saffron dark:text-marigold mb-4">
              {selectedFestival ? <i className={selectedFestival.imageUrl ? 'fas fa-om' : 'fas fa-concierge-bell'}></i> : <i className="fas fa-concierge-bell"></i>}
            </div>
            <h3 className="text-xl font-playfair font-bold text-charcoal dark:text-white mb-2">
              {selectedFestival ? `No specific dishes found for ${selectedFestival.name}` : "No dishes found for this occasion"}
            </h3>
            <p className="text-spice-brown dark:text-slate-300">Try adjusting filters or checking back later.</p>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Tiffin Suggestions */}
      <AnimatePresence>
        {showTiffin && tiffinSuggestions.length > 0 && (
          <motion.div 
            key="tiffin-suggestions"
            className="mt-12"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white dark:bg-slate-800 shadow-lg rounded-xl p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-full bg-saffron/20 dark:bg-marigold/20">
                  <i className="fas fa-utensils text-saffron dark:text-marigold"></i>
                </div>
                <h2 className="text-2xl font-playfair font-bold text-charcoal dark:text-white">Lunch Tiffin Ideas</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {tiffinSuggestions.map((dish: DishSuggestion, index: number) => (
                  <ModernSuggestionCard
                    key={dish.id}
                    id={dish.id}
                    name={dish.name}
                    description={dish.description}
                    imageUrl={dish.imageUrl}
                    tags={dish.tags}
                    index={index}
                    onSeeMore={() => handleSeeMore(dish)}
                    onAuthPrompt={(reason) => console.log(reason)} // We would implement this later
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ModernSuggestionGrid;