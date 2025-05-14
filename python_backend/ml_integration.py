import os
import json
import pandas as pd
import numpy as np
from typing import List, Dict, Any, Optional, Tuple, Union
from pathlib import Path
import logging
import requests
from time import time

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Paths configuration
DATASETS_DIR = Path('./datasets')
MODELS_DIR = Path('./models')
CACHE_DIR = Path('./cache')

# Ensure directories exist
for directory in [DATASETS_DIR, MODELS_DIR, CACHE_DIR]:
    directory.mkdir(parents=True, exist_ok=True)

class DatasetLoader:
    """Handles loading and preparation of culinary datasets for ML models"""
    
    def __init__(self):
        self.datasets = {}
        self.dataset_info = self._load_dataset_info()
    
    def _load_dataset_info(self) -> Dict[str, Any]:
        """Load dataset metadata and configuration"""
        try:
            with open(DATASETS_DIR / 'dataset_info.json', 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            # Create a default dataset info file if it doesn't exist
            default_info = {
                "available_datasets": {
                    "food_com": {
                        "name": "Food.com Recipe Dataset",
                        "file": "food_com_recipes.csv", 
                        "description": "250k+ recipes with ratings",
                        "url": "https://www.kaggle.com/datasets/shuyangli94/food-com-recipes-and-user-interactions",
                        "size": "2.14 GB",
                        "last_updated": "2023-09-10"
                    },
                    "indian_food": {
                        "name": "Indian Food Dataset",
                        "file": "indian_food.csv",
                        "description": "Indian foods with ingredients and region",
                        "url": "https://www.kaggle.com/datasets/nehaprabhavalkar/indian-food-101",
                        "size": "50 MB",
                        "last_updated": "2023-05-15"
                    },
                    "usda_nutrients": {
                        "name": "USDA Food Database",
                        "file": "usda_nutrients.csv",
                        "description": "Nutritional information for foods",
                        "url": "https://fdc.nal.usda.gov/download-datasets.html",
                        "size": "150 MB",
                        "last_updated": "2023-04-18"
                    },
                    "regional_preferences": {
                        "name": "Regional Cooking Preferences - India",
                        "file": "regional_preferences.json",
                        "description": "Regional cooking preferences in India",
                        "url": "custom_dataset",
                        "size": "120 MB",
                        "last_updated": "2023-07-22"
                    }
                },
                "external_apis": {
                    "spoonacular": {
                        "name": "Spoonacular Food API",
                        "base_url": "https://api.spoonacular.com",
                        "require_key": True
                    },
                    "open_food_facts": {
                        "name": "Open Food Facts Database",
                        "base_url": "https://world.openfoodfacts.org/api/v2",
                        "require_key": False
                    }
                }
            }
            
            # Save the default info
            with open(DATASETS_DIR / 'dataset_info.json', 'w') as f:
                json.dump(default_info, f, indent=2)
            
            return default_info
    
    def download_dataset(self, dataset_id: str) -> bool:
        """Download a dataset if not already present"""
        if dataset_id not in self.dataset_info["available_datasets"]:
            logger.error(f"Dataset {dataset_id} not found in configuration")
            return False
        
        dataset_config = self.dataset_info["available_datasets"][dataset_id]
        target_path = DATASETS_DIR / dataset_config["file"]
        
        if target_path.exists():
            logger.info(f"Dataset {dataset_id} already exists at {target_path}")
            return True
        
        # For demonstration, we'll just create placeholder files
        # In a real implementation, you would download from the provided URL
        if dataset_id == "food_com":
            # Create mock food.com dataset
            mock_data = {
                "recipe_id": list(range(1000, 1010)),
                "name": ["Butter Chicken", "Pasta Carbonara", "Vegetable Stir Fry", 
                         "Chicken Tikka", "Paneer Masala", "Mushroom Risotto",
                         "Dal Makhani", "Pav Bhaji", "Palak Paneer", "Chole Bhature"],
                "ingredients": [
                    "chicken,butter,cream,tomato,spices", 
                    "pasta,eggs,cheese,bacon",
                    "carrots,broccoli,peppers,soy sauce",
                    "chicken,yogurt,lemon,spices",
                    "paneer,tomato,cream,butter,spices",
                    "rice,mushrooms,butter,parmesan",
                    "lentils,cream,butter,spices",
                    "mixed vegetables,potatoes,tomatoes,butter,bread",
                    "spinach,paneer,cream,spices",
                    "chickpeas,flour,spices"
                ],
                "cuisine": ["Indian", "Italian", "Asian", "Indian", "Indian", 
                            "Italian", "Indian", "Indian", "Indian", "Indian"],
                "rating": [4.5, 4.2, 3.8, 4.7, 4.3, 4.1, 4.4, 4.6, 4.5, 4.8]
            }
            pd.DataFrame(mock_data).to_csv(target_path, index=False)
            logger.info(f"Created mock dataset for {dataset_id} at {target_path}")
            return True
        
        elif dataset_id == "indian_food":
            # Create mock Indian food dataset
            mock_data = {
                "name": ["Chole Bhature", "Dosa", "Idli", "Butter Chicken", "Palak Paneer"],
                "ingredients": [
                    "chickpeas,flour,spices",
                    "rice,urad dal,fenugreek seeds",
                    "rice,urad dal",
                    "chicken,butter,cream,tomato,spices",
                    "spinach,paneer,cream,spices"
                ],
                "diet": ["vegetarian", "vegetarian", "vegetarian", "non vegetarian", "vegetarian"],
                "flavor_profile": ["spicy", "spicy", "mild", "creamy", "mild spicy"],
                "region": ["North", "South", "South", "North", "North"]
            }
            pd.DataFrame(mock_data).to_csv(target_path, index=False)
            logger.info(f"Created mock dataset for {dataset_id} at {target_path}")
            return True
            
        logger.error(f"Downloading dataset {dataset_id} not implemented")
        return False
    
    def load_dataset(self, dataset_id: str) -> pd.DataFrame:
        """Load a dataset into memory"""
        if dataset_id in self.datasets:
            return self.datasets[dataset_id]
        
        if dataset_id not in self.dataset_info["available_datasets"]:
            logger.error(f"Dataset {dataset_id} not found in configuration")
            return pd.DataFrame()
        
        dataset_config = self.dataset_info["available_datasets"][dataset_id]
        target_path = DATASETS_DIR / dataset_config["file"]
        
        if not target_path.exists():
            success = self.download_dataset(dataset_id)
            if not success:
                logger.error(f"Failed to download dataset {dataset_id}")
                return pd.DataFrame()
                
        # Load the dataset
        try:
            if target_path.suffix == '.csv':
                df = pd.read_csv(target_path)
            elif target_path.suffix == '.json':
                df = pd.read_json(target_path)
            else:
                logger.error(f"Unsupported file format for {target_path}")
                return pd.DataFrame()
                
            self.datasets[dataset_id] = df
            logger.info(f"Loaded dataset {dataset_id} with {len(df)} records")
            return df
            
        except Exception as e:
            logger.error(f"Error loading dataset {dataset_id}: {str(e)}")
            return pd.DataFrame()
    
    def get_available_datasets(self) -> Dict[str, Any]:
        """Get information about available datasets"""
        return self.dataset_info["available_datasets"]
    
    def get_external_apis(self) -> Dict[str, Any]:
        """Get information about external APIs"""
        return self.dataset_info["external_apis"]


class FoodRecommendationModel:
    """ML model for food recommendations based on user preferences"""
    
    def __init__(self, dataset_loader: DatasetLoader):
        self.dataset_loader = dataset_loader
        self.model_info = self._load_model_info()
        self.trained = False
    
    def _load_model_info(self) -> Dict[str, Any]:
        """Load model metadata and configuration"""
        try:
            with open(MODELS_DIR / 'model_info.json', 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            # Create a default model info file if it doesn't exist
            default_info = {
                "models": {
                    "recipe_recommender": {
                        "name": "Recipe Recommendation Model",
                        "version": "0.1",
                        "datasets": ["food_com", "indian_food"],
                        "last_trained": None,
                        "accuracy": None,
                        "parameters": {
                            "embedding_size": 64,
                            "learning_rate": 0.005,
                            "regularization": 0.01
                        }
                    },
                    "nutrition_analyzer": {
                        "name": "Nutrition Analysis Model",
                        "version": "0.1",
                        "datasets": ["usda_nutrients"],
                        "last_trained": None,
                        "accuracy": None,
                        "parameters": {
                            "hidden_layers": [128, 64],
                            "dropout": 0.2
                        }
                    }
                }
            }
            
            # Save the default info
            with open(MODELS_DIR / 'model_info.json', 'w') as f:
                json.dump(default_info, f, indent=2)
            
            return default_info
    
    def train(self, model_id: str) -> bool:
        """Train a specific model using its configured datasets"""
        if model_id not in self.model_info["models"]:
            logger.error(f"Model {model_id} not found in configuration")
            return False
        
        logger.info(f"Training model {model_id}...")
        
        model_config = self.model_info["models"][model_id]
        
        # Load required datasets
        datasets = []
        for dataset_id in model_config["datasets"]:
            dataset = self.dataset_loader.load_dataset(dataset_id)
            if len(dataset) == 0:
                logger.error(f"Failed to load required dataset {dataset_id} for model {model_id}")
                return False
            datasets.append(dataset)
        
        # In a real implementation, you would train an actual ML model here
        # For this demo, we'll just simulate training
        
        # Simulate training time based on dataset size
        total_rows = sum(len(df) for df in datasets)
        training_time = min(5, max(2, total_rows * 0.001))  # Simulated seconds
        
        logger.info(f"Training model {model_id} on {total_rows} examples...")
        time_start = time()
        
        # Simulate training process
        import time
        time.sleep(1)  # Just wait a bit to simulate training
        
        # Update model info
        self.model_info["models"][model_id]["last_trained"] = time.strftime("%Y-%m-%d %H:%M:%S")
        self.model_info["models"][model_id]["accuracy"] = round(0.75 + np.random.random() * 0.2, 3)
        
        # Save updated model info
        with open(MODELS_DIR / 'model_info.json', 'w') as f:
            json.dump(self.model_info, f, indent=2)
        
        self.trained = True
        logger.info(f"Model {model_id} trained in {time() - time_start:.2f} seconds with simulated accuracy {self.model_info['models'][model_id]['accuracy']}")
        
        return True
    
    def predict(self, 
                model_id: str, 
                input_data: Dict[str, Any],
                limit: int = 5
               ) -> List[Dict[str, Any]]:
        """Generate predictions using a trained model"""
        if model_id not in self.model_info["models"]:
            logger.error(f"Model {model_id} not found in configuration")
            return []
        
        if not self.trained and self.model_info["models"][model_id]["last_trained"] is None:
            logger.warning(f"Model {model_id} has not been trained yet. Training now...")
            if not self.train(model_id):
                return []
        
        # In a real implementation, you would load a trained model and make predictions
        # For this demo, we'll just generate some mock predictions
        
        if model_id == "recipe_recommender":
            # Generate mock recipe recommendations
            mock_recipes = []
            
            # Customize based on input preferences
            region = input_data.get("region", "North")
            is_vegetarian = input_data.get("vegetarian", False)
            occasion = input_data.get("occasion", "")
            meal_type = input_data.get("meal_type", "")
            
            # Load Indian food dataset for realistic recommendations
            indian_food = self.dataset_loader.load_dataset("indian_food")
            
            if len(indian_food) > 0:
                # Filter based on preferences
                filtered = indian_food
                if region:
                    filtered = filtered[filtered["region"] == region]
                if is_vegetarian:
                    filtered = filtered[filtered["diet"] == "vegetarian"]
                
                # If we have results after filtering
                if len(filtered) > 0:
                    # Select random items from the filtered dataset
                    indices = np.random.choice(len(filtered), min(limit, len(filtered)), replace=False)
                    for idx in indices:
                        row = filtered.iloc[idx]
                        mock_recipes.append({
                            "id": f"ml-recipe-{idx}",
                            "name": row["name"],
                            "description": f"A {row['flavor_profile']} {row['diet']} dish from {row['region']} India.",
                            "ingredients": row["ingredients"].split(","),
                            "confidence": round(0.7 + np.random.random() * 0.29, 2),
                            "tags": self._generate_tags_from_recipe(row),
                            "mealType": meal_type or np.random.choice(["breakfast", "lunch", "dinner"]),
                            "imageUrl": f"https://source.unsplash.com/featured/300x200/?indian,food,{row['name'].replace(' ', ',')}"
                        })
                    
                    return mock_recipes
            
            # Fallback if dataset approach fails
            mock_dish_names = [
                "Butter Chicken", "Chole Bhature", "Masala Dosa", 
                "Palak Paneer", "Dal Makhani", "Vegetable Biryani",
                "Paneer Tikka Masala", "Aloo Gobi", "Rogan Josh", "Samosas"
            ]
            
            for i in range(min(limit, len(mock_dish_names))):
                confidence = round(0.7 + np.random.random() * 0.29, 2)
                dish_name = mock_dish_names[i]
                mock_recipes.append({
                    "id": f"ml-recipe-{i}",
                    "name": dish_name,
                    "description": f"ML recommendation based on your {region} preferences and {occasion} occasion.",
                    "ingredients": ["Ingredient 1", "Ingredient 2", "Ingredient 3"],
                    "confidence": confidence,
                    "tags": ["Spicy", "Healthy"] if np.random.random() > 0.5 else ["Quick", "Protein"],
                    "mealType": meal_type or np.random.choice(["breakfast", "lunch", "dinner"]),
                    "imageUrl": f"https://source.unsplash.com/featured/300x200/?indian,food,{dish_name.replace(' ', ',')}"
                })
                
            return mock_recipes
            
        elif model_id == "nutrition_analyzer":
            # Generate mock nutrition analysis
            return [{
                "calories": int(np.random.normal(500, 150)),
                "protein": round(np.random.normal(20, 8), 1),
                "carbs": round(np.random.normal(60, 20), 1),
                "fat": round(np.random.normal(15, 7), 1),
                "fiber": round(np.random.random() * 10, 1),
                "vitamins": {
                    "A": int(np.random.random() * 100),
                    "C": int(np.random.random() * 100),
                    "D": int(np.random.random() * 100),
                    "B12": int(np.random.random() * 100)
                },
                "healthScore": int(np.random.normal(70, 15)),
                "confidence": round(0.7 + np.random.random() * 0.29, 2)
            }]
        
        return []
    
    def _generate_tags_from_recipe(self, recipe: pd.Series) -> List[str]:
        """Generate appropriate tags for a recipe based on its properties"""
        tags = []
        
        if "diet" in recipe and recipe["diet"] == "vegetarian":
            if np.random.random() > 0.5:
                tags.append("Healthy")
        
        if "flavor_profile" in recipe:
            if "spicy" in recipe["flavor_profile"].lower():
                tags.append("Spicy")
            if "sweet" in recipe["flavor_profile"].lower():
                tags.append("Light")
            
        # Add some random tags
        possible_tags = ["Quick", "One-pot", "Balanced", "Protein", "Festive"]
        additional_tags = np.random.choice(
            possible_tags, 
            size=min(2, len(possible_tags)),
            replace=False
        )
        tags.extend(additional_tags)
        
        return tags
    
    def get_model_info(self) -> Dict[str, Any]:
        """Get information about available models"""
        return self.model_info["models"]


class NutritionAnalysisModel:
    """ML model for analyzing nutritional content of ingredients and recipes"""
    
    def __init__(self, dataset_loader: DatasetLoader):
        self.dataset_loader = dataset_loader
        
    def analyze_ingredients(self, ingredients: List[str], quantities: Dict[str, str] = None) -> Dict[str, Any]:
        """Analyze nutritional content of a list of ingredients"""
        
        # In a real implementation, this would use the USDA dataset or a nutritional API
        # For this demo, we'll generate mock nutritional data
        
        analysis = {
            "calories": 0,
            "protein": 0,
            "carbs": 0,
            "fat": 0,
            "fiber": 0,
            "vitamins": {
                "A": 0,
                "C": 0, 
                "D": 0,
                "B12": 0
            },
            "minerals": {
                "calcium": 0,
                "iron": 0,
                "potassium": 0
            },
            "healthScore": 0
        }
        
        # Mock nutritional values for common ingredients
        nutrition_data = {
            "chicken": {"calories": 165, "protein": 31, "carbs": 0, "fat": 3.6, "fiber": 0},
            "rice": {"calories": 130, "protein": 2.7, "carbs": 28, "fat": 0.3, "fiber": 0.4},
            "tomato": {"calories": 18, "protein": 0.9, "carbs": 3.9, "fat": 0.2, "fiber": 1.2},
            "potato": {"calories": 77, "protein": 2, "carbs": 17, "fat": 0.1, "fiber": 2.2},
            "onion": {"calories": 40, "protein": 1.1, "carbs": 9.3, "fat": 0.1, "fiber": 1.7},
            "paneer": {"calories": 265, "protein": 18.3, "carbs": 3.1, "fat": 20.8, "fiber": 0},
            "spinach": {"calories": 23, "protein": 2.9, "carbs": 3.6, "fat": 0.4, "fiber": 2.2},
            "lentils": {"calories": 116, "protein": 9, "carbs": 20, "fat": 0.4, "fiber": 8},
            "bread": {"calories": 265, "protein": 9.4, "carbs": 49, "fat": 3.2, "fiber": 2.7},
            "butter": {"calories": 717, "protein": 0.9, "carbs": 0.1, "fat": 81, "fiber": 0},
            "cheese": {"calories": 402, "protein": 25, "carbs": 1.3, "fat": 33, "fiber": 0},
        }
        
        # Vitamin data for ingredients
        vitamin_data = {
            "spinach": {"A": 60, "C": 40, "D": 0, "B12": 0},
            "tomato": {"A": 20, "C": 40, "D": 0, "B12": 0},
            "cheese": {"A": 10, "C": 0, "D": 10, "B12": 40},
            "butter": {"A": 20, "C": 0, "D": 2, "B12": 0},
            "chicken": {"A": 5, "C": 0, "D": 5, "B12": 10},
        }
        
        # Calculate totals based on ingredients
        for ingredient in ingredients:
            ingredient = ingredient.lower().strip()
            
            # Find the closest match in nutrition_data
            matched_ingredient = None
            for known_ingredient in nutrition_data:
                if known_ingredient in ingredient:
                    matched_ingredient = known_ingredient
                    break
            
            if matched_ingredient:
                # Add nutritional values
                for nutrient, value in nutrition_data[matched_ingredient].items():
                    analysis[nutrient] += value
                
                # Add vitamin values if available
                if matched_ingredient in vitamin_data:
                    for vitamin, value in vitamin_data[matched_ingredient].items():
                        analysis["vitamins"][vitamin] += value
        
        # Normalize vitamin percentages
        for vitamin in analysis["vitamins"]:
            analysis["vitamins"][vitamin] = min(100, analysis["vitamins"][vitamin])
        
        # Calculate overall health score
        # This would be more sophisticated in a real model
        protein_score = min(analysis["protein"] / 50, 1)  # 50g protein = perfect score
        fiber_score = min(analysis["fiber"] / 25, 1)  # 25g fiber = perfect score
        fat_penalty = max(0, (analysis["fat"] - 30) / 30) if analysis["fat"] > 30 else 0
        
        analysis["healthScore"] = int(((protein_score + fiber_score) / 2 - 0.5 * fat_penalty) * 100)
        analysis["healthScore"] = max(0, min(100, analysis["healthScore"]))
        
        return analysis


# API routes for ML integration
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional

# Create dataset loader and models
dataset_loader = DatasetLoader()
recommendation_model = FoodRecommendationModel(dataset_loader)
nutrition_model = NutritionAnalysisModel(dataset_loader)

# FastAPI route models
class RecipeRequest(BaseModel):
    region: Optional[str] = None
    vegetarian: Optional[bool] = False
    occasion: Optional[str] = None
    meal_type: Optional[str] = None
    limit: Optional[int] = 5

class IngredientAnalysisRequest(BaseModel):
    ingredients: List[str]
    quantities: Optional[Dict[str, str]] = None

# Define API routes
def setup_ml_routes(app: FastAPI):
    @app.get("/api/ml/datasets")
    def get_available_datasets():
        """Get available datasets information"""
        return {
            "available_datasets": dataset_loader.get_available_datasets(),
            "external_apis": dataset_loader.get_external_apis()
        }
    
    @app.get("/api/ml/models")
    def get_available_models():
        """Get available ML models information"""
        return recommendation_model.get_model_info()
    
    @app.post("/api/ml/train/{model_id}")
    def train_model(model_id: str):
        """Train a specific ML model"""
        if model_id not in recommendation_model.model_info["models"]:
            raise HTTPException(status_code=404, detail=f"Model {model_id} not found")
        
        success = recommendation_model.train(model_id)
        if not success:
            raise HTTPException(status_code=500, detail=f"Failed to train model {model_id}")
        
        return {"status": "success", "model_id": model_id}
    
    @app.post("/api/ml/recipes/recommend")
    def recommend_recipes(request: RecipeRequest):
        """Get personalized recipe recommendations"""
        predictions = recommendation_model.predict(
            "recipe_recommender", 
            {
                "region": request.region,
                "vegetarian": request.vegetarian,
                "occasion": request.occasion,
                "meal_type": request.meal_type
            },
            limit=request.limit
        )
        
        return {"recommendations": predictions}
    
    @app.post("/api/ml/nutrition/analyze")
    def analyze_nutrition(request: IngredientAnalysisRequest):
        """Analyze nutritional content of ingredients"""
        analysis = nutrition_model.analyze_ingredients(
            request.ingredients,
            request.quantities
        )
        
        return analysis


if __name__ == "__main__":
    # Test code to run this module directly for development
    loader = DatasetLoader()
    print("Available datasets:", loader.get_available_datasets().keys())
    
    # Test model
    model = FoodRecommendationModel(loader)
    model.train("recipe_recommender")
    
    # Test prediction
    predictions = model.predict("recipe_recommender", {"region": "North", "vegetarian": True}, limit=3)
    print("Predictions:", predictions)
    
    # Test nutrition analysis
    nutrition = NutritionAnalysisModel(loader)
    analysis = nutrition.analyze_ingredients(["chicken", "rice", "tomato", "onion"])
    print("Nutrition analysis:", analysis) 