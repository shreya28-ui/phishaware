import { NewCampaignForm } from "@/components/campaigns/new-campaign-form";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'New Campaign | PhishAware',
  description: 'Create a new phishing simulation campaign.',
};

export default function NewCampaignPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Campaign</CardTitle>
        <CardDescription>
          Set up a new phishing simulation campaign to test your users.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <NewCampaignForm />
      </CardContent>
    </Card>
  );
}
