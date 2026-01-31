'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2, Fish } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

import { Suspense } from 'react';

function LoginSimulationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const q = searchParams.get('q');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    if (!q) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Tracking token is missing. Cannot proceed.',
      });
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/submit-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ q }),
      });

      if (res.ok) {
        const data = await res.json();
        router.push(data.redirectUrl);
      } else {
        throw new Error('Failed to submit data.');
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Submission Failed',
        description: 'There was an error processing your request.',
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Fish className="h-10 w-10 text-blue-600" />
          </div>
          <CardTitle>Sign in to your account</CardTitle>
          <CardDescription>
            Use your corporate credentials to sign in.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@company.com"
                required
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Sign In
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function LoginSimulationPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <LoginSimulationContent />
    </Suspense>
  );
}
