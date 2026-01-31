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

import { motion, AnimatePresence } from 'framer-motion';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4 antialiased overflow-hidden relative">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 -right-4 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm z-10"
      >
        <div className="flex justify-center mb-8">
          <motion.div
            animate={{
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="p-3 rounded-2xl bg-primary/10 shadow-inner"
          >
            <Fish className="h-12 w-12 text-primary" />
          </motion.div>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 p-1 bg-muted/50 backdrop-blur-sm rounded-xl mb-6">
            <TabsTrigger value="login" className="rounded-lg">Login</TabsTrigger>
            <TabsTrigger value="signup" className="rounded-lg">Sign Up</TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <TabsContent value="login" key="login">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-none shadow-2xl bg-card/80 backdrop-blur-md">
                  <CardHeader className="text-center space-y-1">
                    <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
                    <CardDescription>
                      Enter your credentials to access your dashboard.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <UserAuthForm mode="login" />
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="signup" key="signup">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-none shadow-2xl bg-card/80 backdrop-blur-md">
                  <CardHeader className="text-center space-y-1">
                    <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
                    <CardDescription>
                      Join PhishAware and start testing your security.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <UserAuthForm mode="signup" />
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </motion.div>
    </div>
  );
}

