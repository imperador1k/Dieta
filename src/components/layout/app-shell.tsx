'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  FileText,
  PlusSquare,
  BarChart2,
  Settings,
  User,
  GalleryVertical,
} from 'lucide-react';
import { Icons } from '@/components/icons';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button, buttonVariants } from '../ui/button';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/log', label: 'Registo', icon: PlusSquare },
  { href: '/progress', label: 'Progresso', icon: BarChart2 },
  { href: '/plan', label: 'Plano', icon: FileText },
  { href: '/gallery', label: 'Galeria', icon: GalleryVertical, disabled: true },
];

function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-lg">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <Icons.Logo className="h-6 w-6 text-primary" />
            <span className="inline-block font-bold">DietaS</span>
          </Link>
          <nav className="hidden gap-6 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
                  pathname === item.href && "text-foreground",
                  item.disabled && "cursor-not-allowed opacity-50"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
            <Avatar className='h-8 w-8'>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>
                <User className="h-5 w-5"/>
              </AvatarFallback>
            </Avatar>
          </nav>
        </div>
      </div>
    </header>
  );
}


export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container py-6">{children}</main>
    </div>
  );
}
