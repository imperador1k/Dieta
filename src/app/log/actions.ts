'use server';

import { aiFoodLogger, type AiFoodLoggerOutput } from '@/ai/flows/ai-food-logger';
import { searchFoodsUsda } from '@/services/usda';
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
