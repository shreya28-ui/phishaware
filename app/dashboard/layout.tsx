'use client';

import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/common/sidebar';
import { useUser, useFirestore, useMemoFirebase, setDocumentNonBlocking, useDoc } from '@/firebase';
import { redirect } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { doc } from 'firebase/firestore';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const userDocRef = useMemoFirebase(() => {
    if (!user?.uid || !firestore) return null;
    return doc(firestore, 'admins', user.uid);
  }, [user?.uid, firestore]);

  const { data: userDoc, isLoading: isUserDocLoading } = useDoc(userDocRef);

  useEffect(() => {
    if (!isUserLoading && !user) {
      redirect('/login');
    }
  }, [isUserLoading, user]);

  useEffect(() => {
    if (user && userDoc === null && !isUserDocLoading && userDocRef) {
      const pendingName = localStorage.getItem('pendingSignupName');
      const name = pendingName || user.email?.split('@')[0] || 'New User';

      const adminData = {
        id: user.uid,
        email: user.email,
        name: name,
      };

      setDocumentNonBlocking(userDocRef, adminData, { merge: false });

      if (pendingName) {
        localStorage.removeItem('pendingSignupName');
      }
    }
  }, [user, userDoc, isUserDocLoading, userDocRef]);


  if (isUserLoading || (user && isUserDocLoading)) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
        </header>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

