import React, { useState } from "react";
import { motion } from "framer-motion";
import { DishTag } from "@/lib/utils";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/authContext";

interface ModernSuggestionCardProps {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  tags: DishTag[] | string;
  index: number;
  onSeeMore: () => void;
  onAuthPrompt?: (reason: 'favorite') => void;
  aiConfidence?: number;
}

const ModernSuggestionCard = ({ 
  id, 
  name, 
  description, 
  imageUrl, 
  tags, 
  index, 
  onSeeMore,
  onAuthPrompt,
  aiConfidence
}: ModernSuggestionCardProps) => {
  const { user } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // Ensure tags is always an array
  const tagsArray = typeof tags === 'string' 
    ? tags.split(',').map(tag => tag.trim()) 
    : Array.isArray(tags) ? tags : [];
  
  const handleSaveRecipe = () => {
    // If not authenticated, prompt for auth
    if (!user && onAuthPrompt) {
      onAuthPrompt('favorite');
      return;
    }
    
    // Toggle saved state
    setIsSaved(!isSaved);
    
    // In a real app, this would call an API to save the recipe to the user's favorites
    if (user) {
      console.log(`Recipe ${isSaved ? 'removed from' : 'saved to'} favorites:`, id);
    }
  };
  
  // Map tag to its corresponding icon
  const getTagIcon = (tag: DishTag): string => {
    const tagIcons: Record<DishTag, string> = {
      "Healthy": "fas fa-heart",
      "Light": "fas fa-feather",
      "Spicy": "fas fa-pepper-hot",
      "Quick": "fas fa-bolt",
      "Festive": "fas fa-birthday-cake",
      "Protein": "fas fa-drumstick-bite",
      "Probiotic": "fas fa-bacteria",
      "One-pot": "fas fa-utensil-spoon",
      "Balanced": "fas fa-balance-scale"
    };
    
    return tagIcons[tag] || "fas fa-tag";
  };

  // Handle image errors and set fallback image
  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <motion.div 
      className="h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 * index }}
      whileHover={{ y: -5 }}
    >
      <Card className="overflow-hidden h-full bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 border-none flex flex-col">
        <div className="aspect-video relative overflow-hidden">
          {!imageError ? (
            <img 
              src={imageUrl} 
              alt={`${name} dish`} 
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" 
              onError={handleImageError}
              loading="eager"
            />
          ) : (
            <div 
              className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cream/80 to-spice-brown/20 dark:from-slate-700/70 dark:to-slate-800/20"
            >
              <div className="text-center p-4">
                <i className="fas fa-utensils text-3xl text-spice-brown dark:text-marigold mb-2"></i>
                <h3 className="font-playfair text-sm text-charcoal dark:text-white">{name}</h3>
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end">
            <div className="p-4 w-full">
              <motion.div 
                className="flex flex-wrap gap-1" 
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                {tagsArray.map((tag, i) => (
                  <Badge 
                    key={`${id}-tag-${i}`} 
                    variant="outline" 
                    className="bg-white/20 text-white backdrop-blur-sm border-none text-xs"
                  >
                    <i className={`${getTagIcon(tag as DishTag)} mr-1`}></i> {tag}
                  </Badge>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
        
        <CardContent className="p-5 flex-grow">
          <h3 className="font-playfair font-bold text-xl text-charcoal dark:text-white mb-3">{name}</h3>
          <p className="text-sm text-spice-brown dark:text-slate-300 font-nunito line-clamp-3">{description}</p>
        </CardContent>
        
        <CardFooter className={`p-5 pt-0 flex ${aiConfidence !== undefined ? 'flex-col items-start' : 'justify-between items-center'}`}>
          {aiConfidence !== undefined && (
            <div className="w-full mb-3">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-charcoal/70 dark:text-white/70 font-medium">AI Confidence</span>
                <span className="font-semibold text-saffron dark:text-marigold">
                  {Math.round(aiConfidence * 100)}%
                </span>
              </div>
              <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-red-600 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${aiConfidence * 100}%` }}
                  transition={{ duration: 0.7, ease: "circOut" }}
                />
              </div>
            </div>
          )}

          <div className={`w-full flex ${aiConfidence !== undefined ? 'justify-between' : 'justify-between'} items-center`}>
          <Button 
            variant="ghost" 
              className="p-0 hover:bg-transparent text-saffron dark:text-marigold hover:text-deep-saffron dark:hover:text-deep-saffron font-medium flex items-center justify-start text-sm"
            onClick={onSeeMore}
          >
              <span>View Analysis</span>
            <i className="fas fa-arrow-right ml-2 text-xs"></i>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="p-0 hover:bg-transparent"
            onClick={handleSaveRecipe}
          >
            <i className={`${isSaved ? 'fas' : 'far'} fa-heart text-xl ${isSaved ? 'text-rose-500' : 'text-gray-400 hover:text-rose-400'}`}></i>
          </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ModernSuggestionCard;