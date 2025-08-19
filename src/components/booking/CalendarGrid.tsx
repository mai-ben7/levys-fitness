"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Calendar, Plus, Settings } from 'lucide-react';

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
  duration: number;
  price: number;
  maxBookings: number;
  currentBookings: number;
  customPrice?: number;
  customNote?: string;
}

interface DaySchedule {
  date: string;
  dayName: string;
  isWorkingDay: boolean;
  workingHours: {
    start: string;
    end: string;
  };
  timeSlots: TimeSlot[];
  customNote?: string;
  isHoliday?: boolean;
  isSpecialDay?: boolean;
}

interface CalendarGridProps {
  calendarData: DaySchedule[];
  selectedDate: string;
  onDateSelect: (date: string) => void;
  onDaySettingsEdit: (date: string) => void;
  onAddCustomSlot: (date: string) => void;
}

export default function CalendarGrid({
  calendarData,
  selectedDate,
  onDateSelect,
  onDaySettingsEdit,
  onAddCustomSlot,
}: CalendarGridProps) {
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);

  const getDayStatus = (day: DaySchedule) => {
    if (day.isHoliday) return 'holiday';
    if (day.isSpecialDay) return 'special';
    if (!day.isWorkingDay) return 'off';
    if (day.timeSlots.some(slot => slot.currentBookings > 0)) return 'booked';
    return 'available';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'holiday': return 'bg-red-100 border-red-300 text-red-700';
      case 'special': return 'bg-purple-100 border-purple-300 text-purple-700';
      case 'off': return 'bg-slate-100 border-slate-200 text-slate-400';
      case 'booked': return 'bg-emerald-100 border-emerald-300 text-emerald-700';
      case 'available': return 'bg-white border-slate-200 text-slate-700';
      default: return 'bg-white border-slate-200 text-slate-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'holiday': return '🎉';
      case 'special': return '⭐';
      case 'booked': return '📅';
      case 'available': return '✓';
      default: return '';
    }
  };

  const getBookingCount = (day: DaySchedule) => {
    return day.timeSlots.reduce((total, slot) => total + slot.currentBookings, 0);
  };



  return (
    <Card className="bg-white/90 backdrop-blur-sm border border-emerald-200 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-xl font-bold text-slate-800">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-emerald-100 to-cyan-100 rounded-lg p-2 border border-emerald-200">
              <Calendar className="h-5 w-5 text-emerald-600" />
            </div>
            יומן זמינות מתקדם
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="bg-white border-slate-300 hover:bg-slate-50 text-slate-700 text-xs"
            >
              <Settings className="h-3 w-3 ml-1" />
              הגדרות
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Calendar Header */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'].map((day) => (
            <div key={day} className="text-center p-2 font-medium text-slate-600 text-sm">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {calendarData.map((day) => {
            const status = getDayStatus(day);
            const isSelected = selectedDate === day.date;
            const isHovered = hoveredDate === day.date;
            const bookingCount = getBookingCount(day);
                

            return (
              <motion.div
                key={day.date}
                className={`relative p-2 rounded-lg border transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-100 border-emerald-300 text-emerald-700 shadow-md'
                    : getStatusColor(status)
                } ${isHovered && !isSelected ? 'shadow-md scale-105' : ''}`}
                onClick={() => onDateSelect(day.date)}
                onMouseEnter={() => setHoveredDate(day.date)}
                onMouseLeave={() => setHoveredDate(null)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Day Number */}
                <div className="text-sm font-medium text-center">
                  {new Date(day.date).getDate()}
                </div>

                {/* Day Name */}
                <div className="text-xs text-center opacity-75">
                  {day.dayName}
                </div>

                {/* Status Icon */}
                {getStatusIcon(status) && (
                  <div className="text-center text-xs mt-1">
                    {getStatusIcon(status)}
                  </div>
                )}

                {/* Working Hours */}
                {day.isWorkingDay && (
                  <div className="text-xs text-center opacity-60 mt-1">
                    {day.workingHours.start}-{day.workingHours.end}
                  </div>
                )}

                {/* Booking Count */}
                {bookingCount > 0 && (
                  <div className="absolute top-1 right-1">
                    <Badge className="bg-emerald-500 text-white text-xs px-1 py-0">
                      {bookingCount}
                    </Badge>
                  </div>
                )}

                {/* Custom Note Indicator */}
                {day.customNote && (
                  <div className="absolute bottom-1 right-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  </div>
                )}

                {/* Special Day Indicator */}
                {day.isSpecialDay && (
                  <div className="absolute top-1 left-1">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  </div>
                )}

                {/* Holiday Indicator */}
                {day.isHoliday && (
                  <div className="absolute bottom-1 left-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  </div>
                )}

                {/* Hover Actions */}
                {isHovered && day.isWorkingDay && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute inset-0 bg-black/10 rounded-lg flex items-center justify-center"
                  >
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-6 w-6 p-0 bg-white border-slate-300 hover:bg-slate-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDaySettingsEdit(day.date);
                        }}
                      >
                        <Settings className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-6 w-6 p-0 bg-white border-slate-300 hover:bg-slate-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddCustomSlot(day.date);
                        }}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <h4 className="text-sm font-medium text-slate-800 mb-3">מקרא</h4>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-100 border border-emerald-300 rounded"></div>
              <span className="text-slate-700">זמין</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-slate-100 border border-slate-200 rounded"></div>
              <span className="text-slate-700">לא זמין</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-100 border border-purple-300 rounded"></div>
              <span className="text-slate-700">יום מיוחד</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-100 border border-red-300 rounded"></div>
              <span className="text-slate-700">חג/חופשה</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-slate-700">הערה מותאמת</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-emerald-500 text-white text-xs px-1 py-0">3</Badge>
              <span className="text-slate-700">מספר פגישות</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
