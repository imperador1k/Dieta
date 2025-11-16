
import type { FoodDetails } from "@/services/usda";

export type FoodItemData = {
    id: string;
    fdcId: number;
    description: string;
    servingSize: number; // in grams
    nutrients: FoodDetails['nutrients'];
};
