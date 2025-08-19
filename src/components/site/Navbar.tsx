"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Dumbbell, Menu, X } from 'lucide-react';

const links = [
  { name: 'בית', href: '/' },
  { name: 'שירותים', href: '/#services' },
  { name: 'אודות', href: '/#about' },
  { name: 'תוצאות', href: '/#results' },
  { name: 'מחשבון קלוריות', href: '/calorie-tracker' },
  { name: 'צור קשר', href: '/#contact' },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <motion.nav 
      className="fixed top-0 w-full z-50 backdrop-blur-xl bg-background/70 border-b border-border/50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center" dir="rtl">
        <motion.a 
          href="/"
          className="flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Dumbbell className="h-8 w-8 text-primary" />
          </motion.div>
          <span className="text-xl font-bold bg-gradient-to-l from-primary to-primary/70 bg-clip-text text-transparent">
            לויס פיטנס
          </span>
        </motion.a>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((item, index) => (
            <motion.a
              key={item.name}
              href={item.href}
              className="text-foreground hover:text-primary transition-colors relative group"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 + 0.3 }}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.96 }}
            >
              {item.name}
              <motion.span
                className="absolute -bottom-1 right-0 w-0 h-0.5 bg-primary group-hover:w-full"
                whileHover={{ width: '100%' }}
              />
            </motion.a>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <motion.button 
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          whileTap={{ scale: 0.95 }}
          type="button"
        >
          <motion.div animate={{ rotate: isMenuOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </motion.div>
        </motion.button>
      </div>

      {/* Mobile Menu */}
      <motion.div 
        className="md:hidden bg-background/95 backdrop-blur-xl border-t border-border/50"
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: isMenuOpen ? 'auto' : 0, opacity: isMenuOpen ? 1 : 0 }}
        transition={{ duration: 0.25 }}
        style={{ overflow: 'hidden' }}
      >
        <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
          {links.map((item, index) => (
            <motion.a
              key={item.name}
              href={item.href}
              className="text-foreground hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: isMenuOpen ? 1 : 0, x: isMenuOpen ? 0 : 20 }}
              transition={{ delay: index * 0.06 }}
            >
              {item.name}
            </motion.a>
          ))}
        </div>
      </motion.div>
    </motion.nav>
  );
}



