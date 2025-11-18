'use client';

import { AppShell } from '@/components/layout/app-shell';
import DailyEnergyWidget from '@/components/dashboard/daily-energy-widget';
import BodyTrendsWidget from '@/components/dashboard/body-trends-widget';
import TodaysMealsWidget from '@/components/dashboard/todays-meals-widget';
import { motion } from 'framer-motion';
import { useAppContext } from './context/AppContext';
import { useAuth } from '@/firebase';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
    },
  },
};

export default function DashboardPage() {
  const { isProfileLoading, profile } = useAppContext();
  const auth = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to login if user is not authenticated
    if (!auth.currentUser && !isProfileLoading) {
      router.push('/auth/login');
    }
  }, [auth, router, isProfileLoading]);
  
  // If user is not authenticated, don't render the dashboard
  if (!auth.currentUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  // Removed automatic anonymous sign-in
  // Users must explicitly sign in or sign up

  return (
    <AppShell>
      <motion.div
        className="grid gap-6 grid-cols-1 lg:grid-cols-3 auto-rows-max"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="lg:col-span-1" variants={itemVariants}>
          <DailyEnergyWidget />
        </motion.div>
        <motion.div className="lg:col-span-2 space-y-6" variants={itemVariants}>
          <BodyTrendsWidget />
          <TodaysMealsWidget />
        </motion.div>
      </motion.div>
    </AppShell>
  );
}