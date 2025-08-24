"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

interface TimeSlot {
  start: string;
  end: string;
}

interface SlotGridProps {
  slots: TimeSlot[];
  loading: boolean;
  selectedSlot: TimeSlot | null;
  onSlotSelect: (slot: TimeSlot) => void;
}

export default function SlotGrid({ slots, loading, selectedSlot, onSlotSelect }: SlotGridProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
          <div className="grid grid-cols-3 gap-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className="text-center py-8">
        <Clock className="h-12 w-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-500 text-sm">אין זמנים פנויים לתאריך זה</p>
        <p className="text-gray-400 text-xs mt-1">נסה/נסי תאריך אחר</p>
      </div>
    );
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('he-IL', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const formatTimeRange = (start: string, end: string) => {
    const startTime = formatTime(start);
    const endTime = formatTime(end);
    return `${startTime}–${endTime}`;
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700 text-right">
        זמנים פנויים
      </label>
      <div className="grid grid-cols-3 gap-2">
        {slots.map((slot, index) => {
          const isSelected = selectedSlot?.start === slot.start;
          return (
            <motion.button
              key={index}
              type="button"
              onClick={() => onSlotSelect(slot)}
              className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                isSelected
                  ? 'border-primary bg-primary text-white'
                  : 'border-gray-200 hover:border-primary/50 hover:bg-primary/5'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="text-xs">{formatTime(slot.start)}</div>
              <div className="text-xs opacity-75">–{formatTime(slot.end)}</div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
