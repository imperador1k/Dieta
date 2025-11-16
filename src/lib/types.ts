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
}

export interface BodyMeasurement {
    date: string; // ISO 8601 date string
    weight?: number; // in kg
    bodyFat?: number; // in percentage
}
    
