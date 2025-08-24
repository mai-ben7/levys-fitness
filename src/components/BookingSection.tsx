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
      className="py-20 bg-gradient-to-br from-gray-50 to-white"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">איך תרצו להתקדם?</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            בחרו באחת מהאפשרויות הבאות כדי להתחיל את המסע שלכם לכושר טוב יותר
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Book Now Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
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
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <ContactOnlyCard />
          </motion.div>
        </div>

        {/* Additional Info */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
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
      </div>
    </motion.section>
  );
}
