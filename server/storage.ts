import { 
  users, type User, type InsertUser,
  dishes, type Dish, type InsertDish,
  userFeedback, type UserFeedback, type InsertUserFeedback 
} from "@shared/schema";
import { DishTag } from "../client/src/lib/utils";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Dish operations
  getDish(id: number): Promise<Dish | undefined>;
  getAllDishes(): Promise<Dish[]>;
  createDish(dish: InsertDish): Promise<Dish>;
  getDishesForMealType(mealType: string): Promise<Dish[]>;
  getDishesForOccasion(occasion: string): Promise<Dish[]>;
  getDishesWithTags(tags: DishTag[]): Promise<Dish[]>;
  getDishesForDayAndTime(day: string, timeOfDay: string, tags?: DishTag[]): Promise<Dish[]>;
  
  // Feedback operations
  addFeedback(feedback: InsertUserFeedback): Promise<UserFeedback>;
  getUserFeedback(userId: number): Promise<UserFeedback[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private dishes: Map<number, Dish>;
  private feedbacks: Map<number, UserFeedback>;
  private userIdCounter: number;
  private dishIdCounter: number;
  private feedbackIdCounter: number;

  constructor() {
    this.users = new Map();
    this.dishes = new Map();
    this.feedbacks = new Map();
    this.userIdCounter = 1;
    this.dishIdCounter = 1;
    this.feedbackIdCounter = 1;
    
    // Initialize with sample dishes
    this.initializeSampleDishes();
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  async getDish(id: number): Promise<Dish | undefined> {
    return this.dishes.get(id);
  }
  
  async getAllDishes(): Promise<Dish[]> {
    return Array.from(this.dishes.values());
  }
  
  async createDish(insertDish: InsertDish): Promise<Dish> {
    const id = this.dishIdCounter++;
    const dish: Dish = { ...insertDish, id };
    this.dishes.set(id, dish);
    return dish;
  }
  
  async getDishesForMealType(mealType: string): Promise<Dish[]> {
    return Array.from(this.dishes.values()).filter(
      (dish) => dish.mealType === mealType
    );
  }
  
  async getDishesForOccasion(occasion: string): Promise<Dish[]> {
    return Array.from(this.dishes.values()).filter(
      (dish) => dish.occasion === occasion
    );
  }
  
  async getDishesWithTags(tags: DishTag[]): Promise<Dish[]> {
    if (!tags || tags.length === 0) {
      return this.getAllDishes();
    }
    
    return Array.from(this.dishes.values()).filter(
      (dish) => dish.tags && tags.some(tag => dish.tags.includes(tag))
    );
  }
  
  async getDishesForDayAndTime(day: string, timeOfDay: string, tags?: DishTag[]): Promise<Dish[]> {
    let mealType = "breakfast";
    
    if (timeOfDay === "Afternoon") {
      mealType = "lunch";
    } else if (timeOfDay === "Evening") {
      mealType = "dinner";
    }
    
    const dayFiltered = Array.from(this.dishes.values()).filter(
      (dish) => dish.dayRecommended && (dish.dayRecommended.includes(day) || dish.dayRecommended.includes("Any"))
    );
    
    const timeFiltered = dayFiltered.filter(
      (dish) => dish.timeOfDay && (dish.timeOfDay.includes(timeOfDay) || dish.timeOfDay.includes("Any"))
    );
    
    const mealTypeFiltered = timeFiltered.filter(
      (dish) => dish.mealType === mealType
    );
    
    if (tags && tags.length > 0) {
      return mealTypeFiltered.filter(
        (dish) => dish.tags && tags.some(tag => dish.tags.includes(tag))
      );
    }
    
    return mealTypeFiltered;
  }
  
  async addFeedback(insertFeedback: InsertUserFeedback): Promise<UserFeedback> {
    const id = this.feedbackIdCounter++;
    const feedback: UserFeedback = { ...insertFeedback, id };
    this.feedbacks.set(id, feedback);
    return feedback;
  }
  
  async getUserFeedback(userId: number): Promise<UserFeedback[]> {
    return Array.from(this.feedbacks.values()).filter(
      (feedback) => feedback.userId === userId
    );
  }
  
  private initializeSampleDishes() {
    const sampleDishes: InsertDish[] = [
      {
        name: "Poha",
        description: "A light, flattened rice dish that's quick to prepare and provides steady energy for busy Monday mornings. A staple breakfast in many Indian homes.",
        imageUrl: "https://images.unsplash.com/photo-1605888969139-42cca4308aa2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        tags: ["Quick", "Healthy"],
        mealType: "breakfast",
        dayRecommended: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        timeOfDay: ["Morning"],
      },
      {
        name: "Idli Sambar",
        description: "These steamed rice cakes with lentil soup are perfect for Mondays when you need a light yet filling breakfast that's gentle on the stomach after weekend indulgences.",
        imageUrl: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        tags: ["Healthy", "Light"],
        mealType: "breakfast",
        dayRecommended: ["Monday", "Wednesday", "Friday", "Sunday"],
        timeOfDay: ["Morning"],
      },
      {
        name: "Ragi Dosa",
        description: "Start your Monday with this nutritious finger millet dosa that's rich in calcium and iron. A popular health-conscious choice for beginning the week on a nutritious note.",
        imageUrl: "https://pixabay.com/get/g9cbdc55006253e1803eba4c60ebf67da9cda08ed1ec5aa867a591b754a56a80eeef421a79ca34b35047818efba3e734b4e906940fd0525135f20c7945d2ee52a_1280.jpg",
        tags: ["Healthy", "Quick"],
        mealType: "breakfast",
        dayRecommended: ["Monday", "Tuesday", "Thursday"],
        timeOfDay: ["Morning"],
      },
      {
        name: "Upma",
        description: "This savory semolina porridge is easy to digest and provides sustained energy - ideal for Monday mornings when you need to ease back into the work week routine.",
        imageUrl: "https://images.unsplash.com/photo-1627662056598-dcfc5000f769?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        tags: ["Quick", "Light"],
        mealType: "breakfast",
        dayRecommended: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        timeOfDay: ["Morning"],
      },
      {
        name: "Methi Paratha",
        description: "These fenugreek-infused flatbreads stay fresh for hours and provide iron and nutrients. Perfect for a Monday tiffin that's both tasty and nutritious.",
        imageUrl: "https://images.unsplash.com/photo-1604152135912-04a022e23696?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        tags: ["Healthy", "Protein"],
        mealType: "lunch",
        dayRecommended: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        timeOfDay: ["Afternoon"],
      },
      {
        name: "Curd Rice",
        description: "A cooling rice dish mixed with yogurt that's perfect for hot days. Its probiotic properties help digestion, making it ideal for a Monday lunch when your system needs gentle food.",
        imageUrl: "https://pixabay.com/get/gc745f269e89ef1a62649d41b4903dcd112856125886315b8b253f1debcadac8fb3ba878f63d342122adbf10dc2e366ff68d2cd8fa5741df5b7c9c71e918b6ae8_1280.jpg",
        tags: ["Light", "Probiotic"],
        mealType: "lunch",
        dayRecommended: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        timeOfDay: ["Afternoon"],
      },
      {
        name: "Rajma Chawal",
        description: "This protein-rich kidney bean curry with rice provides sustained energy throughout the workday. A Monday favorite that's both comforting and energizing.",
        imageUrl: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        tags: ["Protein", "Healthy"],
        mealType: "lunch",
        dayRecommended: ["Tuesday", "Thursday", "Sunday"],
        timeOfDay: ["Afternoon"],
      },
      {
        name: "Vegetable Pulao",
        description: "This aromatic rice dish with mixed vegetables is easy to pack and stays fresh. A balanced meal that doesn't need reheating - perfect for Monday lunches away from home.",
        imageUrl: "https://pixabay.com/get/ga45a1ff8160d9581a8ede04b57ee3880365d16fd8fcf102259103755f11f05c9ab99beeaa0ed0d4cf191140989e38853374b53f8fb24d71f7743030529f18d91_1280.jpg",
        tags: ["One-pot", "Balanced"],
        mealType: "lunch",
        dayRecommended: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        timeOfDay: ["Afternoon"],
      },
      // Dinner dishes
      {
        name: "Dal Tadka",
        description: "A comforting lentil preparation that's light on the stomach and perfect for weeknight dinners. Pairs well with rice or roti.",
        imageUrl: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        tags: ["Protein", "Light"],
        mealType: "dinner",
        dayRecommended: ["Monday", "Tuesday", "Wednesday", "Thursday"],
        timeOfDay: ["Evening"],
      },
      {
        name: "Palak Paneer",
        description: "Cottage cheese cubes in a nutritious spinach gravy. A great way to include greens in your dinner after a long day.",
        imageUrl: "https://images.unsplash.com/photo-1596139632728-6d36b54c4dba?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        tags: ["Healthy", "Protein"],
        mealType: "dinner",
        dayRecommended: ["Wednesday", "Friday"],
        timeOfDay: ["Evening"],
      },
      // Special occasion dishes
      {
        name: "Paneer Butter Masala",
        description: "Rich, creamy paneer curry that's a crowd-pleaser for family gatherings and special occasions.",
        imageUrl: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        tags: ["Festive", "Protein"],
        mealType: "dinner",
        occasion: "Family Gathering",
        dayRecommended: ["Saturday", "Sunday"],
        timeOfDay: ["Evening"],
      },
      {
        name: "Kheer",
        description: "A creamy rice pudding infused with cardamom and saffron, traditionally prepared for pujas and religious ceremonies.",
        imageUrl: "https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        tags: ["Festive", "Light"],
        mealType: "dinner",
        occasion: "Puja Ceremony",
        dayRecommended: ["Any"],
        timeOfDay: ["Any"],
      },
      {
        name: "Gulab Jamun",
        description: "Sweet, spongy milk solids balls soaked in rose and cardamom-flavored sugar syrup. A must-have sweet during Diwali celebrations.",
        imageUrl: "https://images.unsplash.com/photo-1589289043835-94f84e5cd01e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        tags: ["Festive", "Sweet"],
        mealType: "dessert",
        occasion: "Diwali",
        dayRecommended: ["Any"],
        timeOfDay: ["Any"],
      },
      {
        name: "Vegetable Biryani",
        description: "Fragrant rice dish cooked with mixed vegetables and aromatic spices. Perfect for serving a crowd at parties.",
        imageUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        tags: ["Festive", "One-pot", "Spicy"],
        mealType: "dinner",
        occasion: "Party",
        dayRecommended: ["Any"],
        timeOfDay: ["Evening"],
      }
    ];
    
    sampleDishes.forEach(dish => {
      this.createDish(dish);
    });
  }
}

export const storage = new MemStorage();
