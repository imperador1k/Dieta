'use server';

/**
 * @fileOverview This file defines an AI flow to generate cooking recipes.
 *
 * It takes a dish name and a list of ingredients and returns step-by-step cooking instructions.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const AiRecipeGeneratorInputSchema = z.object({
  dishName: z.string().describe('The name of the dish, e.g., "Bitoque" or "Bacalhau à Brás".'),
  ingredients: z.array(z.string()).describe('A list of ingredients for the dish.'),
});
export type AiRecipeGeneratorInput = z.infer<typeof AiRecipeGeneratorInputSchema>;

const AiRecipeGeneratorOutputSchema = z.object({
  instructions: z.string().describe('The step-by-step cooking instructions for the dish, in European Portuguese.'),
});
export type AiRecipeGeneratorOutput = z.infer<typeof AiRecipeGeneratorOutputSchema>;

export async function aiRecipeGenerator(input: AiRecipeGeneratorInput): Promise<AiRecipeGeneratorOutput> {
  return aiRecipeGeneratorFlow(input);
}

const aiRecipeGeneratorPrompt = ai.definePrompt({
  name: 'aiRecipeGeneratorPrompt',
  input: { schema: AiRecipeGeneratorInputSchema },
  output: { schema: AiRecipeGeneratorOutputSchema },
  prompt: `You are an expert chef. A user will provide a dish name and a list of ingredients. Your task is to generate clear, step-by-step cooking instructions.

**IMPORTANT RULES:**
1.  All output instructions **MUST** be in **European Portuguese (Portugal)**.
2.  The tone should be helpful and easy to follow for a home cook.
3.  Format the instructions with clear steps (e.g., "1. Tempere os bifes...", "2. Aqueça o azeite..."). Use newline characters for separation.

**Dish Name:**
"{{{dishName}}}"

**Ingredients:**
{{#each ingredients}}
- {{{this}}}
{{/each}}

Based on this information, create the cooking recipe.
`,
});

const aiRecipeGeneratorFlow = ai.defineFlow(
  {
    name: 'aiRecipeGeneratorFlow',
    inputSchema: AiRecipeGeneratorInputSchema,
    outputSchema: AiRecipeGeneratorOutputSchema,
  },
  async input => {
    try {
        const { output } = await aiRecipeGeneratorPrompt(input);
        return output || { instructions: "" };
    } catch (error) {
        console.error("Error in AI Recipe Generator flow:", error);
        return { instructions: "Ocorreu um erro ao gerar a receita. Tente novamente." };
    }
  }
);
