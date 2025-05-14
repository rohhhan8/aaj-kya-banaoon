import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type DishTag = 
  | "Healthy" 
  | "Light" 
  | "Spicy" 
  | "Quick" 
  | "Festive" 
  | "Protein" 
  | "Probiotic" 
  | "One-pot"
  | "Balanced";

export interface DishSuggestion {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  tags: DishTag[];
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
  confidence?: number; // ML confidence score (0-1)
}

export const mealTimeByHour = (hour: number): "Morning" | "Afternoon" | "Evening" => {
  if (hour >= 5 && hour < 12) {
    return "Morning";
  } else if (hour >= 12 && hour < 17) {
    return "Afternoon";
  } else {
    return "Evening";
  }
};

export const getDayAndMealContext = (day: string, timeOfDay: string) => {
  // Default to breakfast for morning, lunch for afternoon, dinner for evening
  let mealType = timeOfDay === "Morning" ? "breakfast" : timeOfDay === "Afternoon" ? "lunch" : "dinner";
  
  // Contextualize the suggestions based on day and time
  let contextTitle = "";
  let contextDescription = "";
  
  switch (day) {
    case "Monday":
      if (timeOfDay === "Morning") {
        contextTitle = "Breakfast Ideas for Monday Morning";
        contextDescription = "Start your week with these energizing dishes perfect for a busy morning.";
      } else if (timeOfDay === "Afternoon") {
        contextTitle = "Lunch Ideas for Monday Afternoon";
        contextDescription = "Rejuvenate your workday with these balanced lunch options.";
      } else {
        contextTitle = "Dinner Ideas for Monday Evening";
        contextDescription = "Unwind from your day with these comforting yet simple dinner options.";
      }
      break;
    case "Tuesday":
      if (timeOfDay === "Morning") {
        contextTitle = "Breakfast Ideas for Tuesday Morning";
        contextDescription = "Quick and nutritious breakfast options to keep your week momentum going.";
      } else if (timeOfDay === "Afternoon") {
        contextTitle = "Lunch Ideas for Tuesday Afternoon";
        contextDescription = "Midweek energy-boosting lunch suggestions for your busy day.";
      } else {
        contextTitle = "Dinner Ideas for Tuesday Evening";
        contextDescription = "Explore these flavorful yet easy-to-prepare dinner options for your Tuesday.";
      }
      break;
    // ... Additional days could be added here
    case "Saturday":
    case "Sunday":
      if (timeOfDay === "Morning") {
        contextTitle = `Breakfast Ideas for ${day} Morning`;
        contextDescription = "Leisurely weekend breakfast options to enjoy with family.";
      } else if (timeOfDay === "Afternoon") {
        contextTitle = `Lunch Ideas for ${day} Afternoon`;
        contextDescription = "Special family-style lunch suggestions for your weekend.";
      } else {
        contextTitle = `Dinner Ideas for ${day} Evening`;
        contextDescription = "End your weekend with these delightful dinner options.";
      }
      break;
    default:
      if (timeOfDay === "Morning") {
        contextTitle = `Breakfast Ideas for ${day} Morning`;
        contextDescription = "Start your day right with these breakfast options.";
      } else if (timeOfDay === "Afternoon") {
        contextTitle = `Lunch Ideas for ${day} Afternoon`;
        contextDescription = "Midday meal options to keep you energized.";
      } else {
        contextTitle = `Dinner Ideas for ${day} Evening`;
        contextDescription = "Wind down with these dinner suggestions.";
      }
  }
  
  return { mealType, contextTitle, contextDescription };
};
