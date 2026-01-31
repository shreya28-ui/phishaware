import { EthicalAnalysisForm } from '@/components/ethics/ethical-analysis-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ethical Analysis | PhishAware',
  description: 'Analyze application features for ethical considerations using AI.',
};

export default function EthicalAnalysisPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ethical Considerations Assistant</CardTitle>
        <CardDescription>
          Use AI to analyze your application's features for ethical compliance based on the project's requirements for academic simulations.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <EthicalAnalysisForm />
      </CardContent>
    </Card>
  );
}
