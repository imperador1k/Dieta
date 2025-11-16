// src/services/usda.ts

import type { FoodPortion } from "@/lib/types";

const USDA_API_KEY = process.env.USDA_API_KEY;
const USDA_API_URL = "https://api.nal.usda.gov/fdc/v1";

export interface FoodSearchResult {
  fdcId: number;
  description: string;
  brandOwner?: string;
  nutrients: {
    calories: number;
    protein: number;
    fat: number;
    carbohydrates: number;
  };
}

export interface FoodDetails {
  fdcId: number;
  description: string;
  nutrients: {
    calories: number;
    protein: number;
    fat: number;
    carbohydrates: number;
  };
  portions?: FoodPortion[];
}

const getNutrientValue = (foodNutrients: any[], nutrientId: number) => {
    const nutrient = foodNutrients.find(
      (n: any) => n.nutrientId === nutrientId || n.nutrient?.id === nutrientId
    );
    return nutrient ? (nutrient.value ?? nutrient.amount ?? 0) : 0;
};

export async function searchFoodsUsda(query: string): Promise<FoodSearchResult[]> {
  if (!USDA_API_KEY) {
    console.error("USDA API key is not configured.");
    return [];
  }

  const response = await fetch(
    `${USDA_API_URL}/foods/search?api_key=${USDA_API_KEY}&query=${encodeURIComponent(query)}&dataType=Branded,Foundation,SR%20Legacy&pageSize=25`
  );

  if (!response.ok) {
    console.error("Failed to fetch from USDA API", response.statusText);
    return [];
  }

  const data = await response.json();

  return data.foods.map((food: any) => {
    const nutrients = food.foodNutrients || [];
    return {
        fdcId: food.fdcId,
        description: food.description,
        brandOwner: food.brandOwner,
        nutrients: {
            calories: getNutrientValue(nutrients, 1008),
            protein: getNutrientValue(nutrients, 1003),
            fat: getNutrientValue(nutrients, 1004),
            carbohydrates: getNutrientValue(nutrients, 1005),
        }
    }
  });
}

export async function getFoodDetailsUsda(fdcId: number): Promise<FoodDetails | null> {
  if (!USDA_API_KEY) {
    console.error("USDA API key is not configured.");
    return null;
  }

  const response = await fetch(
    `${USDA_API_URL}/food/${fdcId}?api_key=${USDA_API_KEY}&format=full`
  );

  if (!response.ok) {
    console.error("Failed to fetch food details from USDA API", response.statusText);
    return null;
  }

  const data = await response.json();
  
  const portions = data.foodPortions?.map((p: any) => ({
      id: p.id,
      gramWeight: p.gramWeight,
      portionDescription: p.portionDescription || `${p.amount} ${p.modifier}`
  })) || [];

  return {
    fdcId: data.fdcId,
    description: data.description,
    nutrients: {
      calories: getNutrientValue(data.foodNutrients, 1008),
      protein: getNutrientValue(data.foodNutrients, 1003),
      fat: getNutrientValue(data.foodNutrients, 1004),
      carbohydrates: getNutrientValue(data.foodNutrients, 1005),
    },
    portions: portions,
  };
}
