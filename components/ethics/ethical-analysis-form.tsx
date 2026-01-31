'use client';

import { useActionState } from 'react';
import { getEthicalAnalysis } from '@/app/actions/analyze-ethics';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2, XCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { Label } from '@/components/ui/label';

const initialState = {
  data: null,
  error: null,
};

export function EthicalAnalysisForm() {
  const [state, formAction, isPending] = useActionState(getEthicalAnalysis, initialState);

  const ResultItem = ({ label, value }: { label: string; value: boolean }) => (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium">{label}</span>
      {value ? (
        <CheckCircle2 className="h-5 w-5 text-green-500" />
      ) : (
        <XCircle className="h-5 w-5 text-red-500" />
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <form action={formAction} className="space-y-4">
        <div className="grid w-full gap-1.5">
          <Label htmlFor="featuresDescription">Application Features Description</Label>
          <Textarea
            id="featuresDescription"
            name="featuresDescription"
            placeholder="Describe the application features, including user interaction, data handling, and disclosures..."
            className="min-h-[150px]"
            required
          />
        </div>
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Analyze
        </Button>
      </form>

      {state.error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

      {state.data && (
        <Card>
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ResultItem label="Ethical Disclosure Present" value={state.data.ethicalDisclosurePresent} />
            <ResultItem label="GDPR Consent Present" value={state.data.gdprConsentPresent} />
            <ResultItem label="No Real Credential Harvesting" value={state.data.noCredentialHarvesting} />
            <ResultItem label="No Hidden Background Tracking" value={state.data.noHiddenTracking} />
            <div className="my-4 border-t border-border"></div>
            <div className="flex items-center justify-between font-bold">
              <span>Overall Ethical Compliance</span>
              {state.data.overallEthicalCompliance ? (
                <span className="flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="h-5 w-5" /> Compliant
                </span>
              ) : (
                <span className="flex items-center gap-2 text-red-600">
                  <XCircle className="h-5 w-5" /> Non-Compliant
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
