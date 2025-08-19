"use client";

import { motion } from 'framer-motion';
import { Dumbbell } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="py-8 bg-primary text-primary-foreground" dir="rtl">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <motion.div 
            className="flex items-center justify-center gap-3 mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-2xl font-bold">לויס פיטנס</span>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Dumbbell className="h-8 w-8" />
            </motion.div>
          </motion.div>
          <p className="text-primary-foreground/80 mb-4">
            שנה את הגוף שלך. שנה את החיים שלך. שנה את העתיד שלך.
          </p>
          <p className="text-primary-foreground/60 text-sm">
            © 2025 Mai Web | כל הזכויות שמורות
          </p>
        </div>
      </div>
    </footer>
  );
}



