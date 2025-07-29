/**
 * @fileOverview A weather and irrigation alert AI agent.
 *
 * - getWeatherAndIrrigationAlerts - A function that handles the weather and irrigation alerts process.
 * - WeatherAndIrrigationAlertsInput - The input type for the getWeatherAndIrrigationAlerts function.
 * - WeatherAndIrrigationAlertsOutput - The return type for the getWeatherAndIrrigationAlerts function.
 */

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const WeatherAndIrrigationAlertsInputSchema = z.object({
  village: z.string().describe('The village name.'),
  cropType: z.string().describe('The type of crop planted.'),
  language: z.string().describe('The language for the response.'),
});

export type WeatherAndIrrigationAlertsInput = z.infer<
  typeof WeatherAndIrrigationAlertsInputSchema
>;

const WeatherAndIrrigationAlertsOutputSchema = z.object({
  weatherAlert: z.string().describe('Weather alerts for the village.'),
  irrigationSchedule: z
    .string()
    .describe('Recommended irrigation schedule based on weather and crop type.'),
});

export type WeatherAndIrrigationAlertsOutput = z.infer<
  typeof WeatherAndIrrigationAlertsOutputSchema
>;

export async function getWeatherAndIrrigationAlerts(
  input: WeatherAndIrrigationAlertsInput
): Promise<WeatherAndIrrigationAlertsOutput> {
  return weatherAndIrrigationAlertsFlow(input);
}

const weatherTool = ai.defineTool({
  name: 'getWeatherForecast',
  description:
    'Get the current weather data and forecast for a specific village.',
  inputSchema: z.object({
    village: z.string().describe('The village name.'),
  }),
  outputSchema: z.object({
    temperature: z.number().describe('The current temperature in Celsius.'),
    condition: z.string().describe('The current weather condition.'),
    forecast: z.string().describe('A short weather forecast for the next few days.'),
  }),
  async execute(input) {
    // This is a placeholder implementation that returns random data to simulate a real API
    console.log(`Calling FAKE weather API for village: ${input.village}`);
    const conditions = [
        { temp: 28, cond: 'Sunny', fore: 'Clear skies for the next 3 days. Low chance of rain.' },
        { temp: 22, cond: 'Cloudy with a chance of rain', fore: 'Expect scattered showers tomorrow afternoon.' },
        { temp: 32, cond: 'Hot and humid', fore: 'Heatwave conditions expected over the weekend.' },
        { temp: 26, cond: 'Partly cloudy', fore: 'Pleasant weather with a light breeze.' },
    ];
    
    const randomIndex = Math.floor(Math.random() * conditions.length);
    const randomCondition = conditions[randomIndex];

    return {
      temperature: randomCondition.temp,
      condition: randomCondition.cond,
      forecast: randomCondition.fore,
    };
  },
});

const prompt = ai.definePrompt({
  name: 'weatherAndIrrigationAlertsPrompt',
  input: {schema: WeatherAndIrrigationAlertsInputSchema},
  output: {schema: WeatherAndIrrigationAlertsOutputSchema},
  tools: [weatherTool],
  prompt: `You are an AI assistant providing weather and irrigation alerts to farmers.

  The farmer is located in the village: {{village}} and is growing {{cropType}}.

  Use the getWeatherForecast tool to get the current weather data and forecast for the village.

  Based on the weather forecast and the crop type, provide the farmer with:
  1. A weather alert, highlighting any potential risks like rain, storms, or drought conditions.
  2. A recommended irrigation schedule, advising on how often to water the crop.

  IMPORTANT: Both the alert and the schedule must be in the following language: {{{language}}}.

  Here's an example:
  Weather Alert: Be prepared for heavy rainfall and potential flooding in the next 24 hours.
  Irrigation Schedule: Due to the expected rainfall, do not irrigate your {{cropType}} crop for the next 2 days.

  YOUR RESPONSE:
  `,
});

const weatherAndIrrigationAlertsFlow = ai.defineFlow(
  {
    name: 'weatherAndIrrigationAlertsFlow',
    inputSchema: WeatherAndIrrigationAlertsInputSchema,
    outputSchema: WeatherAndIrrigationAlertsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
