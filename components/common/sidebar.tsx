'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bot, Fish, LayoutDashboard, LogOut, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';
import { useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';

export function AppSidebar() {
  const pathname = usePathname();
  const auth = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast({ title: 'Signed out successfully.' });
    } catch (error) {
      console.error('Sign out error', error);
      toast({
        variant: 'destructive',
        title: 'Sign out failed',
        description: 'Could not sign you out. Please try again.',
      });
    }
  };

  const menuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/campaigns/new', label: 'New Campaign', icon: Target },
    { href: '/dashboard/ethics', label: 'Ethics Analysis', icon: Bot },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border/50 pb-4">
        <SidebarMenu className="px-2">
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="hover:bg-transparent">
              <Link href="/dashboard" className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="flex aspect-square size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                >
                  <Fish className="size-6" />
                </motion.div>
                <div className="flex flex-col gap-0.5 leading-none px-1">
                  <span className="font-bold text-lg tracking-tight">PhishAware</span>
                  <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">Security OS</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50 py-4">
            Navigation
          </SidebarGroupLabel>
          <SidebarMenu className="px-2 gap-1">
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <motion.div whileHover={{ x: 4 }} transition={{ type: 'spring', stiffness: 300 }}>
                  <SidebarMenuButton
                    asChild
                    isActive={
                      pathname === item.href ||
                      (item.href !== '/dashboard' && pathname.startsWith(item.href))
                    }
                    tooltip={item.label}
                    className="transition-all duration-200"
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </motion.div>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border/50 pt-4">
        <SidebarMenu className="px-2">
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleSignOut}
              tooltip="Sign Out"
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="rotate-180" />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
