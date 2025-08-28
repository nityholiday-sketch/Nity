'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating personalized travel tips based on a selected tour package.
 *
 * The flow takes a tour package name as input and returns a set of personalized travel tips.
 * - `generatePersonalizedTravelTips` - A function that generates personalized travel tips for a given tour package.
 * - `PersonalizedTravelTipsInput` - The input type for the `generatePersonalizedTravelTips` function.
 * - `PersonalizedTravelTipsOutput` - The output type for the `generatePersonalizedTravelTips` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import wav from 'wav';

const PersonalizedTravelTipsInputSchema = z.object({
  tourPackageName: z.string().describe('The name of the selected tour package.'),
});
export type PersonalizedTravelTipsInput = z.infer<typeof PersonalizedTravelTipsInputSchema>;

const PersonalizedTravelTipsOutputSchema = z.object({
  travelTips: z.string().describe('Personalized travel tips for the selected tour package.'),
});
export type PersonalizedTravelTipsOutput = z.infer<typeof PersonalizedTravelTipsOutputSchema>;

export async function generatePersonalizedTravelTips(
  input: PersonalizedTravelTipsInput
): Promise<PersonalizedTravelTipsOutput> {
  return personalizedTravelTipsFlow(input);
}

const personalizedTravelTipsPrompt = ai.definePrompt({
  name: 'personalizedTravelTipsPrompt',
  input: {schema: PersonalizedTravelTipsInputSchema},
  output: {schema: PersonalizedTravelTipsOutputSchema},
  prompt: `You are a travel expert. Generate personalized travel tips for users based on the selected tour package.

  Tour Package Name: {{{tourPackageName}}}

  Provide practical and helpful tips to ensure a smooth and enjoyable travel experience related to the specified tour package.`,
});

const personalizedTravelTipsFlow = ai.defineFlow(
  {
    name: 'personalizedTravelTipsFlow',
    inputSchema: PersonalizedTravelTipsInputSchema,
    outputSchema: PersonalizedTravelTipsOutputSchema,
  },
  async input => {
    const {output} = await personalizedTravelTipsPrompt(input);
    return output!;
  }
);
