'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  FileText,
  User,
  BarChart2,
  UtensilsCrossed,
  GalleryThumbnails,
} from 'lucide-react';
import { Icons } from '@/components/icons';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useState } from 'react';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/plan', label: 'Plano', icon: FileText },
  { href: '/meals', label: 'Refeições', icon: UtensilsCrossed },
  { href: '/log', label: 'Registo', icon: UtensilsCrossed },
  { href: '/progress', label: 'Progresso', icon: BarChart2 },
  { href: '/gallery', label: 'Galeria', icon: GalleryThumbnails },
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
        <Link href="/profile">
            <Avatar className='h-10 w-10 border-2 border-transparent transition-all duration-300 hover:border-primary cursor-pointer'>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>
                <Icons.Logo className="h-5 w-5" />
            </AvatarFallback>
            </Avatar>
        </Link>
      </motion.div>
    </header>
  );
}

function MobileBottomNav() {
    const pathname = usePathname();
    const [hoveredPath, setHoveredPath] = useState(pathname);

    return (
        <nav className="fixed bottom-4 left-0 z-50 w-full px-4 md:hidden">
            <motion.div 
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 70, damping: 20, delay: 0.2 }}
                className="mx-auto flex h-16 max-w-md items-center justify-around rounded-full border border-primary/10 bg-background/60 p-1 shadow-lg backdrop-blur-xl"
            >
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link 
                            href={item.href} 
                            key={item.href} 
                            className={cn(
                                "relative flex h-full flex-1 flex-col items-center justify-center gap-1 rounded-full text-sm font-medium transition-colors",
                                !isActive && "hover:text-primary"
                            )}
                            onMouseOver={() => setHoveredPath(item.href)}
                            onMouseLeave={() => setHoveredPath(pathname)}
                        >
                            <item.icon className={cn(
                                "h-5 w-5 transition-transform",
                                isActive ? "text-primary" : "text-muted-foreground"
                            )} />
                            <span className={cn(isActive ? "text-primary" : "text-muted-foreground", "text-[10px]")}>
                                {item.label}
                            </span>
                            {item.href === hoveredPath && (
                                <motion.div
                                    className="absolute inset-0 rounded-full bg-primary/10"
                                    layoutId="mobile-nav-hover"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                />
                            )}
                        </Link>
                    )
                })}
            </motion.div>
        </nav>
    )
}


export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isGalleryPage = pathname === '/gallery';

  return (
    <div className="relative flex min-h-screen flex-col">
      {!isGalleryPage && <Header />}
      <main className={cn(
        "flex-1",
        isGalleryPage ? "w-full h-full" : "pt-24 pb-24 md:pb-8"
      )}>
        <div className={cn(!isGalleryPage ? "container mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8" : "h-full")}>
            {children}
        </div>
      </main>
      {!isGalleryPage && <MobileBottomNav />}
    </div>
  );
}
