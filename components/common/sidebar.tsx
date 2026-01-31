'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bot, Fish, LayoutDashboard, LogOut, Target } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
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
      // The user will be redirected automatically by the dashboard layout.
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
      <SidebarHeader className="p-4">
        <Link
          href="/dashboard"
          className="flex items-center gap-2"
          aria-label="PhishAware home"
        >
          <Fish className="h-8 w-8 text-primary" />
          <div className="group-data-[collapsible=icon]:hidden">
            <h1 className="text-xl font-semibold">PhishAware</h1>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={
                  pathname === item.href ||
                  (item.href !== '/dashboard' && pathname.startsWith(item.href))
                }
                tooltip={item.label}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleSignOut} tooltip="Sign Out">
              <LogOut />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
