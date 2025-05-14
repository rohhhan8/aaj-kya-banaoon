"""
Machine Learning Recommendation Engine for meal suggestions
"""

import pandas as pd
import numpy as np
import os
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from meal_data import MEAL_DATASET, FESTIVAL_DISHES, get_meals_by_time, get_meals_by_tags, get_festival_dishes
from data_loader import get_csv_data, get_available_datasets

class MealRecommendationEngine:
    """Machine Learning based meal recommendation engine"""
    
    def __init__(self, use_csv_data=False, csv_filename=None):
        """Initialize the recommendation engine with meal data
        
        Args:
            use_csv_data: If True, load data from CSV
            csv_filename: Name of the CSV file to load
        """
        if use_csv_data and csv_filename:
            try:
                # Use default approach with just the CSV data
                data_dir = os.path.join(os.path.dirname(__file__), "data")
                csv_path = os.path.join(data_dir, csv_filename)
                
                # Load CSV data directly
                csv_data = get_csv_data(csv_filename, as_dict=False)
                self.df = csv_data
                
                # Add any missing columns that might be needed
                self._ensure_required_columns()
                
                print(f"Successfully loaded CSV data with {len(self.df)} records")
            except FileNotFoundError:
                # Fall back to default data
                print(f"CSV file {csv_filename} not found. Using default data.")
                self.df = pd.DataFrame(MEAL_DATASET)
        else:
            # Use the default data
            self.df = pd.DataFrame(MEAL_DATASET)
            
        # Create feature vectors for content-based filtering
        self.create_feature_vectors()
        
    def _ensure_required_columns(self):
        """Ensure all required columns exist in the dataframe"""
        # Add missing columns with default values
        required_columns = [
            'name', 'description', 'region', 'meal_type', 
            'tags', 'ingredients', 'suitable_for'
        ]
        
        for column in required_columns:
            if column not in self.df.columns:
                if column == 'tags':
                    self.df[column] = [['Balanced']] * len(self.df)
                elif column == 'ingredients':
                    self.df[column] = [['ingredients not specified']] * len(self.df)
                elif column == 'suitable_for':
                    self.df[column] = [['Morning', 'Afternoon', 'Evening']] * len(self.df)
                elif column == 'region':
                    self.df[column] = ['India'] * len(self.df)
                elif column == 'meal_type':
                    self.df[column] = ['lunch'] * len(self.df)
                elif column == 'description':
                    self.df[column] = ['A delicious Indian dish.'] * len(self.df)
                else:
                    self.df[column] = [''] * len(self.df)
        
        # Ensure id column exists - keep existing IDs and generate new ones starting from 1001
        if 'id' not in self.df.columns:
            self.df['id'] = [str(i + 1001) for i in range(len(self.df))]
        else:
            # Make sure all rows have an ID
            max_id = 1000
            for i, row in self.df.iterrows():
                if pd.isna(row['id']) or row['id'] == '':
                    # Find the next available ID
                    max_id += 1
                    self.df.at[i, 'id'] = str(max_id)
        
        # Format all CSV data consistently
        # Convert string representations of lists to actual lists for tags, ingredients, etc.
        for column in ['tags', 'ingredients', 'suitable_for']:
            if column in self.df.columns:
                self.df[column] = self.df[column].apply(
                    lambda x: x if isinstance(x, list) else 
                              [item.strip() for item in str(x).split(',')] if isinstance(x, str) else 
                              []
                )
        
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
        
        # Safely add features that might be in the CSV but not in the default data
        for feature in ['name', 'description', 'region', 'meal_type']:
            if feature in row:
                features.append(str(row[feature]))
                
        # Handle list features safely
        for list_feature in ['tags', 'ingredients', 'suitable_for']:
            if list_feature in row:
                # Check if it's already a list or needs parsing
                if isinstance(row[list_feature], list):
                    features.extend(row[list_feature])
                elif isinstance(row[list_feature], str):
                    # Try to parse comma-separated values
                    features.extend([item.strip() for item in row[list_feature].split(',')])
        
        return ' '.join(str(feature) for feature in features if feature)
    
    def get_content_based_recommendations(self, meal_id, n=10):
        """Get content-based recommendations similar to a meal"""
        # Find the index of the meal
        try:
            meal_index = self.df[self.df['id'] == meal_id].index[0]
        except (IndexError, KeyError):
            # If meal_id not found, return a sample of n meals
            return self.df.sample(min(n, len(self.df))).to_dict('records')
        
        # Get the similarity scores
        sim_scores = list(enumerate(self.cosine_sim[meal_index]))
        
        # Sort the meals based on similarity scores
        sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
        
        # Get the scores of the n most similar meals (excluding itself)
        sim_scores = sim_scores[1:n+1]
        
        # Get the meal indices
        meal_indices = [i[0] for i in sim_scores]
        
        # Return the top n similar meals
        return self.df.iloc[meal_indices].to_dict('records')
    
    def get_personalized_recommendations(self, preferences, time_of_day=None, region=None, tags=None, n=10):
        """Get personalized recommendations based on user preferences (daily routine)"""
        # Create a scoring mechanism based on user preferences
        scores = np.zeros(len(self.df))
        
        # Apply STRICT tag filtering first if tags are provided
        # Meals not matching all tags will be effectively excluded
        if tags and len(tags) > 0:
            for i, row in self.df.iterrows():
                row_tags = row.get('tags', [])
                # Ensure row_tags is a list (it should be due to standardization in meal_data.py and engine init)
                if not isinstance(row_tags, list):
                    row_tags = [t.strip() for t in str(row_tags).split(',')] if isinstance(row_tags, str) else []
                
                if not all(requested_tag in row_tags for requested_tag in tags):
                    scores[i] = -float('inf') # Disqualify if not all tags are present

        # Map common time terms to standardized format for better matching
        time_map = {
            "morning": "Morning",
            "breakfast": "Morning",
            "afternoon": "Afternoon", 
            "lunch": "Afternoon",
            "evening": "Evening",
            "dinner": "Evening",
            "night": "Evening"
        }
        
        # Standardize the time of day
        if time_of_day:
            standardized_time = time_map.get(time_of_day.lower(), time_of_day)
        else:
            standardized_time = None
        
        # Filter by time of day if provided
        if standardized_time:
            for i, row in self.df.iterrows():
                if scores[i] == -float('inf'): continue # Skip disqualified meals
                suitable_for = row.get('suitable_for', [])
                # Now we know suitable_for is always a list
                if any(time.lower() == standardized_time.lower() for time in suitable_for):
                    scores[i] += 5  # Higher score to prioritize time matches
        
        # Filter by region if provided
        if region:
            for i, row in self.df.iterrows():
                if scores[i] == -float('inf'): continue # Skip disqualified meals
                if row.get('region') == region:
                    scores[i] += 2
        
        # Filter by tags if provided - THIS SCORING PART IS NOW REDUNDANT DUE TO STRICT FILTERING ABOVE
        # if tags:  # This block should be removed or adapted
        #     for i, row in self.df.iterrows():
        #         if scores[i] == -float('inf'): continue # Skip disqualified meals
        #         row_tags = row.get('tags', [])
        #         # Now we know tags is always a list
        #         for tag in tags:
        #             if tag in row_tags:
        #                 scores[i] += 1
        
        # Apply user preferences to scores
        if 'favorite_ingredients' in preferences:
            for i, row in self.df.iterrows():
                if scores[i] == -float('inf'): continue # Skip disqualified meals
                row_ingredients = row.get('ingredients', [])
                # Now we know ingredients is always a list
                for ingredient in preferences['favorite_ingredients']:
                    if any(ingredient.lower() in ing.lower() for ing in row_ingredients):
                        scores[i] += 1
        
        if 'dietary_restrictions' in preferences:
            for i, row in self.df.iterrows():
                if scores[i] == -float('inf'): continue # Skip disqualified meals
                row_ingredients = row.get('ingredients', [])
                # Now we know ingredients is always a list
                for restriction in preferences['dietary_restrictions']:
                    if any(restriction.lower() in ing.lower() for ing in row_ingredients):
                            scores[i] -= 10  # Strong penalty for dietary restrictions
        
        # Give a boost to newer dishes (IDs 98-127)
        for i, row in self.df.iterrows():
            if scores[i] == -float('inf'): continue # Skip disqualified meals
            try:
                # Extract numeric part of ID
                id_value = int(str(row.get('id', '0')).replace('"', ''))
                
                # Give progressively higher boosts to newer dishes
                if id_value >= 98:
                    scores[i] += 3  # Significant boost to newer dishes
            except (ValueError, TypeError, AttributeError):
                pass
        
        # Get the indices of all meals sorted by score
        all_indices = scores.argsort()[::-1]  # Descending order
        
        # Filter out the disqualified meals before proceeding to mix old/new
        valid_indices = [i for i in all_indices if scores[i] > -float('inf')]
        
        # Create a balanced mix of old and new dishes up to n items
        recommended_meals = []
        newer_dishes_indices = []
        older_dishes_indices = []
        
        for i in valid_indices: # Iterate through valid_indices only
            row = self.df.iloc[i]
            try:
                id_value = int(str(row.get('id', '0')).replace('\"\"', ''))
                if id_value >= 98:
                    newer_dishes_indices.append(i)
                else:
                    older_dishes_indices.append(i)
            except (ValueError, TypeError, AttributeError):
                older_dishes_indices.append(i) # Treat as older if ID is problematic
        
        # Aim for a mix, e.g., half new, half old, up to n
        # This is a simple mixing strategy, can be refined. User wants 6-10 results.
        num_newer_to_take = min(len(newer_dishes_indices), n // 2) # take up to half from newer
        num_older_to_take = min(len(older_dishes_indices), n - num_newer_to_take)
        
        for i in newer_dishes_indices[:num_newer_to_take]:
            recommended_meals.append(self.df.iloc[i].to_dict())
            
        for i in older_dishes_indices[:num_older_to_take]:
            recommended_meals.append(self.df.iloc[i].to_dict())
            
        # If we still need more dishes to reach n (because one category was short)
        # and there are remaining dishes from the other category or overall.
        if len(recommended_meals) < n:
            remaining_pool = [idx for idx in valid_indices if not any(self.df.iloc[idx]['id'] == rec['id'] for rec in recommended_meals)]
            needed_more = n - len(recommended_meals)
            for i in remaining_pool[:needed_more]:
                 recommended_meals.append(self.df.iloc[i].to_dict())

        # Ensure we don't exceed n, though the logic above should handle it.
        return recommended_meals[:n]
    
    def get_recommendations_for_occasion(self, occasion, time_of_day=None, tags=None):
        """Get recommendations based on special occasions"""
        # Map time_of_day if provided
        time_map = {
            "morning": "Morning",
            "breakfast": "Morning",
            "afternoon": "Afternoon", 
            "lunch": "Afternoon",
            "evening": "Evening",
            "dinner": "Evening",
            "night": "Evening"
        }
        
        if time_of_day:
            standardized_time = time_map.get(time_of_day.lower(), time_of_day)
        else:
            standardized_time = None
            
        # Handle party and family gathering occasions
        if "party" in occasion.lower() or "family gathering" in occasion.lower():
            party_dishes = []
            
            # Look for appropriate party/family dishes
            for meal in MEAL_DATASET:
                # Check tags for party-appropriate terms
                meal_tags = meal.get("tags", [])
                suitable_for = meal.get("suitable_for", [])
                
                party_keywords = ["festive", "spicy", "rich", "balanced", "protein"]
                
                # Check if this is a good party dish based on various attributes
                is_party_dish = False
                
                # Check for balanced, rich, or festive tags (now always list format)
                if any(keyword.lower() in tag.lower() for tag in meal_tags for keyword in party_keywords):
                    is_party_dish = True
                
                # Check meal type for main courses and popular items
                if meal.get("meal_type") in ["main course", "dinner", "lunch"]:
                    is_party_dish = True
                
                # Check suitable_for for celebrations (now always list format)
                if any("celebration" in item.lower() for item in suitable_for):
                    is_party_dish = True
                
                # Include dinner/evening dishes for parties
                if standardized_time == "Evening" and meal.get("meal_type") in ["dinner", "main course"]:
                    is_party_dish = True
                
                if is_party_dish:
                    party_dishes.append(meal)
            
            # If we found party dishes, return them
            if party_dishes:
                # Sort by calories (higher calories first) for party foods
                party_dishes = sorted(party_dishes, 
                                    key=lambda x: int(x.get("calories", 0)) if isinstance(x.get("calories"), (int, str)) and str(x.get("calories", "0")).isdigit() else 0, 
                                    reverse=True)
                return party_dishes[:10] # Limit general party dishes to 10
        
        # Handle regular festivals
        festival_dishes_for_occasion = []
        for festival, dishes in FESTIVAL_DISHES.items():
            if festival.lower() in occasion.lower():
                # Use case-insensitive matching for dish names, allowing for partial matches
                festival_dishes_for_occasion = [
                    meal for meal in MEAL_DATASET 
                    if any(dish.lower() in meal["name"].lower() for dish in dishes)
                ]
                break
        
        # If we have festival-specific dishes, return them (all of them).
        # If not, proceed to find general festive dishes.
        if festival_dishes_for_occasion:
            return festival_dishes_for_occasion # NO LIMIT for specific festival dishes
        
        # For other occasions or if no specific festival dishes were found, 
        # provide general festive dishes appropriate for the time of day and tags.
        # This acts as a fallback.
        general_festive_dishes = []
        for meal in MEAL_DATASET:
            meal_tags = meal.get("tags", [])
            # Tags are now always lists
            if any("Festive" in tag for tag in meal_tags) or any(specific_tag in meal_tags for specific_tag in FESTIVAL_DISHES.keys()): # Broader check for any festival tag
                general_festive_dishes.append(meal)
        
        if standardized_time:
            filtered_dishes = []
            for meal in general_festive_dishes:
                suitable_for = meal.get("suitable_for", [])
                # suitable_for is now always a list
                if standardized_time in suitable_for:
                    filtered_dishes.append(meal)
            general_festive_dishes = filtered_dishes
        
        if tags:
            filtered_dishes = []
            for meal in general_festive_dishes:
                meal_tags = meal.get("tags", [])
                # Tags is now always a list
                if any(tag in meal_tags for tag in tags):
                    filtered_dishes.append(meal)
            general_festive_dishes = filtered_dishes
        
        return general_festive_dishes[:10] # Limit general festive fallback to 10
    
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

    def list_available_datasets(self):
        """List all available datasets that can be loaded"""
        return get_available_datasets()

# Initialize the recommendation engine with default data
# To use CSV data, initialize with: MealRecommendationEngine(use_csv_data=True, csv_filename="your_file.csv")
recommendation_engine = MealRecommendationEngine()

# Function to reinitialize the engine with CSV data
def load_engine_with_csv(csv_filename):
    """Load the recommendation engine with data from a CSV file"""
    global recommendation_engine
    recommendation_engine = MealRecommendationEngine(use_csv_data=True, csv_filename=csv_filename)
    return recommendation_engine