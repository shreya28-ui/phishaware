'use client';

import { use } from 'react';
import Image from 'next/image';
import { ShieldAlert } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Quiz } from '@/components/landing/quiz';

export default function LandingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 antialiased">
      <Card className="w-full max-w-2xl animate-in fade-in-50">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <ShieldAlert className="h-10 w-10" />
          </div>
          <CardTitle className="text-2xl font-bold text-primary">This was a phishing simulation!</CardTitle>
          <CardDescription>You clicked a link from an email designed to test phishing awareness.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="rounded-lg border bg-card p-4">
              <h3 className="font-semibold text-destructive">🚨 Warning signs you might have missed:</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                <li>An urgent or threatening tone demanding immediate action.</li>
                <li>An unfamiliar sender or a slightly altered known email address.</li>
                <li>A generic greeting like "Dear User" instead of your name.</li>
                <li>Requests for sensitive information like passwords or financial details.</li>
                <li>Suspicious links that don't match the sender's official domain when you hover over them.</li>
              </ul>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <h3 className="font-semibold text-green-600">✅ What you should do next time:</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                <li>Always verify the sender's email address.</li>
                <li>Hover over links to preview the actual URL before clicking.</li>
                <li>Never enter credentials or personal information on a page you reached via an unexpected email.</li>
                <li>When in doubt, contact the company or person directly through official channels (not by replying to the email).</li>
                <li>Enable Two-Factor Authentication (2FA) on all your important accounts.</li>
              </ul>
            </div>
          </div>
          <Quiz />
        </CardContent>
      </Card>
    </div>
  );
}
