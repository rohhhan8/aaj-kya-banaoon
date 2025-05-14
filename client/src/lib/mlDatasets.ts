/**
 * ML Datasets Configuration for CulinaryAI
 * 
 * This file contains dataset configurations, interfaces and integration helpers
 * for machine learning capabilities in CulinaryAI.
 */

import { DishSuggestion, DishTag } from "@/lib/utils";

// Dataset interfaces
export interface RecipeDataset {
  source: string;
  name: string;
  description: string;
  endpoint?: string;
  apiKey?: string;
  local: boolean;
  format: 'json' | 'csv' | 'api';
  size: string;  // human readable size
  lastUpdated: string; // YYYY-MM-DD
  categories: string[];
  enabled: boolean;
}

export interface NutritionDataset {
  source: string;
  name: string;
  endpoint?: string;
  apiKey?: string;
  local: boolean;
  format: 'json' | 'csv' | 'api';
  nutritionFields: string[];
  size: string;
  lastUpdated: string;
  enabled: boolean;
}

export interface RegionalPreferenceDataset {
  source: string;
  name: string;
  regions: string[];
  factors: string[];
  size: string;
  format: 'json' | 'csv' | 'api';
  lastUpdated: string;
  enabled: boolean;
}

// Available ML datasets
export const recipeDatasets: RecipeDataset[] = [
  {
    source: "Food.com",
    name: "Food.com Recipe Dataset",
    description: "250k+ recipes with ratings, reviews, and ingredients",
    local: true,
    format: 'json',
    size: "2.14 GB",
    lastUpdated: "2023-09-10",
    categories: ["american", "indian", "italian", "chinese", "mexican", "fusion"],
    enabled: true
  },
  {
    source: "Kaggle",
    name: "Indian Food Dataset",
    description: "Dataset containing 255 Indian foods with ingredients and region information",
    local: true,
    format: 'json',
    size: "50 MB",
    lastUpdated: "2023-05-15",
    categories: ["indian", "regional", "traditional"],
    enabled: true
  },
  {
    source: "Spoonacular",
    name: "Spoonacular Food API",
    description: "External API for recipe search, analysis and recommendations",
    endpoint: "https://api.spoonacular.com/recipes",
    apiKey: "YOUR_API_KEY", // Replace with env variable in production
    local: false,
    format: 'api',
    size: "N/A (API)",
    lastUpdated: "Real-time",
    categories: ["global", "ingredients", "nutrition", "meal-planning"],
    enabled: false
  },
  {
    source: "Open Food Facts",
    name: "Open Food Facts Database",
    description: "Open database of food products with ingredients and nutrition data",
    endpoint: "https://world.openfoodfacts.org/api/v2",
    local: false,
    format: 'api',
    size: "N/A (API)",
    lastUpdated: "Real-time",
    categories: ["products", "ingredients", "nutrition"],
    enabled: false
  },
  {
    source: "User CSV",
    name: "Indian Food CSV Dataset",
    description: "Custom CSV dataset with authentic Indian recipes and regional information",
    local: true,
    format: 'csv',
    size: "28 KB",
    lastUpdated: "2023-10-15",
    categories: ["indian", "regional", "traditional", "authentic"],
    enabled: true
  }
];

export const nutritionDatasets: NutritionDataset[] = [
  {
    source: "USDA",
    name: "USDA Food Database",
    local: true,
    format: 'json',
    nutritionFields: [
      "calories", "fat", "protein", "carbs", "fiber", 
      "sugar", "sodium", "vitamins", "minerals"
    ],
    size: "150 MB",
    lastUpdated: "2023-04-18",
    enabled: true
  },
  {
    source: "Indian Council of Medical Research",
    name: "Indian Food Composition Tables",
    local: true,
    format: 'json',
    nutritionFields: [
      "calories", "fat", "protein", "carbs", "fiber", 
      "minerals", "vitamins", "glycemic_index"
    ],
    size: "85 MB",
    lastUpdated: "2023-02-10",
    enabled: true
  }
];

export const regionalPreferenceDatasets: RegionalPreferenceDataset[] = [
  {
    source: "CulinaryAI Research",
    name: "Regional Cooking Preferences - India",
    regions: [
      "North India", "South India", "East India", 
      "West India", "Central India", "Northeast India"
    ],
    factors: [
      "spice_level", "flavor_profile", "cooking_techniques", 
      "staple_ingredients", "meal_composition"
    ],
    size: "120 MB",
    format: 'json',
    lastUpdated: "2023-07-22",
    enabled: true
  }
];

// ML Integration helper functions

/**
 * Loads ML datasets based on specified filters
 */
export async function loadDatasets(
  datasetTypes: ('recipes' | 'nutrition' | 'regional')[],
  onlyEnabled: boolean = true
): Promise<{
  recipes?: RecipeDataset[],
  nutrition?: NutritionDataset[],
  regional?: RegionalPreferenceDataset[]
}> {
  const result: any = {};
  
  if (datasetTypes.includes('recipes')) {
    result.recipes = recipeDatasets.filter(
      dataset => onlyEnabled ? dataset.enabled : true
    );
  }
  
  if (datasetTypes.includes('nutrition')) {
    result.nutrition = nutritionDatasets.filter(
      dataset => onlyEnabled ? dataset.enabled : true
    );
  }
  
  if (datasetTypes.includes('regional')) {
    result.regional = regionalPreferenceDatasets.filter(
      dataset => onlyEnabled ? dataset.enabled : true
    );
  }
  
  return result;
}

/**
 * Generate dish suggestions using ML models trained on loaded datasets
 */
export async function generateMlSuggestions(
  preferences: {
    region?: string,
    dietary?: string[],
    spiceLevel?: number,
    mealType?: string,
    occasion?: string
  },
  limit: number = 10
): Promise<DishSuggestion[]> {
  // In a real implementation, this would call a backend ML service
  // For now, we're returning mock data
  
  // Mock implementation
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // In real implementation, we would use ML to generate these suggestions
    const mockSuggestions: DishSuggestion[] = [
      {
        id: "ml-suggestion-1",
        name: "Paneer Tikka Masala",
        description: "Cottage cheese cubes marinated with spices and grilled in a tandoor. ML model suggests this based on your regional preference and dietary choices.",
        imageUrl: "https://source.unsplash.com/featured/300x200/?paneer,tikka,masala",
        tags: ["Protein", "Spicy"] as DishTag[],
        mealType: "dinner",
        confidence: 0.89
      },
      {
        id: "ml-suggestion-2",
        name: "Palak Dal Tadka",
        description: "A nutritious spinach and lentil preparation. Our ML model recommends this based on analyzing similar preference patterns.",
        imageUrl: "https://source.unsplash.com/featured/300x200/?spinach,lentil,dal",
        tags: ["Healthy", "Protein"] as DishTag[],
        mealType: "lunch",
        confidence: 0.76
      }
    ];
    
    return mockSuggestions;
  } catch (error) {
    console.error("Error generating ML suggestions:", error);
    return [];
  }
}

/**
 * Get nutrition analysis using ML and nutrition datasets
 */
export async function getNutritionAnalysis(
  ingredients: string[],
  quantities?: Record<string, string>
): Promise<{
  calories: number,
  protein: number,
  carbs: number,
  fat: number,
  fiber: number,
  vitamins: Record<string, number>,
  healthScore: number
} | null> {
  // Mock implementation
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    return {
      calories: 450,
      protein: 22,
      carbs: 48,
      fat: 18,
      fiber: 6,
      vitamins: {
        "A": 15,
        "C": 20,
        "D": 5,
        "B12": 10
      },
      healthScore: 78
    };
  } catch (error) {
    console.error("Error analyzing nutrition:", error);
    return null;
  }
}

/**
 * Get ingredient substitution recommendations based on ML analysis
 */
export async function getIngredientSubstitutions(
  ingredient: string,
  context?: {
    dietary?: string[],
    cuisineType?: string,
    healthFocus?: string
  }
): Promise<string[]> {
  // Mock implementation  
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const substitutions: Record<string, string[]> = {
      "ghee": ["butter", "olive oil", "coconut oil"],
      "paneer": ["tofu", "cottage cheese", "halloumi"],
      "rice": ["quinoa", "cauliflower rice", "brown rice"],
      "wheat flour": ["almond flour", "rice flour", "oat flour"]
    };
    
    return substitutions[ingredient.toLowerCase()] || [];
  } catch (error) {
    console.error("Error getting ingredient substitutions:", error);
    return [];
  }
} 