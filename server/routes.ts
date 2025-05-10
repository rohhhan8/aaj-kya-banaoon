import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { DishTag } from "../client/src/lib/utils";

const daySchema = z.enum([
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday", "Any"
]);

const timeOfDaySchema = z.enum([
  "Morning", "Afternoon", "Evening", "Any"
]);

const tagsSchema = z.array(z.string()).optional();

const occasionSchema = z.enum([
  "Family Gathering", "Puja Ceremony", "Diwali", "Party"
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

  // Get dishes for a specific day and time
  app.get("/api/suggestions/daily", async (req: Request, res: Response) => {
    try {
      const day = daySchema.parse(req.query.day);
      const timeOfDay = timeOfDaySchema.parse(req.query.timeOfDay);
      
      // Tags are optional
      const tagsParam = req.query.tags as string | undefined;
      const tags = tagsParam ? tagsParam.split(',') as DishTag[] : undefined;
      
      const dishes = await storage.getDishesForDayAndTime(day, timeOfDay, tags);
      res.json(dishes);
    } catch (error) {
      console.error(error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid parameters", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to fetch suggestions" });
      }
    }
  });

  // Get dishes for a specific occasion
  app.get("/api/suggestions/occasion/:occasion", async (req: Request, res: Response) => {
    try {
      const occasion = occasionSchema.parse(req.params.occasion);
      
      // Tags are optional
      const tagsParam = req.query.tags as string | undefined;
      const tags = tagsParam ? tagsParam.split(',') as DishTag[] : undefined;
      
      let dishes = await storage.getDishesForOccasion(occasion);
      
      // Apply tag filtering if provided
      if (tags && tags.length > 0) {
        dishes = dishes.filter(dish => 
          tags.some(tag => dish.tags.includes(tag as DishTag))
        );
      }
      
      res.json(dishes);
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

  const httpServer = createServer(app);
  return httpServer;
}
