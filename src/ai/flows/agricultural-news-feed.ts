'use server';

/**
 * @fileOverview An agricultural news feed AI agent.
 *
 * - getAgriculturalNews - A function that retrieves the agricultural news.
 * - AgriculturalNewsInput - The input type for the getAgriculturalNews function.
 * - AgriculturalNewsOutput - The return type for the getAgriculturalNews function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AgriculturalNewsInputSchema = z.object({
  region: z.string().describe('The region for which to retrieve agricultural news.'),
  language: z.string().describe('The language for the news headlines.'),
});
export type AgriculturalNewsInput = z.infer<typeof AgriculturalNewsInputSchema>;

const AgriculturalNewsOutputSchema = z.object({
  newsItems: z
    .array(z.string())
    .describe('A list of agricultural news items for the specified region.'),
});
export type AgriculturalNewsOutput = z.infer<typeof AgriculturalNewsOutputSchema>;

export async function getAgriculturalNews(input: AgriculturalNewsInput): Promise<AgriculturalNewsOutput> {
  return agriculturalNewsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'agriculturalNewsPrompt',
  input: {schema: AgriculturalNewsInputSchema},
  output: {schema: AgriculturalNewsOutputSchema},
  prompt: `You are an expert in providing agricultural news for farmers.

  Provide a list of news items relevant to the region: {{{region}}}. Each item should be a single sentence.
  The news must be in the following language: {{{language}}}.
  Format it as a JSON array of strings.
  `,
});

const agriculturalNewsFlow = ai.defineFlow(
  {
    name: 'agriculturalNewsFlow',
    inputSchema: AgriculturalNewsInputSchema,
    outputSchema: AgriculturalNewsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
