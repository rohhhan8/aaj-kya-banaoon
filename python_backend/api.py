"""
FastAPI service for the meal recommendation engine
"""

from fastapi import FastAPI, Query, Body, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import uvicorn
import os
import shutil
from recommendation_engine import recommendation_engine as default_engine, load_engine_with_csv, MealRecommendationEngine
from data_loader import get_available_datasets, load_csv_to_mongodb, get_mongodb_dishes
from database import get_collection, find_one, find_many, insert_one

# Use the default engine with meal_data.py data
engine = default_engine
print(f"Using default meal dataset from meal_data.py with {len(engine.df)} entries")

app = FastAPI(title="RasaRoots ML API", 
              description="ML-powered meal recommendation API for RasaRoots",
              version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Pydantic models for request/response
class MealRecommendationRequest(BaseModel):
    """Request model for meal recommendations"""
    time_of_day: Optional[str] = None
    region: Optional[str] = None
    tags: Optional[List[str]] = None
    family_size: Optional[int] = 4
    preferences: Optional[Dict[str, List[str]]] = {}

class OccasionRecommendationRequest(BaseModel):
    """Request model for occasion-based recommendations"""
    occasion: str
    time_of_day: Optional[str] = None
    tags: Optional[List[str]] = None
    family_size: Optional[int] = 4

class SimilarMealRequest(BaseModel):
    """Request model for similar meal recommendations"""
    meal_id: str
    family_size: Optional[int] = 4

# Dataset management models
class DatasetResponse(BaseModel):
    """Response model for dataset operations"""
    name: str
    type: str
    size: str
    
class LoadDatasetRequest(BaseModel):
    """Request model for loading a dataset"""
    filename: str

# MongoDB models
class MongoDishResponse(BaseModel):
    """Response model for MongoDB dish operations"""
    id: str
    name: str
    description: Optional[str] = None
    
# Root endpoint
@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": "Welcome to RasaRoots ML API"}

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    try:
        # Attempt to get a collection to verify DB connection
        get_collection("dishes") 
        db_status = "connected (MongoDB)"
    except Exception as e:
        print(f"Health check DB connection error: {e}")
        db_status = "disconnected (MongoDB)"
    return {"status": "healthy", "database": db_status}

# Meal recommendation endpoint
@app.post("/recommendations")
async def get_recommendations(request: MealRecommendationRequest):
    """Get personalized meal recommendations"""
    try:
        recommendations = engine.get_personalized_recommendations(
            preferences=request.preferences or {},
            time_of_day=request.time_of_day,
            region=request.region,
            tags=request.tags
        )
        
        # Adjust for family size
        if request.family_size:
            recommendations = [
                engine.get_family_size_adjustments(meal, request.family_size)
                for meal in recommendations
            ]
        
        return {"recommendations": recommendations}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Occasion-based recommendation endpoint
@app.post("/recommendations/occasion")
async def get_occasion_recommendations(request: OccasionRecommendationRequest):
    """Get recommendations for special occasions"""
    try:
        # Map time_of_day if provided
        if request.time_of_day:
            time_mapping = {
                "morning": "Morning",
                "breakfast": "Morning",
                "afternoon": "Afternoon", 
                "lunch": "Afternoon",
                "evening": "Evening",
                "dinner": "Evening",
                "night": "Evening"
            }
            standardized_time = time_mapping.get(request.time_of_day.lower(), request.time_of_day)
        else:
            standardized_time = None
        
        recommendations = engine.get_recommendations_for_occasion(
            occasion=request.occasion,
            time_of_day=standardized_time,
            tags=request.tags
        )
        
        # Adjust for family size
        if request.family_size:
            recommendations = [
                engine.get_family_size_adjustments(meal, request.family_size)
                for meal in recommendations
            ]
        
        return {"recommendations": recommendations}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Similar meal recommendation endpoint
@app.post("/recommendations/similar")
async def get_similar_recommendations(request: SimilarMealRequest):
    """Get similar meal recommendations"""
    try:
        recommendations = engine.get_content_based_recommendations(
            meal_id=request.meal_id
        )
        
        # Adjust for family size
        if request.family_size:
            recommendations = [
                engine.get_family_size_adjustments(meal, request.family_size)
                for meal in recommendations
            ]
        
        return {"recommendations": recommendations}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Time-based recommendation endpoint (simple GET request)
@app.get("/recommendations/time/{time_of_day}")
async def get_time_recommendations(
    time_of_day: str, 
    family_size: int = Query(4, description="Family size for portion adjustment")
):
    """Get recommendations based on time of day"""
    try:
        # Map common time terms to standardized time periods
        time_mapping = {
            "morning": "Morning",
            "breakfast": "Morning",
            "afternoon": "Afternoon", 
            "lunch": "Afternoon",
            "evening": "Evening",
            "dinner": "Evening",
            "night": "Evening"
        }
        
        # Standardize the time_of_day parameter
        standardized_time = time_mapping.get(time_of_day.lower(), time_of_day)
        
        print(f"Getting recommendations for time: {standardized_time}")
        
        recommendations = engine.get_personalized_recommendations(
            preferences={}, 
            time_of_day=standardized_time
        )
        
        # Adjust for family size
        if family_size:
            recommendations = [
                engine.get_family_size_adjustments(meal, family_size)
                for meal in recommendations
            ]
        
        return {"recommendations": recommendations}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Tag-based recommendation endpoint (simple GET request)
@app.get("/recommendations/tags")
async def get_tag_recommendations(
    tags: List[str] = Query(..., description="List of tags to filter by"),
    family_size: int = Query(4, description="Family size for portion adjustment")
):
    """Get recommendations based on tags"""
    try:
        # Get recommendations using personalized recommendations with tags
        recommendations = engine.get_personalized_recommendations(
            preferences={}, 
            tags=tags
        )
        
        # Adjust for family size
        if family_size:
            recommendations = [
                engine.get_family_size_adjustments(meal, family_size)
                for meal in recommendations
            ]
        
        return {"recommendations": recommendations}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Dataset management endpoints
@app.get("/datasets", response_model=List[DatasetResponse])
async def list_datasets():
    """List all available datasets"""
    try:
        datasets = get_available_datasets()
        return datasets
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/datasets/load")
async def load_dataset(request: LoadDatasetRequest):
    """Load a dataset into the recommendation engine"""
    try:
        # Load the dataset into MongoDB
        inserted_count = load_csv_to_mongodb(request.filename)
        
        # Reinitialize the engine with MongoDB data
        # This would need to be implemented in recommendation_engine.py
        # engine = load_engine_with_mongodb()
        
        return {
            "message": f"Successfully loaded dataset: {request.filename}",
            "inserted_count": inserted_count
        }
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail=f"Dataset not found: {request.filename}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# MongoDB dish endpoints
@app.get("/mongodb/dishes")
async def get_dishes():
    """Get all dishes from MongoDB"""
    try:
        dishes = get_mongodb_dishes()
        return {"dishes": dishes, "count": len(dishes)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Run the FastAPI app
if __name__ == "__main__":
    uvicorn.run("api:app", host="0.0.0.0", port=5100, reload=True)