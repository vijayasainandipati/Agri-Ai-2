'use server';

/**
 * @fileOverview A market price prediction AI agent.
 *
 * - predictMarketPrice - A function that predicts market prices for a crop.
 * - MarketPricePredictorInput - The input type for the predictMarketPrice function.
 * - MarketPricePredictorOutput - The return type for the predictMarketPrice function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const MarketPricePredictorInputSchema = z.object({
  cropName: z.string().describe('The name of the crop.'),
  marketName: z.string().describe('The name of the market.'),
  language: z.string().describe('The language for the response.'),
});

export type MarketPricePredictorInput = z.infer<typeof MarketPricePredictorInputSchema>;

const MarketPricePredictorOutputSchema = z.object({
  prediction: z.string().describe('A textual summary of the price prediction and recommendation.'),
  priceData: z.array(
    z.object({
      week: z.string().describe("The week label (e.g., 'Week 1', 'Current')."),
      price: z.number().describe('The predicted or historical price for that week.'),
    })
  ).describe('A list of price data points for the last and next few weeks.'),
});

export type MarketPricePredictorOutput = z.infer<typeof MarketPricePredictorOutputSchema>;

export async function predictMarketPrice(input: MarketPricePredictorInput): Promise<MarketPricePredictorOutput> {
  return marketPricePredictorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'marketPricePredictorPrompt',
  input: { schema: MarketPricePredictorInputSchema },
  output: { schema: MarketPricePredictorOutputSchema },
  prompt: `You are an expert agricultural market analyst.
  
  Based on the given crop, "{{cropName}}", and market, "{{marketName}}", predict the price trend for the next four weeks.
  
  Provide the following:
  1. A textual summary and recommendation:
     - Analyze the likely trend (rise, fall, or stable).
     - Recommend the best time for the farmer to sell (e.g., "now", "in 2 weeks").
     - This summary MUST be in the user's specified language: {{{language}}}.
  2. A list of price data points for charting:
     - Include prices for the last two weeks, the current week, and the next four weeks.
     - The 'week' labels should be in English (e.g., 'Week -2', 'Current', 'Week +1').
     - The 'price' should be a number.

  IMPORTANT: Generate plausible but realistic price data in Indian Rupees (INR) for this prediction. The 'price' value must be a number only, without any currency symbols.`,
});

const marketPricePredictorFlow = ai.defineFlow(
  {
    name: 'marketPricePredictorFlow',
    inputSchema: MarketPricePredictorInputSchema,
    outputSchema: MarketPricePredictorOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
