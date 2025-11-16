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
  prompt: `You are a nutritional expert.  A user will provide a description of the food they ate, and you will provide a structured estimate of the nutritional values of those food items.

  Consider common portion sizes when estimating quantities if not explicitly provided.

  Food description: {{{foodDescription}}}
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
