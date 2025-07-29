
'use server';

/**
 * @fileOverview A voice assistant for farmers to ask questions about farming and receive relevant answers.
 *
 * - kisanVoiceAssistant - A function that handles the voice assistant process.
 * - KisanVoiceAssistantInput - The input type for the kisanVoiceAssistant function.
 * - KisanVoiceAssistantOutput - The return type for the kisanVoiceAssistant function.
 */
import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const KisanVoiceAssistantInputSchema = z.object({
  language: z.string().describe('The language of the farmer.'),
  question: z.string().describe('The question asked by the farmer.'),
  location: z.string().describe('The location of the farmer (city, state, or coordinates).'),
});
export type KisanVoiceAssistantInput = z.infer<typeof KisanVoiceAssistantInputSchema>;

const KisanVoiceAssistantOutputSchema = z.object({
  answer: z.string().describe('The answer to the farmer question, translated into their language.'),
  suggestedCrops: z.string().describe('Suggested crops based on location, translated into their language.'),
});
export type KisanVoiceAssistantOutput = z.infer<typeof KisanVoiceAssistantOutputSchema>;

export async function kisanVoiceAssistant(input: KisanVoiceAssistantInput): Promise<KisanVoiceAssistantOutput> {
  return kisanVoiceAssistantFlow(input);
}

const cropSuggestionTool = ai.defineTool({
  name: 'suggestCropsByLocation',
  description: 'Suggests crops to plant based on the location, season, and climate. The result is always in English.',
  inputSchema: z.object({
    location: z.string().describe('The location to suggest crops for (city, state, or coordinates).'),
  }),
  outputSchema: z.string(),
  async execute(input) {
    console.log(`Tool was called with location: ${input.location}`);
    const { text } = await ai.generate({
        prompt: `Suggest a short, comma-separated list of 3-4 crops suitable for growing in ${input.location}. Respond in English only.`,
    });
    return text || '';
  },
});

const prompt = ai.definePrompt({
  name: 'kisanVoiceAssistantPrompt',
  input: {schema: KisanVoiceAssistantInputSchema},
  output: {schema: KisanVoiceAssistantOutputSchema},
  tools: [cropSuggestionTool],
  prompt: `You are an AI assistant for farmers. Your most important task is to respond in the user's specified language.

  User's Language: {{{language}}}
  User's Location: {{{location}}}
  User's Question: {{{question}}}

  **RESPONSE INSTRUCTIONS**
  1.  **Analyze the question:** Understand what the user is asking.
  2.  **Use Tools (if needed):** If the question is about crop suggestions for their location, use the 'suggestCropsByLocation' tool. This tool will provide crop names in English.
  3.  **Formulate Answer in English:** Create a helpful and comprehensive answer to the user's question in English.
  4.  **TRANSLATE:** This is the most critical step. Translate the entire English answer AND any English crop suggestions you received from the tool into the user's specified language ('{{{language}}}'). Every part of the final output must be in the target language.
  5.  **Format Output:**
      -   **answer:** Put the fully translated, natural-sounding answer here.
      -   **suggestedCrops:** Put the fully translated, comma-separated list of crops here. If no crops were suggested, leave this field as an empty string.

  **IMPORTANT:** The final output in the 'answer' and 'suggestedCrops' fields MUST be entirely in '{{{language}}}'. Do not mix languages.
  `,
});

const kisanVoiceAssistantFlow = ai.defineFlow(
  {
    name: 'kisanVoiceAssistantFlow',
    inputSchema: KisanVoiceAssistantInputSchema,
    outputSchema: KisanVoiceAssistantOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
