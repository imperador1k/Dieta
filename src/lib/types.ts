
import type { FoodDetails } from "@/services/usda";

export type FoodItemData = {
    id: string;
    fdcId: number;
    description: string;
    servingSize: number; // in grams
    nutrients: FoodDetails['nutrients'];
    eaten?: boolean;
};

export type FoodPortion = {
    id: number;
    gramWeight: number;
    portionDescription: string;
}

export type MealItem = (FoodItemData & { type: 'food' }) | (Dish & { type: 'dish', eaten?: boolean });


export interface Meal {
    id: string;
    name: string;
    items: MealItem[]; 
    totalCalories: number;
    protein: number;
    carbs: number;
    fat: number;
    note?: string;
    eaten?: boolean;
    date?: string; // Add date field for historical tracking
    createdAt?: Date; // Add timestamp for ordering
};

export type Variation = {
    id: string;
    name: string;
};

export interface Plan {
    id: string;
    name: string;
    description: string;
    isActive: boolean;
    targets: {
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
    };
    variations: Variation[];
}

export interface Dish {
    id: string;
    name:string;
    description: string;
    ingredients: FoodItemData[];
    instructions: string;
}

export interface EvolutionPhoto {
    id: string;
    date: string; // ISO 8601 date string
    imageUrl: string;
    imageHint?: string;
    weight: number; // Made required since we always set it now
    width: number;
    height: number;
    publicId?: string; // Cloudinary public ID for image management
}

export interface BodyMeasurement {
    date: string; // ISO 8601 date string
    weight?: number; // in kg
    bodyFat?: number; // in percentage
    neck?: number; // in cm
    waist?: number; // in cm
    hips?: number; // in cm
}

export interface UserProfile {
    name: string;
    email: string;
    avatarUrl?: string;
    age: number;
    height: number; // in cm
    gender: 'male' | 'female';
}
    
