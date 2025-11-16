
import type { FoodDetails } from "@/services/usda";

export type FoodItemData = {
    id: string;
    fdcId: number;
    description: string;
    servingSize: number; // in grams
    nutrients: FoodDetails['nutrients'];
};

export type FoodPortion = {
    id: number;
    gramWeight: number;
    portionDescription: string;
}
