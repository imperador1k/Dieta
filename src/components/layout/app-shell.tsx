'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  FileText,
  PlusSquare,
  BarChart2,
  GalleryVertical,
  UtensilsCrossed,
} from 'lucide-react';
import { Icons } from '@/components/icons';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/plan', label: 'Plano', icon: FileText },
  { href: '/meals', label: 'Refeições', icon: UtensilsCrossed },
  { href: '/log', label: 'Registo', icon: PlusSquare },
  { href: '/progress', label: 'Progresso', icon: BarChart2 },
  { href: '/gallery', label: 'Galeria', icon: GalleryVertical },
];

function Header() {
  const pathname = usePathname();

  return (
    <header className="fixed top-4 left-0 z-50 w-full px-4">
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 70, damping: 20 }}
        className="relative mx-auto flex h-16 max-w-7xl items-center justify-between rounded-full border border-primary/10 bg-background/60 p-2 pl-4 pr-2 shadow-lg backdrop-blur-xl"
      >
        <Link href="/" className="flex items-center space-x-2">
          <Icons.Logo className="h-8 w-8 text-primary transition-transform duration-300 hover:scale-110" />
        </Link>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
             <span className="font-bold text-xl tracking-tight text-foreground md:hidden">DietaS</span>
            <nav className="hidden md:block">
                <ul className="flex items-center gap-2">
                    {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <li key={item.href}>
                        <Link href={item.href}>
                            <Button
                            variant="ghost"
                            className={cn(
                                "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-all duration-300 hover:text-foreground",
                                isActive && "bg-primary/10 text-primary shadow-inner shadow-primary/5",
                            )}
                            >
                            <item.icon className="h-4 w-4" />
                            <span>{item.label}</span>
                            </Button>
                        </Link>
                        </li>
                    );
                    })}
                </ul>
            </nav>
        </div>
        <Avatar className='h-10 w-10 border-2 border-transparent transition-all duration-300 hover:border-primary'>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>
            <Icons.Logo className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      </motion.div>
    </header>
  );
}

function MobileBottomNav() {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-4 left-0 z-50 w-full px-4 md:hidden">
            <motion.div 
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 70, damping: 20, delay: 0.2 }}
                className="mx-auto flex h-16 max-w-md items-center justify-around rounded-full border border-primary/10 bg-background/60 shadow-lg backdrop-blur-xl"
            >
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link href={item.href} key={item.href} className="flex-1">
                            <div className="relative flex flex-col items-center justify-center gap-1 text-muted-foreground transition-colors hover:text-primary">
                                <div className={cn(
                                    "absolute -top-3 flex h-8 w-16 items-end justify-center rounded-b-full transition-all",
                                    isActive && "bg-primary/10"
                                )}>
                                    {isActive && <div className="h-1 w-8 rounded-full bg-primary mb-1 chart-glow"/>}
                                </div>
                                <item.icon className={cn(
                                    "h-6 w-6 transition-transform",
                                    isActive ? "text-primary scale-110" : "scale-100"
                                )} />
                                <span className={cn("text-xs font-medium", isActive && "text-primary")}>{item.label}</span>
                            </div>
                        </Link>
                    )
                })}
            </motion.div>
        </nav>
    )
}


export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pt-24 pb-24 md:pb-8">
        <div className="container mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            {children}
        </div>
      </main>
      <MobileBottomNav />
    </div>
  );
}
