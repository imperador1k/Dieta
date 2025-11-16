'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Home,
  FileText,
  PlusSquare,
  BarChart2,
  Settings,
  User,
} from 'lucide-react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Icons } from '@/components/icons';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/components/ui/sidebar';

const navItems = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/log', label: 'Registo', icon: PlusSquare },
  { href: '/progress', label: 'Progresso', icon: BarChart2 },
  { href: '/plan', label: 'Plano', icon: FileText },
];

function Header() {
  const pathname = usePathname();
  const { state } = useSidebar();
  const currentNavItem = navItems.find((item) => item.href === pathname);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-xl sm:px-6">
      <SidebarTrigger className="md:hidden" />
      <div
        className={cn(
          'flex-1 transition-opacity duration-300',
          state === 'expanded' && 'md:opacity-0'
        )}
      >
        {currentNavItem && (
          <h1 className="flex items-center gap-2 text-xl font-semibold">
            <currentNavItem.icon className="h-5 w-5" />
            {currentNavItem.label}
          </h1>
        )}
      </div>
      <div className="ml-auto">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>
            <User />
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" className="border-r">
        <SidebarHeader>
          <div className="flex items-center gap-2 p-2">
            <Icons.Logo className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold">DietaS</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} legacyBehavior passHref>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                    tooltip={{ children: item.label, side: 'right' }}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip={{ children: 'Definições', side: 'right' }}>
                <Settings />
                <span>Definições</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <Header />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
