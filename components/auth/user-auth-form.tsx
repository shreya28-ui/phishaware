'use client';

import * as React from 'react';
import { redirect } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useAuth, useUser, useFirestore, setDocumentNonBlocking } from '@/firebase';
import {
  initiateEmailSignIn,
  initiateEmailSignUp,
} from '@/firebase/non-blocking-login';
import { doc } from 'firebase/firestore';

const signupSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  mode: 'login' | 'signup';
}

import { motion } from 'framer-motion';

export function UserAuthForm({ className, mode, ...props }: UserAuthFormProps) {
  const auth = useAuth();
  const { user } = useUser();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const formSchema = mode === 'login' ? loginSchema : signupSchema;
  type FormData = z.infer<typeof formSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(formSchema),
  });

  React.useEffect(() => {
    if (user) {
      redirect('/dashboard');
    }
  }, [user]);

  async function onSubmit(data: FormData) {
    setIsLoading(true);

    if (mode === 'signup') {
      localStorage.setItem('pendingSignupName', (data as any).name);
      initiateEmailSignUp(auth, data.email, (data as any).password);
      toast({
        title: 'Account created.',
        description: 'You are now being redirected.',
      });
    } else {
      initiateEmailSignIn(auth, data.email, data.password);
      toast({
        title: 'Signing in...',
        description: 'You are now being redirected.',
      });
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <motion.div
          className="grid gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {mode === 'signup' && (
            <motion.div className="grid gap-1" variants={itemVariants}>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                type="text"
                autoCapitalize="words"
                autoComplete="name"
                autoCorrect="off"
                disabled={isLoading}
                {...register('name')}
                className="transition-all focus:ring-2 focus:ring-primary/20"
              />
              {errors?.name && (
                <p className="px-1 text-xs text-red-600 font-medium">{(errors.name as any).message}</p>
              )}
            </motion.div>
          )}
          <motion.div className="grid gap-1" variants={itemVariants}>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              {...register('email')}
              className="transition-all focus:ring-2 focus:ring-primary/20"
            />
            {errors?.email && (
              <p className="px-1 text-xs text-red-600 font-medium">{(errors.email as any).message}</p>
            )}
          </motion.div>
          <motion.div className="grid gap-1" variants={itemVariants}>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              placeholder="••••••••"
              type="password"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              disabled={isLoading}
              {...register('password')}
              className="transition-all focus:ring-2 focus:ring-primary/20"
            />
            {errors?.password && (
              <p className="px-1 text-xs text-red-600 font-medium">{(errors.password as any).message}</p>
            )}
          </motion.div>
          <motion.button
            className={cn(buttonVariants(), "mt-2 shadow-lg hover:shadow-primary/30 transition-shadow")}
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            variants={itemVariants}
          >
            {isLoading && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {mode === 'login' ? 'Sign In' : 'Sign Up'}
          </motion.button>
        </motion.div>
      </form>
    </div>
  );
}

