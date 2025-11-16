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
    description: z.string().describe('The description of the portion, e.g., "1 medium" or "1 cup, sliced".'),
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

Key Responsibilities:
1.  **Analyze Food Item:** Understand the provided food item.
2.  **Identify Common Portions:** Determine typical serving sizes (e.g., "1 medium", "1 cup, sliced", "1 slice").
3.  **Estimate Gram Weight:** Provide a realistic gram weight for each portion.
4.  **Structured Output:** Return the data as an array of portion objects in the specified JSON format. If no common portions can be determined, return an empty array.

Example 1:
Food Item: "Banana, raw"
Your Output:
{
  "portions": [
    { "description": "1 extra small (less than 6\\" long)", "gramWeight": 81 },
    { "description": "1 small (6\\" to 6-7/8\\" long)", "gramWeight": 101 },
    { "description": "1 medium (7\\" to 7-7/8\\" long)", "gramWeight": 118 },
    { "description": "1 large (8\\" to 8-7/8\\" long)", "gramWeight": 136 },
    { "description": "1 extra large (9\\" or longer)", "gramWeight": 152 },
    { "description": "1 cup, sliced", "gramWeight": 150 },
    { "description": "1 cup, mashed", "gramWeight": 225 }
  ]
}

Example 2:
Food Item: "Apple"
Your Output:
{
  "portions": [
    { "description": "1 small (2-3/4\\" dia)", "gramWeight": 149 },
    { "description": "1 medium (3\\" dia)", "gramWeight": 182 },
    { "description": "1 large (3-1/4\\" dia)", "gramWeight": 223 },
    { "description": "1 cup, quartered or chopped", "gramWeight": 125 },
    { "description": "1 cup, sliced", "gramWeight": 110 }
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
