import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { DishTag } from "../client/src/lib/utils";
import axios from "axios";

const daySchema = z.enum([
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday", "Any"
]);

const timeOfDaySchema = z.enum([
  "Morning", "Afternoon", "Evening", "Any"
]);

const tagsSchema = z.array(z.string()).optional();

const occasionSchema = z.enum([
  "Family Gathering", "Puja Ceremony", "diwali", "holi", "navratri", 
  "eid", "raksha-bandhan", "ganesh-chaturthi", "onam", "lohri", "pongal", "durga-puja", "janmashtami", "baisakhi", "Party"
]);

export async function registerRoutes(app: Express): Promise<Server> {
  // API Endpoints
  app.get("/api/dishes", async (req: Request, res: Response) => {
    try {
      const dishes = await storage.getAllDishes();
      res.json(dishes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dishes" });
    }
  });

  // Get dishes for a specific meal type (breakfast, lunch, dinner)
  app.get("/api/dishes/meal/:mealType", async (req: Request, res: Response) => {
    try {
      const { mealType } = req.params;
      const dishes = await storage.getDishesForMealType(mealType);
      res.json(dishes);
    } catch (error) {
      res.status(500).json({ message: `Failed to fetch ${req.params.mealType} dishes` });
    }
  });

  // Get dishes for a specific day and time - MODIFIED TO USE PYTHON BACKEND
  app.get("/api/suggestions/daily", async (req: Request, res: Response) => {
    try {
      // Handle missing parameters with defaults
      const day = req.query.day ? daySchema.parse(req.query.day) : "Any";
      const timeOfDay = req.query.timeOfDay ? timeOfDaySchema.parse(req.query.timeOfDay) : "Any";
      
      // Tags are optional
      const tagsParam = req.query.tags as string | undefined;
      const tags = tagsParam ? tagsParam.split(',') as DishTag[] : undefined;
      
      // First try to get data from the Python backend with CSV data
      try {
        // Map the timeOfDay to match what our Python backend expects
        let pythonTimeOfDay = "afternoon";
        if (timeOfDay === "Morning") pythonTimeOfDay = "morning";
        if (timeOfDay === "Evening") pythonTimeOfDay = "evening";
        
        // Call the Python backend
        const pythonResponse = await axios.post("http://localhost:5100/recommendations", {
          time_of_day: pythonTimeOfDay,
          tags: tags,
          family_size: 4,
          preferences: {}
        });
        
        console.log("Using Python backend with CSV data for daily suggestions");
        
        // Transform the response to match what the frontend expects
        const recommendations = pythonResponse.data.recommendations.map((rec: any) => ({
          id: rec.id || `dish-${rec.name.toLowerCase().replace(/\s+/g, '-')}`,
          name: rec.name,
          description: rec.description || "A delicious dish made with authentic Indian ingredients.",
          imageUrl: rec.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
          tags: Array.isArray(rec.tags) ? rec.tags : (typeof rec.tags === 'string' ? rec.tags.split(',').map((tag: string) => tag.trim()) : []),
          mealType: rec.meal_type || "lunch"
        }));
        
        return res.json(recommendations);
      } catch (pythonError) {
        console.error("Python backend error, falling back to default data:", pythonError);
        // If Python backend fails, fall back to the original implementation
      const dishes = await storage.getDishesForDayAndTime(day, timeOfDay, tags);
      res.json(dishes);
      }
    } catch (error) {
      console.error(error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid parameters", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to fetch suggestions" });
      }
    }
  });

  // Get dishes for a specific occasion - MODIFIED TO USE PYTHON BACKEND
  app.get("/api/suggestions/occasion/:occasion", async (req: Request, res: Response) => {
    try {
      const occasion = occasionSchema.parse(req.params.occasion);
      
      // Tags are optional
      const tagsParam = req.query.tags as string | undefined;
      const tags = tagsParam ? tagsParam.split(',') as DishTag[] : undefined;
      
      // First try to get data from the Python backend with CSV data
      try {
        // Call the Python backend
        const pythonResponse = await axios.post("http://localhost:5100/recommendations/occasion", {
          occasion: occasion,
          tags: tags,
          family_size: 4
        });
        
        console.log("Using Python backend with CSV data for occasion suggestions");
        
        // Transform the response to match what the frontend expects
        const recommendations = pythonResponse.data.recommendations.map((rec: any) => ({
          id: rec.id || `dish-${rec.name.toLowerCase().replace(/\s+/g, '-')}`,
          name: rec.name,
          description: rec.description || "A delicious dish made with authentic Indian ingredients.",
          imageUrl: rec.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
          tags: Array.isArray(rec.tags) ? rec.tags : (typeof rec.tags === 'string' ? rec.tags.split(',').map((tag: string) => tag.trim()) : []),
          mealType: rec.meal_type || "dinner",
          occasion: occasion
        }));
        
        return res.json(recommendations);
      } catch (pythonError) {
        console.error("Python backend error, falling back to default data:", pythonError);
        // If Python backend fails, fall back to the original implementation
      let dishes = await storage.getDishesForOccasion(occasion);
      
      // Apply tag filtering if provided
      if (tags && tags.length > 0) {
        dishes = dishes.filter(dish => 
          dish.tags && tags.some(tag => dish.tags?.includes(tag as DishTag))
        );
      }
      
      res.json(dishes);
      }
    } catch (error) {
      console.error(error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid parameters", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to fetch suggestions for occasion" });
      }
    }
  });

  // Add user feedback for a dish
  app.post("/api/feedback", async (req: Request, res: Response) => {
    try {
      const { userId, dishId, liked } = req.body;
      const dateAdded = new Date().toISOString();
      
      const feedback = await storage.addFeedback({
        userId,
        dishId,
        liked,
        dateAdded
      });
      
      res.json(feedback);
    } catch (error) {
      res.status(500).json({ message: "Failed to save feedback" });
    }
  });

  // ML API proxy endpoints
  
  // ML API health check
  app.get("/api/ml/health", async (req: Request, res: Response) => {
    try {
      const mlResponse = await axios.get("http://localhost:5100/health");
      res.json(mlResponse.data);
    } catch (error) {
      console.error("Error connecting to ML API:", error);
      res.status(503).json({ message: "ML service unavailable" });
    }
  });
  
  // ML API recommendation endpoint
  app.post("/api/ml/recommendations", async (req: Request, res: Response) => {
    try {
      const mlResponse = await axios.post("http://localhost:5100/recommendations", req.body);
      res.json(mlResponse.data);
    } catch (error) {
      console.error("Error getting ML recommendations:", error);
      res.status(500).json({ message: "Failed to get ML recommendations" });
    }
  });
  
  // ML API recommendation by occasion
  app.post("/api/ml/recommendations/occasion", async (req: Request, res: Response) => {
    try {
      const mlResponse = await axios.post("http://localhost:5100/recommendations/occasion", req.body);
      res.json(mlResponse.data);
    } catch (error) {
      console.error("Error getting ML occasion recommendations:", error);
      res.status(500).json({ message: "Failed to get ML occasion recommendations" });
    }
  });
  
  // ML API similar meals recommendation
  app.post("/api/ml/recommendations/similar", async (req: Request, res: Response) => {
    try {
      const mlResponse = await axios.post("http://localhost:5100/recommendations/similar", req.body);
      res.json(mlResponse.data);
    } catch (error) {
      console.error("Error getting ML similar recommendations:", error);
      res.status(500).json({ message: "Failed to get ML similar recommendations" });
    }
  });
  
  // ML API time-based recommendation
  app.get("/api/ml/recommendations/time/:timeOfDay", async (req: Request, res: Response) => {
    try {
      const { timeOfDay } = req.params;
      const { familySize } = req.query;
      
      const mlResponse = await axios.get(`http://localhost:5100/recommendations/time/${timeOfDay}`, {
        params: { family_size: familySize }
      });
      
      res.json(mlResponse.data);
    } catch (error) {
      console.error("Error getting ML time recommendations:", error);
      res.status(500).json({ message: "Failed to get ML time recommendations" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
