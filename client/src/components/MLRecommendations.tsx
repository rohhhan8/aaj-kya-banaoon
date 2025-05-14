import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ModernSuggestionCard from '@/components/ModernSuggestionCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { DishSuggestion } from '@/lib/utils';
import { generateMlSuggestions, loadDatasets } from '@/lib/mlDatasets';

const regions = ['North', 'South', 'East', 'West', 'Northeast', 'Central'];
const cuisineTypes = ['Indian', 'Fusion', 'Chinese-Inspired', 'Continental', 'Middle-Eastern'];
const dietaryTypes = ['Vegetarian', 'Non-Vegetarian', 'Vegan', 'Gluten-Free'];
const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];

interface MLRecommendationsProps {
  defaultRegion?: string;
  defaultMealType?: string;
  defaultOccasion?: string;
  onRecommendationClick?: (dish: DishSuggestion) => void;
}

const MLRecommendations: React.FC<MLRecommendationsProps> = ({
  defaultRegion = 'North',
  defaultMealType = 'dinner',
  defaultOccasion = '',
  onRecommendationClick
}) => {
  // User preferences
  const [region, setRegion] = useState<string>(defaultRegion);
  const [cuisine, setCuisine] = useState<string>('Indian');
  const [dietary, setDietary] = useState<string>('Vegetarian');
  const [spiceLevel, setSpiceLevel] = useState<number>(50);
  const [mealType, setMealType] = useState<string>(defaultMealType);
  const [occasion, setOccasion] = useState<string>(defaultOccasion);
  
  // ML system state
  const [enableML, setEnableML] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('recommendations');
  const [selectedDatasets, setSelectedDatasets] = useState<string[]>([]);

  // Fetch dataset information
  const { data: datasetsInfo, isLoading: loadingDatasets } = useQuery({
    queryKey: ['ml-datasets'],
    queryFn: async () => {
      const result = await loadDatasets(['recipes', 'regional'], true);
      return result;
    }
  });
  
  // Generate ML recommendations based on preferences
  const { data: recommendations, isLoading: loadingRecommendations, refetch: refetchRecommendations } = useQuery({
    queryKey: ['ml-recommendations', region, dietary, spiceLevel, mealType, occasion, enableML],
    queryFn: async () => {
      if (!enableML) return [];
      
      const result = await generateMlSuggestions({
        region,
        dietary: [dietary],
        spiceLevel: spiceLevel / 100,
        mealType,
        occasion
      });
      
      return result;
    }
  });

  // Handle recommendation click
  const handleRecommendationClick = (dish: DishSuggestion) => {
    if (onRecommendationClick) {
      onRecommendationClick(dish);
    }
  };

  // Re-fetch when preferences change
  useEffect(() => {
    if (enableML) {
      refetchRecommendations();
    }
  }, [region, dietary, spiceLevel, mealType, occasion, enableML]);
  
  return (
    <Card className="bg-white dark:bg-slate-800 shadow-lg border-none">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-playfair font-bold text-charcoal dark:text-white flex items-center">
              <i className="fas fa-brain text-spice-brown dark:text-marigold mr-2"></i>
              AI-Powered Recommendations
            </h2>
            <p className="text-spice-brown dark:text-slate-300 text-sm">
              Personalized dish suggestions using our ML system
            </p>
          </div>
          <div className="flex items-center">
            <Label htmlFor="ai-toggle" className="mr-2 text-charcoal dark:text-white">AI Mode</Label>
            <Switch
              id="ai-toggle"
              checked={enableML}
              onCheckedChange={setEnableML}
              className="data-[state=checked]:bg-spice-brown dark:data-[state=checked]:bg-marigold"
            />
          </div>
        </div>
        
        <Tabs defaultValue="recommendations" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4 bg-cream/30 dark:bg-slate-700/30">
            <TabsTrigger value="recommendations" className="data-[state=active]:bg-spice-brown/20 dark:data-[state=active]:bg-marigold/20">
              Recommendations
            </TabsTrigger>
            <TabsTrigger value="preferences" className="data-[state=active]:bg-spice-brown/20 dark:data-[state=active]:bg-marigold/20">
              My Preferences
            </TabsTrigger>
            <TabsTrigger value="datasets" className="data-[state=active]:bg-spice-brown/20 dark:data-[state=active]:bg-marigold/20">
              ML Datasets
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="recommendations" className="mt-4">
            {!enableML && (
              <div className="text-center p-8 bg-cream/30 dark:bg-slate-700/30 rounded-lg">
                <i className="fas fa-power-off text-4xl text-spice-brown/50 dark:text-marigold/50 mb-4"></i>
                <h3 className="text-xl font-playfair font-bold text-charcoal dark:text-white mb-2">
                  AI Recommendations are disabled
                </h3>
                <p className="text-spice-brown dark:text-slate-300">
                  Enable AI mode to get personalized dish suggestions
                </p>
                <Button 
                  onClick={() => setEnableML(true)} 
                  className="mt-4 bg-spice-brown hover:bg-deep-saffron dark:bg-marigold dark:hover:bg-deep-saffron"
                >
                  Enable AI Mode
                </Button>
              </div>
            )}
            
            {enableML && loadingRecommendations && (
              <div className="flex flex-col items-center justify-center p-8">
                <LoadingSpinner size="lg" />
                <p className="mt-4 text-spice-brown dark:text-slate-300">Generating AI recommendations...</p>
              </div>
            )}
            
            {enableML && !loadingRecommendations && recommendations && recommendations.length === 0 && (
              <div className="text-center p-8 bg-cream/30 dark:bg-slate-700/30 rounded-lg">
                <i className="fas fa-search text-4xl text-spice-brown/50 dark:text-marigold/50 mb-4"></i>
                <h3 className="text-xl font-playfair font-bold text-charcoal dark:text-white mb-2">
                  No AI recommendations found
                </h3>
                <p className="text-spice-brown dark:text-slate-300">
                  Try adjusting your preferences or select a different region
                </p>
              </div>
            )}
            
            {enableML && !loadingRecommendations && recommendations && recommendations.length > 0 && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-4">
                  {recommendations.map((dish, index) => (
                    <div key={dish.id} className="relative h-full">
                      {dish.confidence && dish.confidence >= 0.85 && (
                        <div className="absolute -top-2 -right-2 z-10">
                          <span className="bg-gradient-to-r from-saffron to-haldi text-charcoal dark:text-white px-2 py-0.5 rounded-full text-xs shadow-md">
                            Top Pick
                          </span>
                        </div>
                      )}
                      <ModernSuggestionCard
                        id={dish.id}
                        name={dish.name}
                        description={dish.description}
                        imageUrl={dish.imageUrl}
                        tags={dish.tags}
                        index={index}
                        onSeeMore={() => handleRecommendationClick(dish)}
                        onAuthPrompt={(reason) => console.log(reason)}
                        aiConfidence={dish.confidence}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="preferences" className="mt-4">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="region" className="text-charcoal dark:text-white font-medium">Region</Label>
                    <Select value={region} onValueChange={setRegion}>
                      <SelectTrigger className="mt-1 border-spice-brown/20 dark:border-marigold/20">
                        <SelectValue placeholder="Select Region" />
                      </SelectTrigger>
                      <SelectContent>
                        {regions.map(r => (
                          <SelectItem key={r} value={r}>{r} India</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="cuisine" className="text-charcoal dark:text-white font-medium">Cuisine Type</Label>
                    <Select value={cuisine} onValueChange={setCuisine}>
                      <SelectTrigger className="mt-1 border-spice-brown/20 dark:border-marigold/20">
                        <SelectValue placeholder="Select Cuisine" />
                      </SelectTrigger>
                      <SelectContent>
                        {cuisineTypes.map(c => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="dietary" className="text-charcoal dark:text-white font-medium">Dietary Preference</Label>
                    <Select value={dietary} onValueChange={setDietary}>
                      <SelectTrigger className="mt-1 border-spice-brown/20 dark:border-marigold/20">
                        <SelectValue placeholder="Select Dietary Preference" />
                      </SelectTrigger>
                      <SelectContent>
                        {dietaryTypes.map(d => (
                          <SelectItem key={d} value={d}>{d}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="mealType" className="text-charcoal dark:text-white font-medium">Meal Type</Label>
                    <Select value={mealType} onValueChange={setMealType}>
                      <SelectTrigger className="mt-1 border-spice-brown/20 dark:border-marigold/20">
                        <SelectValue placeholder="Select Meal Type" />
                      </SelectTrigger>
                      <SelectContent>
                        {mealTypes.map(m => (
                          <SelectItem key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between">
                  <Label htmlFor="spice-level" className="text-charcoal dark:text-white font-medium">Spice Level</Label>
                  <span className="text-spice-brown dark:text-marigold font-medium">
                    {spiceLevel < 33 ? 'Mild' : spiceLevel < 66 ? 'Medium' : 'Spicy'}
                  </span>
                </div>
                <Slider
                  id="spice-level"
                  defaultValue={[spiceLevel]}
                  max={100}
                  step={1}
                  className="mt-2"
                  onValueChange={(values) => setSpiceLevel(values[0])}
                />
                <div className="flex justify-between text-xs text-charcoal/70 dark:text-white/70 mt-1">
                  <span>Mild</span>
                  <span>Medium</span>
                  <span>Spicy</span>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button 
                  onClick={() => {
                    refetchRecommendations();
                    setActiveTab('recommendations');
                  }} 
                  className="bg-spice-brown hover:bg-deep-saffron dark:bg-marigold dark:hover:bg-deep-saffron"
                >
                  <i className="fas fa-sync-alt mr-2"></i>
                  Update Recommendations
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="datasets" className="mt-4">
            <div className="space-y-6">
              {loadingDatasets ? (
                <div className="flex justify-center p-6">
                  <LoadingSpinner />
                </div>
              ) : (
                <>
                  <div>
                    <h3 className="text-lg font-playfair font-bold text-charcoal dark:text-white mb-3">
                      Recipe Datasets
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {datasetsInfo?.recipes?.map((dataset) => (
                        <Card key={dataset.source} className="overflow-hidden">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-bold text-charcoal dark:text-white mb-1">{dataset.name}</h4>
                                <p className="text-sm text-spice-brown dark:text-slate-300">{dataset.description}</p>
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {dataset.local ? (
                                    <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">Local</Badge>
                                  ) : (
                                    <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800">External API</Badge>
                                  )}
                                  <Badge variant="outline" className="bg-cream text-spice-brown border-cream dark:bg-slate-700 dark:text-marigold dark:border-slate-600">{dataset.size}</Badge>
                                  {dataset.categories?.map((category, i) => (
                                    <Badge 
                                      key={i} 
                                      variant="outline" 
                                      className="bg-cream/50 text-spice-brown border-cream/50 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
                                    >
                                      {category}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <Switch
                                checked={dataset.enabled}
                                className="data-[state=checked]:bg-spice-brown dark:data-[state=checked]:bg-marigold"
                              />
                            </div>
                            <div className="text-xs text-charcoal/50 dark:text-white/50 mt-2">
                              Last updated: {dataset.lastUpdated}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-playfair font-bold text-charcoal dark:text-white mb-3">
                      Regional Preference Datasets
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {datasetsInfo?.regional?.map((dataset) => (
                        <Card key={dataset.source} className="overflow-hidden">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-bold text-charcoal dark:text-white mb-1">{dataset.name}</h4>
                                <div className="flex flex-wrap gap-1 mt-2">
                                  <Badge variant="outline" className="bg-cream text-spice-brown border-cream dark:bg-slate-700 dark:text-marigold dark:border-slate-600">{dataset.size}</Badge>
                                  <Badge variant="outline" className="bg-cream/50 text-spice-brown border-cream/50 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">
                                    {dataset.regions?.length || 0} Regions
                                  </Badge>
                                </div>
                              </div>
                              <Switch
                                checked={dataset.enabled}
                                className="data-[state=checked]:bg-spice-brown dark:data-[state=checked]:bg-marigold"
                              />
                            </div>
                            <div className="text-xs text-charcoal/50 dark:text-white/50 mt-2">
                              Last updated: {dataset.lastUpdated}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MLRecommendations; 