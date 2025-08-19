import { Metadata } from 'next';
import Navbar from '@/components/site/Navbar';
import Footer from '@/components/site/Footer';
import CalorieTracker from '../../../components/calorie-tracker/CalorieTracker';

export const metadata: Metadata = {
  title: 'מחשבון קלוריות - Levy\'s Fitness',
  description: 'עקוב אחר יעדי התזונה היומיים שלך ובנה הרגלים בריאים עם כלי מעקב מתקדם',
};

export default function CalorieTrackerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Navbar />
      <main className="pt-20">
        <CalorieTracker />
      </main>
      <Footer />
    </div>
  );
}
