'use server';

import { aiFoodLogger, type AiFoodLoggerOutput } from '@/ai/flows/ai-food-logger';
import { aiRecipeGenerator } from '@/ai/flows/ai-recipe-generator';
import { getFoodDetailsUsda, searchFoodsUsda } from '@/services/usda';
import { z } from 'zod';

const formSchema = z.object({
  foodDescription: z.string().min(3, 'Por favor, descreva o que comeu.'),
});

export interface AiLoggerState {
  result?: AiFoodLoggerOutput;
  error?: string;
  timestamp: number;
}

export async function getNutritionalInfo(
  prevState: AiLoggerState,
  formData: FormData
): Promise<AiLoggerState> {
  const validatedFields = formSchema.safeParse({
    foodDescription: formData.get('foodDescription'),
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors.foodDescription?.[0],
      timestamp: Date.now(),
    };
  }

  try {
    const result = await aiFoodLogger({
      foodDescription: validatedFields.data.foodDescription,
    });
    return { result, timestamp: Date.now() };
  } catch (e) {
    console.error(e);
    return { error: 'Falha ao obter informação nutricional. Tente novamente.', timestamp: Date.now() };
  }
}

export async function searchFood(query: string) {
    if (!query) return [];

    try {
        const results = await searchFoodsUsda(query);
        return results;
    } catch (error) {
        console.error("Error searching for food:", error);
        return [];
    }
}

export async function getFoodDetails(fdcId: number) {
    try {
        const results = await getFoodDetailsUsda(fdcId);
        return results;
    } catch (error) {
        console.error("Error getting food details:", error);
        return null;
    }
}

export async function generateRecipe(dishName: string, ingredients: string[]) {
    try {
        const result = await aiRecipeGenerator({ dishName, ingredients });
        return result.instructions;
    } catch (error) {
        console.error("Error generating recipe:", error);
        return "Não foi possível gerar a receita neste momento.";
    }
}
