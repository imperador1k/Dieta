'use client';

import { AppShell } from '@/components/layout/app-shell';
import DailyEnergyWidget from '@/components/dashboard/daily-energy-widget';
import BodyTrendsWidget from '@/components/dashboard/body-trends-widget';
import MicronutrientsWidget from '@/components/dashboard/micronutrients-widget';
import { motion } from 'framer-motion';

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
          <MicronutrientsWidget />
        </motion.div>
      </motion.div>
    </AppShell>
  );
}
