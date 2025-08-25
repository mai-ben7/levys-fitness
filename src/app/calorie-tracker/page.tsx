"use client";

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import Footer from '@/components/site/Footer';
import Navbar from '@/components/site/Navbar';

// Dynamic import with loading fallback
const CalorieTracker = dynamic(
  () => import('../../../components/calorie-tracker/CalorieTracker'),
  {
    loading: () => (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-slate-600">טוען מחשבון קלוריות...</p>
        </div>
      </div>
    ),
    ssr: false // Disable SSR for this component since it uses localStorage
  }
);

export default function CalorieTrackerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-50">
      <Navbar />
      <div className="pt-20">
        <Suspense fallback={
          <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-50 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
              <p className="text-slate-600">טוען מחשבון קלוריות...</p>
            </div>
          </div>
        }>
          <CalorieTracker />
        </Suspense>
      </div>
      <Footer />
    </div>
  );
}
