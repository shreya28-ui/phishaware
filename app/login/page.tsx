import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { UserAuthForm } from '@/components/auth/user-auth-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Fish } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Login | PhishAware',
    description: 'Login or create an account to get started.',
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4 antialiased">
      <Tabs defaultValue="login" className="w-full max-w-sm">
        <div className="flex justify-center mb-6">
            <Fish className="h-10 w-10 text-primary" />
        </div>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <Card>
            <CardHeader className="text-center">
              <CardTitle>Welcome back</CardTitle>
              <CardDescription>
                Enter your credentials to access your dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UserAuthForm mode="login" />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="signup">
          <Card>
            <CardHeader className="text-center">
              <CardTitle>Create an account</CardTitle>
              <CardDescription>
                Enter your details to create a new account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UserAuthForm mode="signup" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

    