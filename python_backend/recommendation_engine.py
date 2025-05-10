"""
Machine Learning Recommendation Engine for meal suggestions
"""

import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from meal_data import MEAL_DATASET, FESTIVAL_DISHES, get_meals_by_time, get_meals_by_tags, get_festival_dishes

class MealRecommendationEngine:
    """Machine Learning based meal recommendation engine"""
    
    def __init__(self):
        """Initialize the recommendation engine with meal data"""
        self.df = pd.DataFrame(MEAL_DATASET)
        # Create feature vectors for content-based filtering
        self.create_feature_vectors()
        
    def create_feature_vectors(self):
        """Create feature vectors for content-based recommendation"""
        # Create a string representation of meal features for vectorization
        self.df['features'] = self.df.apply(self._create_feature_string, axis=1)
        
        # Create TF-IDF vectorizer
        self.tfidf = TfidfVectorizer(stop_words='english')
        self.tfidf_matrix = self.tfidf.fit_transform(self.df['features'])
        
        # Calculate cosine similarity matrix
        self.cosine_sim = cosine_similarity(self.tfidf_matrix, self.tfidf_matrix)
        
    def _create_feature_string(self, row):
        """Create a string of features for each meal"""
        # Combine relevant features into a single string
        features = []
        features.append(row['name'])
        features.append(row['description'])
        features.append(row['region'])
        features.append(row['meal_type'])
        features.extend(row['tags'])
        features.extend(row['ingredients'])
        features.extend(row['suitable_for'])
        
        return ' '.join(features)
    
    def get_content_based_recommendations(self, meal_id, n=5):
        """Get content-based recommendations similar to a meal"""
        # Find the index of the meal
        meal_index = self.df[self.df['id'] == meal_id].index[0]
        
        # Get the similarity scores
        sim_scores = list(enumerate(self.cosine_sim[meal_index]))
        
        # Sort the meals based on similarity scores
        sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
        
        # Get the scores of the most similar meals (excluding itself)
        sim_scores = sim_scores[1:n+1]
        
        # Get the meal indices
        meal_indices = [i[0] for i in sim_scores]
        
        # Return the top similar meals
        return self.df.iloc[meal_indices].to_dict('records')
    
    def get_personalized_recommendations(self, preferences, time_of_day=None, region=None, tags=None, n=5):
        """Get personalized recommendations based on user preferences"""
        # Create a scoring mechanism based on user preferences
        scores = np.zeros(len(self.df))
        
        # Filter by time of day if provided
        if time_of_day:
            for i, row in self.df.iterrows():
                if time_of_day in row['suitable_for']:
                    scores[i] += 3
        
        # Filter by region if provided
        if region:
            for i, row in self.df.iterrows():
                if region == row['region']:
                    scores[i] += 2
        
        # Filter by tags if provided
        if tags:
            for i, row in self.df.iterrows():
                for tag in tags:
                    if tag in row['tags']:
                        scores[i] += 1
        
        # Apply user preferences to scores
        if 'favorite_ingredients' in preferences:
            for i, row in self.df.iterrows():
                for ingredient in preferences['favorite_ingredients']:
                    if ingredient in row['ingredients']:
                        scores[i] += 1
        
        if 'dietary_restrictions' in preferences:
            for i, row in self.df.iterrows():
                for restriction in preferences['dietary_restrictions']:
                    for ingredient in row['ingredients']:
                        if restriction.lower() in ingredient.lower():
                            scores[i] -= 10  # Strong penalty for dietary restrictions
        
        # Get the indices of top scoring meals
        top_indices = scores.argsort()[-n:][::-1]
        
        # Return the top recommended meals
        return self.df.iloc[top_indices].to_dict('records')
    
    def get_recommendations_for_occasion(self, occasion, time_of_day=None, tags=None, n=5):
        """Get recommendations based on special occasions"""
        # Check if the occasion is a festival
        festival_dishes = []
        for festival, dishes in FESTIVAL_DISHES.items():
            if festival.lower() in occasion.lower():
                festival_dishes = [meal for meal in MEAL_DATASET if meal["name"] in dishes]
                break
        
        # If we have festival-specific dishes, return them
        if festival_dishes:
            if len(festival_dishes) >= n:
                return festival_dishes[:n]
            
            # If we need more recommendations, add general recommendations
            additional_needed = n - len(festival_dishes)
            general_recommendations = self.get_personalized_recommendations(
                preferences={}, 
                time_of_day=time_of_day, 
                tags=tags, 
                n=additional_needed
            )
            
            return festival_dishes + general_recommendations
        
        # For other occasions, provide festive dishes appropriate for the time of day
        festive_dishes = [meal for meal in MEAL_DATASET if "Festive" in meal["tags"]]
        
        if time_of_day:
            festive_dishes = [meal for meal in festive_dishes if time_of_day in meal["suitable_for"]]
        
        if tags:
            festive_dishes = [meal for meal in festive_dishes if any(tag in meal["tags"] for tag in tags)]
        
        return festive_dishes[:n]
    
    def get_family_size_adjustments(self, meal, family_size):
        """Adjust meal ingredients for family size"""
        # Default recipe is for 4 people
        adjustment_factor = family_size / 4.0
        
        adjusted_meal = meal.copy()
        adjusted_meal['servings'] = family_size
        adjusted_meal['adjusted_ingredients'] = []
        
        # Adjust ingredient quantities
        for ingredient in meal.get('ingredients', []):
            # Here we would parse ingredients and adjust quantities
            # For now, just adding a placeholder
            adjusted_meal['adjusted_ingredients'].append(
                f"{ingredient} (x{adjustment_factor:.1f})"
            )
        
        return adjusted_meal

# Initialize the recommendation engine
recommendation_engine = MealRecommendationEngine()