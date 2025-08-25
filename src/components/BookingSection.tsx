"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MessageSquare } from 'lucide-react';
import BookNowCard from './BookNowCard';
import ContactOnlyCard from './ContactOnlyCard';

export default function BookingSection() {
  return (
    <motion.section
      dir="rtl"
      className="py-20 relative overflow-hidden"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      {/* Colorful Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-200/30 to-cyan-200/30 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Additional Info */}
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 max-w-4xl mx-auto border border-white/20">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="text-right">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">הזמנה מהירה</h3>
                <p className="text-gray-600">
                  קבעו פגישה תוך דקות עם Google Calendar. קבלו אישור מיידי וקישור Google Meet.
                </p>
              </div>
              
              <div className="text-right">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-500/10 rounded-full mb-4">
                  <MessageSquare className="h-6 w-6 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">יצירת קשר</h3>
                <p className="text-gray-600">
                  שלחו פרטים ונחזור אליכם בהקדם. מושלם לשאלות או ייעוץ ראשוני.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Book Now Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Popular Badge */}
            <div className="absolute -top-3 -right-3 z-10">
              <span className="bg-gradient-to-r from-primary to-primary/80 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                פופולרי
              </span>
            </div>
            
            <BookNowCard />
          </motion.div>

          {/* Contact Only Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
          >
            <ContactOnlyCard />
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
