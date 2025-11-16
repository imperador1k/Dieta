'use server';

/**
 * @fileOverview This file defines an AI flow to estimate common portion sizes for a given food item.
 *
 * It takes a food description and returns a list of common household portions and their estimated gram weights.
 * This is used as a fallback when the USDA API does not provide portion information.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AiPortionEstimatorInputSchema = z.object({
  foodDescription: z.string().describe('The name or description of the food item, e.g., "Banana, raw" or "Apple".'),
});
export type AiPortionEstimatorInput = z.infer<typeof AiPortionEstimatorInputSchema>;

const PortionSchema = z.object({
    description: z.string().describe('The description of the portion, e.g., "1 medium" or "1 cup, sliced". Must be in Portuguese.'),
    gramWeight: z.number().describe('The estimated weight of the portion in grams.'),
});

const AiPortionEstimatorOutputSchema = z.object({
  portions: z.array(PortionSchema).describe('A list of common portion estimates for the food item.'),
});
export type AiPortionEstimatorOutput = z.infer<typeof AiPortionEstimatorOutputSchema>;

export async function aiPortionEstimator(input: AiPortionEstimatorInput): Promise<AiPortionEstimatorOutput> {
  return aiPortionEstimatorFlow(input);
}

const aiPortionEstimatorPrompt = ai.definePrompt({
  name: 'aiPortionEstimatorPrompt',
  input: { schema: AiPortionEstimatorInputSchema },
  output: { schema: AiPortionEstimatorOutputSchema },
  prompt: `You are an expert nutritionist. A user will provide a food item, and your task is to provide common household portion sizes for it.

**IMPORTANT RULES:**
1.  All output descriptions **MUST** be in **European Portuguese (Portugal)**.
2.  All units of measurement **MUST** be in the **metric system** (e.g., cm, ml, etc.). Do not use imperial units like inches (' or ").

Key Responsibilities:
1.  **Analyze Food Item:** Understand the provided food item.
2.  **Identify Common Portions:** Determine typical serving sizes (e.g., "1 média", "1 chávena, fatiada", "1 fatia").
3.  **Estimate Gram Weight:** Provide a realistic gram weight for each portion.
4.  **Structured Output:** Return the data as an array of portion objects in the specified JSON format. If no common portions can be determined, return an empty array.

Example 1:
Food Item: "Banana, raw"
Your Output:
{
  "portions": [
    { "description": "1 extra pequena (menos de 15 cm)", "gramWeight": 81 },
    { "description": "1 pequena (15 a 17 cm)", "gramWeight": 101 },
    { "description": "1 média (18 a 20 cm)", "gramWeight": 118 },
    { "description": "1 grande (20 a 22 cm)", "gramWeight": 136 },
    { "description": "1 extra grande (mais de 23 cm)", "gramWeight": 152 },
    { "description": "1 chávena, fatiada", "gramWeight": 150 },
    { "description": "1 chávena, amassada", "gramWeight": 225 }
  ]
}

Example 2:
Food Item: "Apple"
Your Output:
{
  "portions": [
    { "description": "1 pequena (aprox. 7 cm diâmetro)", "gramWeight": 149 },
    { "description": "1 média (aprox. 7.5 cm diâmetro)", "gramWeight": 182 },
    { "description": "1 grande (aprox. 8 cm diâmetro)", "gramWeight": 223 },
    { "description": "1 chávena, em quartos ou picada", "gramWeight": 125 },
    { "description": "1 chávena, fatiada", "gramWeight": 110 }
  ]
}

Food item to process:
"{{{foodDescription}}}"
`,
});

const aiPortionEstimatorFlow = ai.defineFlow(
  {
    name: 'aiPortionEstimatorFlow',
    inputSchema: AiPortionEstimatorInputSchema,
    outputSchema: AiPortionEstimatorOutputSchema,
  },
  async input => {
    try {
        const { output } = await aiPortionEstimatorPrompt(input);
        return output || { portions: [] };
    } catch (error) {
        console.error("Error in AI Portion Estimator flow:", error);
        // In case of any error, return an empty array to prevent crashes
        return { portions: [] };
    }
  }
);
