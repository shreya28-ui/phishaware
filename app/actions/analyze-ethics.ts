'use server';

import { analyzeEthicalConsiderations, EthicalConsiderationsInput, EthicalConsiderationsOutput } from '@/ai/flows/ethical-considerations-assistant';

type FormState = {
  data: EthicalConsiderationsOutput | null;
  error: string | null;
};

export async function getEthicalAnalysis(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const featuresDescription = formData.get('featuresDescription');

  if (!featuresDescription || typeof featuresDescription !== 'string' || featuresDescription.trim().length < 10) {
    return { data: null, error: 'Please provide a detailed features description (minimum 10 characters).' };
  }

  try {
    const input: EthicalConsiderationsInput = { featuresDescription };
    const result = await analyzeEthicalConsiderations(input);
    return { data: result, error: null };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { data: null, error: `Failed to analyze: ${errorMessage}` };
  }
}
