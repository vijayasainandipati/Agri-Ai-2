'use server';
/**
 * @fileOverview Suggests crops based on location, weather, and season.
 *
 * - suggestCropsBasedOnLocation - A function that suggests crops for a location.
 * - CropSuggestionInput - The input type for the suggestCropsBasedOnLocation function.
 * - CropSuggestionOutput - The return type for the suggestCropsBasedOnLocation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CropSuggestionInputSchema = z.object({
  country: z.string().describe('The country of the user.'),
  region: z.string().describe('The region/state of the user.'),
  season: z.string().describe('The current season.'),
  weatherDescription: z.string().describe('A description of the current weather conditions.'),
  language: z.string().describe('The language for the response.'),
});
export type CropSuggestionInput = z.infer<typeof CropSuggestionInputSchema>;

const CropSuggestionOutputSchema = z.object({
  suggestedCrops: z.array(
    z.object({
      cropName: z.string().describe('The name of the suggested crop. This must be in English.'),
      plantingTime: z.string().describe('The optimal planting time for the crop.'),
      soilType: z.string().describe('The preferred soil type for the crop.'),
      yieldInfo: z.string().describe('Information about the expected yield of the crop.'),
    })
  ).describe('A list of suggested crops for the given location and conditions.'),
});
export type CropSuggestionOutput = z.infer<typeof CropSuggestionOutputSchema>;

export async function suggestCropsBasedOnLocation(input: CropSuggestionInput): Promise<CropSuggestionOutput> {
  return suggestCropsBasedOnLocationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'cropSuggestionPrompt',
  input: {schema: CropSuggestionInputSchema},
  output: {schema: CropSuggestionOutputSchema},
  prompt: `You are an expert agricultural advisor. Based on the provided location, season, and weather conditions, suggest the most suitable crops to grow.

Consider the following information:

Country: {{{country}}}
Region: {{{region}}}
Season: {{{season}}}
Weather Conditions: {{{weatherDescription}}}

Suggest at least three crops that are well-suited for these conditions. For each crop, provide the crop name, optimal planting time, preferred soil type, and expected yield information.

IMPORTANT: The 'cropName' field MUST be in English. Translate the values for 'plantingTime', 'soilType', and 'yieldInfo' into the user's specified language: {{{language}}}.

Format your output as a JSON array of crops with the fields 'cropName', 'plantingTime', 'soilType', and 'yieldInfo'.`,
});

const suggestCropsBasedOnLocationFlow = ai.defineFlow(
  {
    name: 'suggestCropsBasedOnLocationFlow',
    inputSchema: CropSuggestionInputSchema,
    outputSchema: CropSuggestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
