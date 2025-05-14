"""
MongoDB database connection for CulinaryAI
"""

import os
import pymongo
from typing import Dict, List, Any, Optional

# MongoDB connection URI
MONGODB_URI = "mongodb+srv://what_tocook:yEMSHGYTBmcb1yg4@cluster0.wsbb06d.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
DB_NAME = "culinaryai" # Assuming the database name remains 'culinaryai'

# Create MongoDB connection
def get_database():
    """
    Get MongoDB database connection
    
    Returns:
        MongoDB database connection
    """
    try:
        client = pymongo.MongoClient(MONGODB_URI)
        # Ping to confirm connection
        client.admin.command('ping') 
        return client[DB_NAME]
    except pymongo.errors.ConnectionFailure as e:
        print(f"Could not connect to MongoDB: {e}")
        print(f"Using URI: {MONGODB_URI}")
        print("Please ensure MONGODB_URI is correct, your IP is whitelisted in Atlas, and the user/password are correct.")
        raise
    except Exception as e:
        print(f"An unexpected error occurred with MongoDB connection: {e}")
        raise

# Helper functions to work with collections
def get_collection(collection_name: str):
    """
    Get a MongoDB collection
    
    Args:
        collection_name: Name of the collection
        
    Returns:
        MongoDB collection object
    """
    db = get_database()
    return db[collection_name]

def insert_one(collection_name: str, data: Dict[str, Any]) -> str:
    """
    Insert a document into a collection
    
    Args:
        collection_name: Name of the collection
        data: Document to insert
        
    Returns:
        ID of the inserted document as a string
    """
    collection = get_collection(collection_name)
    result = collection.insert_one(data)
    return str(result.inserted_id)

def find_one(collection_name: str, query: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """
    Find a document in a collection
    
    Args:
        collection_name: Name of the collection
        query: Query to find document
        
    Returns:
        Document if found, None otherwise
    """
    collection = get_collection(collection_name)
    result = collection.find_one(query)
    return result

def find_many(collection_name: str, query: Dict[str, Any]) -> List[Dict[str, Any]]:
    """
    Find multiple documents in a collection
    
    Args:
        collection_name: Name of the collection
        query: Query to find documents
        
    Returns:
        List of documents
    """
    collection = get_collection(collection_name)
    results = collection.find(query)
    return list(results)

def update_one(collection_name: str, query: Dict[str, Any], update_data: Dict[str, Any]) -> bool:
    """
    Update a document in a collection
    
    Args:
        collection_name: Name of the collection
        query: Query to find document to update
        update_data: Update operations (fields to set)
        
    Returns:
        True if document was updated, False otherwise
    """
    collection = get_collection(collection_name)
    result = collection.update_one(query, {"$set": update_data})
    return result.modified_count > 0

def delete_one(collection_name: str, query: Dict[str, Any]) -> bool:
    """
    Delete a document from a collection
    
    Args:
        collection_name: Name of the collection
        query: Query to find document to delete
        
    Returns:
        True if document was deleted, False otherwise
    """
    collection = get_collection(collection_name)
    result = collection.delete_one(query)
    return result.deleted_count > 0 