import { NewCampaignForm } from "@/components/campaigns/new-campaign-form";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'New Campaign | PhishAware',
  description: 'Create a new phishing simulation campaign.',
};

import { PageTransition } from "@/components/ui/animations";
import { motion } from "framer-motion";

export default function NewCampaignPage() {
  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-none shadow-2xl bg-gradient-to-br from-card to-card/50">
            <CardHeader className="space-y-1">
              <CardTitle className="text-3xl font-bold">Create Campaign</CardTitle>
              <CardDescription className="text-base text-muted-foreground">
                Set up a new phishing simulation campaign to test your users.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <NewCampaignForm />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </PageTransition>
  );
}
