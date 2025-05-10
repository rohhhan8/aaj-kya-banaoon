"""
FastAPI service for the meal recommendation engine
"""

from fastapi import FastAPI, Query, Body, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import uvicorn
from recommendation_engine import recommendation_engine as engine

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

# Root endpoint
@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": "Welcome to RasaRoots ML API"}

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}

# Meal recommendation endpoint
@app.post("/recommendations")
async def get_recommendations(request: MealRecommendationRequest):
    """Get personalized meal recommendations"""
    try:
        recommendations = engine.get_personalized_recommendations(
            preferences=request.preferences or {},
            time_of_day=request.time_of_day,
            region=request.region,
            tags=request.tags,
            n=5
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
        recommendations = engine.get_recommendations_for_occasion(
            occasion=request.occasion,
            time_of_day=request.time_of_day,
            tags=request.tags,
            n=5
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
            meal_id=request.meal_id,
            n=5
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
        from meal_data import get_meals_by_time
        
        recommendations = get_meals_by_time(time_of_day, limit=5)
        
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
        from meal_data import get_meals_by_tags
        
        recommendations = get_meals_by_tags(tags, limit=5)
        
        # Adjust for family size
        if family_size:
            recommendations = [
                engine.get_family_size_adjustments(meal, family_size)
                for meal in recommendations
            ]
        
        return {"recommendations": recommendations}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Run the FastAPI app
if __name__ == "__main__":
    uvicorn.run("api:app", host="0.0.0.0", port=5100, reload=True)