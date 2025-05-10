import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ModernSuggestionCard from "./ModernSuggestionCard";
import LoadingSpinner from "./LoadingSpinner";
import { DishTag, DishSuggestion } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";

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
            key="special-suggestions"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="py-4"
          >
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
                />
              ))}
            </div>
          </motion.div>
        ) : mode === 'special' && selectedOccasion && (
          <motion.div 
            key="no-special-suggestions"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white dark:bg-slate-800 shadow-lg rounded-xl p-8 my-8 text-center"
          >
            <div className="text-5xl text-saffron dark:text-marigold mb-4">
              <i className="fas fa-search"></i>
            </div>
            <h3 className="text-xl font-playfair font-bold text-charcoal dark:text-white mb-2">No dishes found for {selectedOccasion}</h3>
            <p className="text-spice-brown dark:text-slate-300">Try selecting a different occasion or adjusting your filters</p>
          </motion.div>
        )}
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