import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SuggestionCard from "./SuggestionCard";
import { DishTag, DishSuggestion } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";

interface SuggestionGridProps {
  mode: "daily" | "special";
  day: string;
  timeOfDay: string;
  showTiffin: boolean;
  activeFilters: DishTag[];
  selectedOccasion?: string;
}

const SuggestionGrid = ({ 
  mode, 
  day, 
  timeOfDay, 
  showTiffin, 
  activeFilters,
  selectedOccasion 
}: SuggestionGridProps) => {
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
      <div className="container mx-auto px-4 pb-16">
        <div className="flex justify-center items-center py-12">
          <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-tomato-red" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pb-16">
      {/* Main Suggestions */}
      <AnimatePresence>
        {mode === 'daily' && (
          <motion.div 
            key="daily-suggestions"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {dailySuggestions.map((dish: DishSuggestion, index: number) => (
              <SuggestionCard
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
          </motion.div>
        )}
        
        {mode === 'special' && selectedOccasion && (
          <motion.div 
            key="special-suggestions"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {specialSuggestions.map((dish: DishSuggestion, index: number) => (
              <SuggestionCard
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tiffin Suggestions */}
      <AnimatePresence>
        {showTiffin && (
          <motion.div 
            key="tiffin-suggestions"
            className="mt-12 fade-in"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-playfair font-bold text-charcoal mb-6">Lunch Tiffin Ideas</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {tiffinSuggestions.map((dish: DishSuggestion, index: number) => (
                <SuggestionCard
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
        )}
      </AnimatePresence>
    </div>
  );
};

export default SuggestionGrid;
