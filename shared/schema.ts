import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { DishTag } from "../client/src/lib/utils";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  familySize: integer("family_size").default(4),
  preferences: jsonb("preferences").$type<string[]>().default([]),
});

export const dishes = pgTable("dishes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  tags: jsonb("tags").$type<DishTag[]>().default([]),
  mealType: text("meal_type").notNull(),
  occasion: text("occasion"),
  regionSpecific: boolean("region_specific").default(false),
  seasonal: boolean("seasonal").default(false),
  dayRecommended: jsonb("day_recommended").$type<string[]>().default([]),
  timeOfDay: jsonb("time_of_day").$type<string[]>().default([]),
});

export const userFeedback = pgTable("user_feedback", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  dishId: integer("dish_id").notNull(),
  liked: boolean("liked").notNull(),
  dateAdded: text("date_added").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  familySize: true,
  preferences: true,
});

export const insertDishSchema = createInsertSchema(dishes).pick({
  name: true,
  description: true,
  imageUrl: true,
  tags: true,
  mealType: true,
  occasion: true,
  regionSpecific: true,
  seasonal: true,
  dayRecommended: true,
  timeOfDay: true,
});

export const insertUserFeedbackSchema = createInsertSchema(userFeedback).pick({
  userId: true,
  dishId: true,
  liked: true,
  dateAdded: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertDish = z.infer<typeof insertDishSchema>;
export type Dish = typeof dishes.$inferSelect;

export type InsertUserFeedback = z.infer<typeof insertUserFeedbackSchema>;
export type UserFeedback = typeof userFeedback.$inferSelect;
