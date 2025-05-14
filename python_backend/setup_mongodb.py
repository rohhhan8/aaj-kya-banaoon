"""
MongoDB setup script for CulinaryAI
This script initializes the MongoDB database with manual dish entries
"""

import json # Not strictly needed now but kept for consistency if MANUAL_DISHES were from JSON
import os
from database import get_collection, insert_one, find_one # find_one is from our MongoDB database.py

# Sample dishes (preserve IDs 1-20 for manual entries)
MANUAL_DISHES = [
    {
        "id": "1", # Ensure this is treated as a string if your DB expects it
        "name": "Poha",
        "description": "A light, flattened rice dish that's quick to prepare and provides steady energy for busy Monday mornings. A staple breakfast in many Indian homes.",
        "imageUrl": "https://source.unsplash.com/random/300x200/?poha",
        "tags": ["Quick", "Healthy"],
        "mealType": "breakfast",
        "dayRecommended": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "timeOfDay": ["Morning"],
    },
    {
        "id": "2",
        "name": "Idli Sambar",
        "description": "These steamed rice cakes with lentil soup are perfect for Mondays when you need a light yet filling breakfast that's gentle on the stomach after weekend indulgences.",
        "imageUrl": "https://source.unsplash.com/random/300x200/?idli",
        "tags": ["Healthy", "Light"],
        "mealType": "breakfast",
        "dayRecommended": ["Monday", "Wednesday", "Friday", "Sunday"],
        "timeOfDay": ["Morning"],
    },
    # Add more dishes with IDs 3-20 here
]

def initialize_mongodb(): # Renamed back
    """
    Initialize MongoDB with manual dish entries
    
    Returns:
        Number of dishes inserted
    """
    collection = get_collection("dishes")
    inserted_count = 0
    
    # Check if the collection is empty or only has test data to decide on initialization
    # A more robust check might be needed depending on how you want to handle re-runs
    # For now, let's assume if it has very few documents, it's safe to add manual ones if missing.
    # Or, simply check for each dish individually.

    for dish_data in MANUAL_DISHES:
        # Check if a dish with this specific 'id' (custom id) already exists
        existing_dish = find_one("dishes", {"id": dish_data["id"]})
        if not existing_dish:
            # If you want MongoDB to generate its own _id, don't include it in dish_data before insert
            # If 'id' is your custom primary key, ensure it's present.
            # The insert_one in database.py returns MongoDB's _id, not necessarily your custom 'id'.
            insert_one("dishes", dish_data) # database.py's insert_one handles MongoDB insertion
            inserted_count += 1
            print(f"Inserted dish: {dish_data['name']}")
        else:
            print(f"Dish {dish_data['name']} (ID: {dish_data['id']}) already exists. Skipping.")
            
    if inserted_count == 0:
        print("No new manual dishes were inserted. They might already exist.")
        
    return inserted_count

if __name__ == "__main__":
    print("Attempting to initialize MongoDB with manual dishes...")
    inserted = initialize_mongodb()
    print(f"Finished MongoDB initialization. {inserted} new manual dishes were added.") 