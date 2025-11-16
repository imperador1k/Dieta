// src/services/usda.ts

const USDA_API_KEY = process.env.USDA_API_KEY;
const USDA_API_URL = "https://api.nal.usda.gov/fdc/v1";

export interface FoodSearchResult {
  fdcId: number;
  description: string;
  brandOwner?: string;
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
}

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

  return data.foods.map((food: any) => ({
    fdcId: food.fdcId,
    description: food.description,
    brandOwner: food.brandOwner,
  }));
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
  
  const getNutrientValue = (nutrientId: number) => {
    const nutrient = data.foodNutrients.find(
      (n: any) => n.nutrient.id === nutrientId
    );
    // The amount is per 100g, so we return that.
    return nutrient ? nutrient.amount : 0;
  };

  return {
    fdcId: data.fdcId,
    description: data.description,
    // Nutrients are based on 100g serving
    nutrients: {
      calories: getNutrientValue(1008), // Energy in Kcal
      protein: getNutrientValue(1003), // Protein
      fat: getNutrientValue(1004), // Total lipid (fat)
      carbohydrates: getNutrientValue(1005), // Carbohydrate, by difference
    },
  };
}
