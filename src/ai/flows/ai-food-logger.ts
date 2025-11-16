'use server';

/**
 * @fileOverview This file defines an AI-powered food logging flow using Genkit.
 *
 * The flow takes a natural language description of food intake as input and returns
 * a structured estimation of the nutritional values of the food items mentioned.
 *
 * @interface AiFoodLoggerInput - Input schema for the AI food logger, expects a text description of food intake.
 * @interface AiFoodLoggerOutput - Output schema for the AI food logger, provides a structured estimation of nutritional values.
 * @function aiFoodLogger - The main exported function to initiate the AI food logging process.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiFoodLoggerInputSchema = z.object({
  foodDescription: z
    .string()
    .describe(
      'A natural language description of the food items consumed, including quantities if known. Example: \'I ate 150g of chicken and sweet potato.\''
    ),
});
export type AiFoodLoggerInput = z.infer<typeof AiFoodLoggerInputSchema>;

const AiFoodLoggerOutputSchema = z.object({
  estimatedNutritionalValues: z.record(
    z.object({
      calories: z.number().optional().describe('Estimated calories for this food item.'),
      protein: z.number().optional().describe('Estimated protein (in grams) for this food item.'),
      carbohydrates: z.number().optional().describe('Estimated carbohydrates (in grams) for this food item.'),
      fat: z.number().optional().describe('Estimated fat (in grams) for this food item.'),
    })
  ).describe('A structured estimation of the nutritional values for each food item identified in the input description.')
});

export type AiFoodLoggerOutput = z.infer<typeof AiFoodLoggerOutputSchema>;

export async function aiFoodLogger(input: AiFoodLoggerInput): Promise<AiFoodLoggerOutput> {
  return aiFoodLoggerFlow(input);
}

const aiFoodLoggerPrompt = ai.definePrompt({
  name: 'aiFoodLoggerPrompt',
  input: {schema: AiFoodLoggerInputSchema},
  output: {schema: AiFoodLoggerOutputSchema},
  prompt: `You are a nutritional expert. Your task is to analyze a user's description of the food they ate and provide a structured estimate of its nutritional values.

Key Responsibilities:
1.  **Identify Food Items:** Accurately identify all individual food items from the user's description.
2.  **Estimate Quantities:** If the user does not provide specific quantities, estimate them based on common portion sizes (e.g., a "steak" is likely 150-200g, a "handful of almonds" is about 20-25g).
3.  **Calculate Nutritional Values:** For each identified food item, estimate the calories, protein, carbohydrates, and fat in grams.
4.  **Structured Output:** Return the data in the specified JSON format, with each food item as a key.

Example:
User Input: "For lunch, I had a grilled chicken breast with a side of sweet potato fries and a small salad with olive oil dressing."
Your Estimated Output:
{
  "estimatedNutritionalValues": {
    "grilled chicken breast": { "calories": 220, "protein": 40, "carbohydrates": 0, "fat": 5 },
    "sweet potato fries": { "calories": 180, "protein": 2, "carbohydrates": 35, "fat": 4 },
    "small salad with olive oil dressing": { "calories": 100, "protein": 1, "carbohydrates": 5, "fat": 8 }
  }
}

User's food description to process:
"{{{foodDescription}}}"
`,
});

const aiFoodLoggerFlow = ai.defineFlow(
  {
    name: 'aiFoodLoggerFlow',
    inputSchema: AiFoodLoggerInputSchema,
    outputSchema: AiFoodLoggerOutputSchema,
  },
  async input => {
    const {output} = await aiFoodLoggerPrompt(input);
    return output!;
  }
);
