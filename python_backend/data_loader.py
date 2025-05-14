"""
Dataset loader utilities for CulinaryAI
This module handles loading and processing CSV and other data files
"""

import os
import csv
import json
import pandas as pd
from typing import List, Dict, Any, Optional
from database import get_collection, insert_one, find_many

# Base path for all data files
DATA_DIR = os.path.join(os.path.dirname(__file__), "data")

def get_csv_data(filename: str, as_dict: bool = True) -> List[Dict[str, Any]] | pd.DataFrame:
    """
    Load data from a CSV file
    
    Args:
        filename: Name of the CSV file in the data directory
        as_dict: If True, returns list of dictionaries; if False, returns pandas DataFrame
        
    Returns:
        List of dictionaries where keys are column names and values are row values,
        or pandas DataFrame if as_dict is False
    """
    filepath = os.path.join(DATA_DIR, filename)
    
    if not os.path.exists(filepath):
        raise FileNotFoundError(f"CSV file not found: {filepath}")
        
    if as_dict:
        data = []
        with open(filepath, 'r', encoding='utf-8') as file:
            csv_reader = csv.DictReader(file)
            for row in csv_reader:
                data.append(row)
        return data
    else:
        return pd.read_csv(filepath)

def load_csv_to_mongodb(filename: str, collection_name: str = "dishes") -> int:
    """
    Load CSV data into MongoDB
    
    Args:
        filename: Name of the CSV file in the data directory
        collection_name: Name of the MongoDB collection to load data into
        
    Returns:
        Number of records loaded
    """
    data = get_csv_data(filename)
    
    # Get MongoDB collection
    collection = get_collection(collection_name)
    
    # Insert data into MongoDB
    inserted_count = 0
    for record in data:
        # Check if record already exists by name
        existing = collection.find_one({"name": record.get("name")})
        if not existing:
            # Generate a unique ID if not present
            if "_id" not in record:
                # Increment the highest ID in the collection
                max_id = collection.find_one(sort=[("id", -1)])
                next_id = 1
                if max_id and "id" in max_id:
                    next_id = int(max_id["id"]) + 1
                # Ensure it's higher than 20 to not conflict with manually added entries
                next_id = max(next_id, 21)
                record["id"] = str(next_id)
                
            collection.insert_one(record)
            inserted_count += 1
    
    return inserted_count

def export_to_json(data: List[Dict[str, Any]], output_filename: str) -> str:
    """
    Export data to a JSON file
    
    Args:
        data: List of dictionaries to export
        output_filename: Name for the output JSON file (without extension)
        
    Returns:
        Path to the created JSON file
    """
    output_path = os.path.join(DATA_DIR, f"{output_filename}.json")
    
    with open(output_path, 'w', encoding='utf-8') as file:
        json.dump(data, file, indent=2)
        
    return output_path

def get_available_datasets() -> List[Dict[str, str]]:
    """
    Get information about all available datasets in the data directory
    
    Returns:
        List of dictionaries with dataset information (name, type, size)
    """
    datasets = []
    
    if not os.path.exists(DATA_DIR):
        return datasets
        
    for filename in os.listdir(DATA_DIR):
        filepath = os.path.join(DATA_DIR, filename)
        if os.path.isfile(filepath):
            file_size = os.path.getsize(filepath) / (1024 * 1024)  # Size in MB
            
            file_type = filename.split('.')[-1].lower() if '.' in filename else 'unknown'
            
            datasets.append({
                'name': filename,
                'type': file_type,
                'size': f"{file_size:.2f} MB"
            })
            
    return datasets

def get_mongodb_dishes() -> List[Dict[str, Any]]:
    """
    Get all dishes from MongoDB
    
    Returns:
        List of dishes from MongoDB
    """
    return find_many("dishes", {}) 