'use server';

/**
 * @fileOverview This file implements the AI-powered crop disease detection flow.
 *
 * - detectCropDisease - The main function to detect crop diseases from an image.
 * - DetectCropDiseaseInput - The input type for the detectCropDisease function.
 * - DetectCropDiseaseOutput - The output type for the detectCropDisease function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectCropDiseaseInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a leaf, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  language: z.string().describe('The language for the response.'),
});
export type DetectCropDiseaseInput = z.infer<typeof DetectCropDiseaseInputSchema>;

const DetectCropDiseaseOutputSchema = z.object({
  diseaseName: z.string().describe('The name of the detected disease, if any.'),
  confidence: z.number().describe('The confidence level of the disease detection (0-1).'),
  treatment: z.string().describe('Suggested treatments for the detected disease.'),
  fertilizerRecommendations: z
    .string()
    .describe('Recommendations for fertilizer application to address the disease.'),
});
export type DetectCropDiseaseOutput = z.infer<typeof DetectCropDiseaseOutputSchema>;

export async function detectCropDisease(input: DetectCropDiseaseInput): Promise<DetectCropDiseaseOutput> {
  return detectCropDiseaseFlow(input);
}

const detectCropDiseasePrompt = ai.definePrompt({
  name: 'detectCropDiseasePrompt',
  input: {schema: DetectCropDiseaseInputSchema},
  output: {schema: DetectCropDiseaseOutputSchema},
  prompt: `You are an expert in plant pathology. Analyze the provided image of a leaf and
determine if any disease is present. Provide the disease name, a confidence level,
suggested treatments, and fertilizer recommendations. If no disease is detected,
state that the leaf appears healthy.

All textual responses ('diseaseName', 'treatment', 'fertilizerRecommendations') must be in the following language: {{{language}}}.

Leaf Image: {{media url=photoDataUri}}`,
});

const detectCropDiseaseFlow = ai.defineFlow(
  {
    name: 'detectCropDiseaseFlow',
    inputSchema: DetectCropDiseaseInputSchema,
    outputSchema: DetectCropDiseaseOutputSchema,
  },
  async input => {
    const {output} = await detectCropDiseasePrompt(input);
    return output!;
  }
);
