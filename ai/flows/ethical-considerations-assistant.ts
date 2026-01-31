'use server';

/**
 * @fileOverview A GenAI tool to analyze application features for ethical considerations.
 *
 * - analyzeEthicalConsiderations - Analyzes the application features for ethical compliance.
 * - EthicalConsiderationsInput - The input type for the analyzeEthicalConsiderations function.
 * - EthicalConsiderationsOutput - The return type for the analyzeEthicalConsiderations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EthicalConsiderationsInputSchema = z.object({
  featuresDescription: z
    .string()
    .describe('A detailed description of the application features.'),
});
export type EthicalConsiderationsInput = z.infer<typeof EthicalConsiderationsInputSchema>;

const EthicalConsiderationsOutputSchema = z.object({
  ethicalDisclosurePresent: z
    .boolean()
    .describe('Whether an ethical disclosure is present in the application.'),
  gdprConsentPresent: z
    .boolean()
    .describe('Whether a GDPR-style consent banner is implemented.'),
  noCredentialHarvesting: z
    .boolean()
    .describe('Whether the application avoids real credential harvesting.'),
  noHiddenTracking: z
    .boolean()
    .describe('Whether there is no hidden background tracking present.'),
  overallEthicalCompliance: z
    .boolean()
    .describe('Overall ethical compliance of the application based on the above factors.'),
});
export type EthicalConsiderationsOutput = z.infer<typeof EthicalConsiderationsOutputSchema>;

export async function analyzeEthicalConsiderations(
  input: EthicalConsiderationsInput
): Promise<EthicalConsiderationsOutput> {
  return ethicalConsiderationsFlow(input);
}

const ethicalConsiderationsPrompt = ai.definePrompt({
  name: 'ethicalConsiderationsPrompt',
  input: {schema: EthicalConsiderationsInputSchema},
  output: {schema: EthicalConsiderationsOutputSchema},
  prompt: `You are an AI assistant designed to evaluate the ethical considerations of a phishing awareness simulation system.

  Analyze the following application features description to determine if the application incorporates ethical disclosures, includes a GDPR-style consent banner, avoids real credential harvesting, and ensures no hidden background tracking is present, thereby enforcing the academic simulation's ethical boundaries.

  Features Description: {{{featuresDescription}}}

  Based on the description, determine the following:
  - ethicalDisclosurePresent: Whether an ethical disclosure is clearly presented to the user before they interact with the simulation.
  - gdprConsentPresent: Whether a GDPR-style consent banner is implemented to obtain user consent for data processing.
  - noCredentialHarvesting: Whether the application explicitly avoids harvesting real user credentials (e.g., passwords).
  - noHiddenTracking: Whether there is no hidden background tracking of user activities without their explicit consent.
  - overallEthicalCompliance: Overall ethical compliance of the application. This should be true only if all the above considerations are true.

  Provide a boolean value (true or false) for each of the above considerations.
  Output in JSON format.
  `,
});

const ethicalConsiderationsFlow = ai.defineFlow(
  {
    name: 'ethicalConsiderationsFlow',
    inputSchema: EthicalConsiderationsInputSchema,
    outputSchema: EthicalConsiderationsOutputSchema,
  },
  async input => {
    const {output} = await ethicalConsiderationsPrompt(input);
    return output!;
  }
);
