import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import MLRecommendations from '@/components/MLRecommendations';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DishSuggestion } from '@/lib/utils';
import { getNutritionAnalysis } from '@/lib/mlDatasets';
import { FaArrowLeft } from 'react-icons/fa';

const MlExplorer: React.FC = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState('recommendations');
  const [nutritionAnalysis, setNutritionAnalysis] = useState<any>(null);
  const [analyzingNutrition, setAnalyzingNutrition] = useState(false);
  const [selectedDish, setSelectedDish] = useState<DishSuggestion | null>(null);

  const handleRecommendationClick = (dish: DishSuggestion) => {
    setSelectedDish(dish);
    analyzeNutrition(dish.name);
    setSelectedTab('analysis');
  };

  const analyzeNutrition = async (dishName: string) => {
    setAnalyzingNutrition(true);
    try {
      // Get mock ingredients from dish name by splitting words
      const mockIngredients = dishName.split(' ').map(word => word.toLowerCase());
      
      // Add common Indian food ingredients
      mockIngredients.push('onion', 'garlic', 'ginger', 'tomato');
      
      const analysis = await getNutritionAnalysis(mockIngredients);
      setNutritionAnalysis(analysis);
    } catch (error) {
      console.error('Failed to analyze nutrition:', error);
    } finally {
      setAnalyzingNutrition(false);
    }
  };

  // Helper function to get vitamin color based on value
  const getVitaminColor = (value: number) => {
    if (value >= 70) return "bg-green-500 dark:bg-green-400";
    if (value >= 40) return "bg-amber-500 dark:bg-amber-400";
    return "bg-spice-brown dark:bg-marigold";
  };

  return (
    <>
      <Helmet>
        <title>ML Explorer - CulinaryAI</title>
      </Helmet>

      <motion.div 
        className="container mx-auto px-4 py-8 md:py-12 min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 sm:mb-10">
          <div className="mb-4 sm:mb-0">
            <motion.h1 
              className="text-4xl md:text-5xl font-playfair font-bold text-charcoal dark:text-white mb-1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              ML Explorer
            </motion.h1>
            <motion.p 
              className="text-base md:text-lg text-charcoal/70 dark:text-white/70 font-nunito"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Explore AI-powered dish insights and nutritional analysis.
            </motion.p>
          </div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
          <Button 
            variant="outline"
              size="sm"
              onClick={() => navigate("/")}
              className="bg-white/80 dark:bg-slate-800/80 border-slate-300 dark:border-slate-700 hover:bg-saffron hover:text-white dark:hover:bg-marigold dark:hover:text-charcoal text-charcoal dark:text-white shadow-sm transition-all duration-200 ease-out"
          >
              <FaArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
          </Button>
          </motion.div>
        </div>

        <motion.div 
          className="mb-8 sm:mb-10 p-4 bg-gradient-to-r from-saffron/10 to-haldi/10 dark:from-marigold/10 dark:to-deep-saffron/10 border border-saffron/30 dark:border-marigold/30 rounded-xl shadow-md flex items-start space-x-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <i className="fas fa-lightbulb-on text-xl text-saffron dark:text-marigold mt-1"></i>
          <div>
            <h3 className="font-semibold text-charcoal dark:text-white mb-0.5">Pro Tip</h3>
            <p className="text-sm text-charcoal/80 dark:text-white/80 font-nunito">
              The ML Explorer uses real datasets for demonstration but simulates complex AI capabilities. In a full production app, these insights would be powered by dedicated trained models.
            </p>
          </div>
        </motion.div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex justify-center mb-8"
          >
            <TabsList className="inline-flex h-auto items-center justify-center rounded-full bg-slate-200/90 dark:bg-slate-800/90 p-1.5 shadow-inner backdrop-blur-sm">
              <TabsTrigger 
                value="recommendations" 
                className="inline-flex items-center justify-center whitespace-nowrap rounded-full px-6 py-2.5 text-sm font-semibold ring-offset-background transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-gradient-to-r data-[state=active]:from-saffron data-[state=active]:to-haldi data-[state=active]:text-charcoal dark:data-[state=active]:from-marigold dark:data-[state=active]:to-deep-saffron dark:data-[state=active]:text-white data-[state=active]:shadow-lg"
              >
              <i className="fas fa-brain mr-2"></i>
              AI Recommendations
            </TabsTrigger>
              <TabsTrigger 
                value="analysis" 
                className="inline-flex items-center justify-center whitespace-nowrap rounded-full px-6 py-2.5 text-sm font-semibold ring-offset-background transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-gradient-to-r data-[state=active]:from-saffron data-[state=active]:to-haldi data-[state=active]:text-charcoal dark:data-[state=active]:from-marigold dark:data-[state=active]:to-deep-saffron dark:data-[state=active]:text-white data-[state=active]:shadow-lg"
              >
              <i className="fas fa-chart-pie mr-2"></i>
              Nutrition Analysis
            </TabsTrigger>
              <TabsTrigger 
                value="datasets" 
                className="inline-flex items-center justify-center whitespace-nowrap rounded-full px-6 py-2.5 text-sm font-semibold ring-offset-background transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-gradient-to-r data-[state=active]:from-saffron data-[state=active]:to-haldi data-[state=active]:text-charcoal dark:data-[state=active]:from-marigold dark:data-[state=active]:to-deep-saffron dark:data-[state=active]:text-white data-[state=active]:shadow-lg"
              >
              <i className="fas fa-database mr-2"></i>
              ML Datasets
            </TabsTrigger>
          </TabsList>
          </motion.div>

          <TabsContent value="recommendations">
            <MLRecommendations 
              onRecommendationClick={handleRecommendationClick}
            />
          </TabsContent>

          <TabsContent value="analysis">
            {!selectedDish ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white dark:bg-slate-800 shadow-xl rounded-xl p-8 text-center flex flex-col items-center justify-center min-h-[400px]"
              >
                <div className="text-6xl text-saffron/50 dark:text-marigold/50 mb-6">
                  <i className="fas fa-utensils"></i>
                </div>
                <h3 className="text-2xl font-playfair font-bold text-charcoal dark:text-white mb-3">
                  No Dish Selected
                </h3>
                <p className="text-charcoal/70 dark:text-white/70 font-nunito mb-8 max-w-sm">
                  Select a dish from the 'AI Recommendations' tab to view its detailed nutritional analysis.
                </p>
                <Button
                  onClick={() => setSelectedTab('recommendations')}
                  className="bg-gradient-to-tr from-saffron to-haldi dark:from-marigold dark:to-deep-saffron text-charcoal dark:text-white px-6 py-2.5 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 ease-out"
                >
                  <i className="fas fa-chevron-left mr-2"></i>
                  Browse Recommendations
                </Button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="bg-white dark:bg-slate-800 shadow-xl rounded-xl overflow-hidden">
                  <CardHeader className="bg-slate-50 dark:bg-slate-700/50 p-4 sm:p-6 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                        <div className="mb-3 sm:mb-0">
                            <CardTitle className="text-2xl md:text-3xl font-playfair text-charcoal dark:text-white">
                                {selectedDish.name}
                            </CardTitle>
                            <CardDescription className="text-sm font-nunito text-charcoal/70 dark:text-white/70 mt-1">
                                Detailed Nutritional Analysis
                            </CardDescription>
                        </div>
                  <Button
                    variant="outline"
                        size="sm"
                    onClick={() => setSelectedTab('recommendations')}
                        className="bg-white/80 dark:bg-slate-800/80 border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/70 text-charcoal dark:text-white shadow-sm transition-all duration-200 ease-out whitespace-nowrap"
                  >
                        <i className="fas fa-arrow-left mr-2"></i>
                    Back to Recommendations
                  </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6">
                    {analyzingNutrition ? (
                      <div className="flex flex-col items-center justify-center py-16 min-h-[300px]">
                        <motion.div 
                          className="mb-4"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <i className="fas fa-spinner text-5xl text-saffron dark:text-marigold"></i>
                        </motion.div>
                        <p className="text-lg font-nunito text-charcoal/80 dark:text-white/80">
                          Analyzing nutrition...
                    </p>
                  </div>
                ) : nutritionAnalysis ? (
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Macronutrients Card */}
                        <Card className="lg:col-span-1 bg-slate-50/50 dark:bg-slate-700/30 p-5 rounded-lg">
                          <h3 className="text-xl font-playfair font-semibold text-charcoal dark:text-white mb-4">
                            Macronutrients
                        </h3>
                          <div className="space-y-5">
                            {[ 
                              { label: 'Calories', value: nutritionAnalysis.calories, unit: 'kcal', color: 'bg-saffron dark:bg-marigold', max: 800 },
                              { label: 'Protein', value: nutritionAnalysis.protein, unit: 'g', color: 'bg-teal-500 dark:bg-teal-400', max: 50 },
                              { label: 'Carbs', value: nutritionAnalysis.carbs, unit: 'g', color: 'bg-amber-500 dark:bg-amber-400', max: 100 },
                              { label: 'Fat', value: nutritionAnalysis.fat, unit: 'g', color: 'bg-rose-500 dark:bg-rose-400', max: 40 },
                              { label: 'Fiber', value: nutritionAnalysis.fiber, unit: 'g', color: 'bg-green-500 dark:bg-green-400', max: 25 }
                            ].map(macro => (
                              <div key={macro.label}>
                                <div className="flex justify-between items-baseline mb-1">
                                  <span className="text-sm font-medium text-charcoal dark:text-white">{macro.label}</span>
                                  <span className="text-sm font-bold text-charcoal dark:text-white">
                                    {macro.value}{macro.unit}
                                  </span>
                            </div>
                                <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                                  <motion.div 
                                    className={`h-full rounded-full ${macro.color}`}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min(100, (macro.value / macro.max) * 100)}%` }}
                                    transition={{ duration: 0.8, ease: "easeOut" }}
                                  />
                          </div>
                              </div>
                            ))}
                          </div>
                        </Card>

                        {/* Vitamins & Minerals Card */}
                        <Card className="lg:col-span-2 bg-slate-50/50 dark:bg-slate-700/30 p-5 rounded-lg">
                          <h3 className="text-xl font-playfair font-semibold text-charcoal dark:text-white mb-6">
                            Vitamins & Minerals (% Daily Value)
                          </h3>
                          {nutritionAnalysis.vitamins && Object.keys(nutritionAnalysis.vitamins).length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-6 gap-y-8">
                            {Object.entries(nutritionAnalysis.vitamins).map(([vitamin, valueRaw]) => {
                              const value = typeof valueRaw === 'number' ? valueRaw : 0;
                              return (
                                  <div key={vitamin} className="flex flex-col items-center">
                                    <div className="relative w-16 h-16 mb-2">
                                      <svg className="w-full h-full" viewBox="0 0 36 36">
                                        <motion.path
                                          className="text-slate-200 dark:text-slate-600"
                                          fill="none"
                                          strokeWidth="3"
                                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                        />
                                        <motion.path
                                          className={value >= 70 ? "text-green-500 dark:text-green-400" : value >= 40 ? "text-amber-500 dark:text-amber-400" : "text-saffron dark:text-marigold"}
                                          fill="none"
                                          strokeWidth="3"
                                          strokeDasharray={`${value}, 100`}
                                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                          initial={{ strokeDasharray: `0, 100` }}
                                          animate={{ strokeDasharray: `${value}, 100` }}
                                          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                                        />
                                      </svg>
                                      <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-sm font-bold text-charcoal dark:text-white">
                                          {value}%
                                        </span>
                                      </div>
                                    </div>
                                    <span className="text-xs font-medium text-center text-charcoal/80 dark:text-white/80">
                                      {vitamin.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').trim() /* Prettify name */}
                                    </span>
                                </div>
                              );
                            })}
                          </div>
                          ) : (
                            <p className="text-center text-charcoal/70 dark:text-white/70 py-8 font-nunito">
                              No detailed vitamin and mineral data available for this simulated analysis.
                            </p>
                          )}
                        </Card>
                      </div>
                    ) : (
                      <div className="text-center py-16 min-h-[300px]">
                        <i className="fas fa-exclamation-triangle text-5xl text-red-500/70 mb-4"></i>
                        <p className="text-lg font-nunito text-charcoal/80 dark:text-white/80">
                          Oops! We couldn't retrieve the nutrition analysis data.
                        </p>
                  </div>
                )}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </TabsContent>

          <TabsContent value="datasets">
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, staggerChildren: 0.1 }}
            >
              {[ 
                {
                  id: 'indian_food_dataset',
                  name: "Indian Food Recipes Dataset", 
                  source: "Kaggle", 
                  size: "~2000 recipes", 
                  features: "Name, Ingredients, Diet, Prep Time, Cook Time, Region, State, etc.",
                  icon: "fas fa-utensils",
                  url: "https://www.kaggle.com/datasets/nehaprabhavalkar/indian-food-101"
                },
                {
                  id: 'recipe_ingredients_dataset',
                  name: "Recipe Ingredients Dataset", 
                  source: "Kaggle", 
                  size: "~130k recipes", 
                  features: "Recipe title, Ingredients list, Instructions",
                  icon: "fas fa-list-check",
                  url: "https://www.kaggle.com/datasets/shuyangli94/food-com-recipes-and-user-interactions"
                },
                {
                  id: 'nutrition_facts_dataset',
                  name: "Nutrition Facts for Food", 
                  source: "Kaggle (USDA SR28)", 
                  size: "~8k food items", 
                  features: "Nutrient values (calories, protein, vitamins, etc.)",
                  icon: "fas fa-apple-whole",
                  url: "https://www.kaggle.com/datasets/niharika41298/nutritionix-food-database"
                }
              ].map((dataset) => (
                <motion.div key={dataset.id} variants={{ visible: { opacity: 1, y: 0 }, hidden: { opacity: 0, y: 20 } }} initial="hidden" animate="visible">
                  <Card className="h-full bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl transition-shadow duration-300 ease-out rounded-xl overflow-hidden flex flex-col">
                    <CardHeader className="bg-slate-50 dark:bg-slate-700/50 p-5 border-b border-slate-200 dark:border-slate-700">
                      <div className="flex items-center space-x-3">
                        <div className="p-2.5 bg-saffron/20 dark:bg-marigold/20 rounded-lg">
                           <i className={`${dataset.icon} text-xl text-saffron dark:text-marigold`}></i>
                </div>
                <div>
                            <CardTitle className="text-lg font-playfair text-charcoal dark:text-white">
                                {dataset.name}
                            </CardTitle>
                            <CardDescription className="text-xs font-nunito text-charcoal/70 dark:text-white/70">
                                Source: {dataset.source}
                            </CardDescription>
                    </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-5 flex-grow flex flex-col justify-between">
                <div>
                            <div className="mb-3">
                                <h4 className="text-xs font-semibold uppercase text-charcoal/60 dark:text-white/60 mb-1">Size</h4>
                                <p className="text-sm text-charcoal dark:text-white font-nunito">{dataset.size}</p>
                    </div>
                            <div className="mb-4">
                                <h4 className="text-xs font-semibold uppercase text-charcoal/60 dark:text-white/60 mb-1">Key Features</h4>
                                <p className="text-sm text-charcoal dark:text-white font-nunito leading-relaxed">{dataset.features}</p>
                  </div>
                </div>
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(dataset.url, '_blank')}
                        className="w-full mt-auto bg-white/80 dark:bg-slate-800/80 border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/70 text-charcoal dark:text-white shadow-sm transition-all duration-200 ease-out"
                      >
                        <i className="fas fa-external-link-alt mr-2"></i>
                        View on Kaggle
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </>
  );
};

export default MlExplorer; 