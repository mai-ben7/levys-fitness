"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, Mail, Phone, MessageSquare, CheckCircle, ExternalLink } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

interface TimeSlot {
  time: string;
  displayTime: string;
}

interface Booking {
  eventId: string;
  meetLink: string;
  startTime: string;
  endTime: string;
}

export default function BookSession() {
  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [error, setError] = useState('');

  // Form fields
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    notes: ''
  });

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  // Load available slots when date changes
  useEffect(() => {
    if (selectedDate) {
      loadAvailableSlots();
    }
  }, [selectedDate]);

  const loadAvailableSlots = async () => {
    setLoadingSlots(true);
    setError('');
    try {
      const response = await fetch(`/api/availability?date=${selectedDate}`);
      const data = await response.json();
      
      if (response.ok) {
        setAvailableSlots(data.slots);
      } else {
        setError(data.error || 'שגיאה בטעינת זמנים פנויים');
      }
    } catch (error) {
      setError('שגיאה בטעינת זמנים פנויים');
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedSlot) {
      setError('אנא בחר/י זמן פגישה');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          date: selectedDate,
          time: selectedSlot.time
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setBooking(data.booking);
        // Reset form
        setFormData({
          clientName: '',
          clientEmail: '',
          clientPhone: '',
          notes: ''
        });
        setSelectedSlot(null);
        setSelectedDate('');
      } else {
        setError(data.error || 'שגיאה בקביעת הפגישה');
      }
    } catch (error) {
      setError('שגיאה בקביעת הפגישה');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (booking) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto"
      >
        <Card className="border-2 border-green-200 bg-green-50">
          <CardContent className="p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <CheckCircle className="h-8 w-8 text-white" />
            </motion.div>
            
            <h3 className="text-2xl font-bold text-green-800 mb-4">הפגישה נקבעה בהצלחה!</h3>
            
            <div className="space-y-4 text-right">
              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">תאריך ושעה:</p>
                <p className="font-semibold">
                  {new Date(booking.startTime).toLocaleDateString('he-IL')} - {new Date(booking.startTime).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              
              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">קישור Google Meet:</p>
                <a 
                  href={booking.meetLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 font-semibold flex items-center justify-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  הצטרף לפגישה
                </a>
              </div>
            </div>
            
            <Button 
              onClick={() => setBooking(null)}
              className="mt-6 bg-green-600 hover:bg-green-700"
              suppressHydrationWarning
            >
              קבע פגישה נוספת
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.section
      dir="rtl"
      className="max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="border-0 shadow-2xl bg-gradient-to-br from-white to-gray-50">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <motion.div
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary to-primary/70 rounded-full mb-4"
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <Calendar className="h-8 w-8 text-white" />
            </motion.div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">קבע פגישה</h3>
            <p className="text-gray-600">בחר/י תאריך ושעה מתאימים לאימון אישי</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Date Selection */}
            <div>
              <label className="block mb-2 font-semibold text-right text-gray-700">
                <Calendar className="h-4 w-4 inline ml-2" />
                תאריך הפגישה
              </label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={today}
                className="border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 text-right bg-white/80 backdrop-blur-sm"
                suppressHydrationWarning
              />
            </div>

            {/* Time Slots */}
            {selectedDate && (
              <div>
                <label className="block mb-2 font-semibold text-right text-gray-700">
                  <Clock className="h-4 w-4 inline ml-2" />
                  זמנים פנויים
                </label>
                {loadingSlots ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="text-gray-600 mt-2">טוען זמנים פנויים...</p>
                  </div>
                ) : availableSlots.length > 0 ? (
                  <div className="grid grid-cols-3 gap-2">
                    {availableSlots.map((slot, index) => (
                      <motion.button
                        key={index}
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          selectedSlot?.time === slot.time
                            ? 'border-primary bg-primary text-white'
                            : 'border-gray-200 hover:border-primary/50 hover:bg-primary/5'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        suppressHydrationWarning
                      >
                        {slot.displayTime}
                      </motion.button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    אין זמנים פנויים בתאריך זה
                  </div>
                )}
              </div>
            )}

            {/* Client Information */}
            <div className="space-y-4">
              <div>
                <label className="block mb-2 font-semibold text-right text-gray-700">
                  <User className="h-4 w-4 inline ml-2" />
                  שם מלא
                </label>
                <Input
                  placeholder="הכנס/י את שמך המלא"
                  value={formData.clientName}
                  onChange={(e) => handleInputChange('clientName', e.target.value)}
                  className="border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 text-right bg-white/80 backdrop-blur-sm"
                  suppressHydrationWarning
                />
              </div>

              <div>
                <label className="block mb-2 font-semibold text-right text-gray-700">
                  <Mail className="h-4 w-4 inline ml-2" />
                  אימייל
                </label>
                <Input
                  type="email"
                  placeholder="הכנס/י את האימייל שלך"
                  value={formData.clientEmail}
                  onChange={(e) => handleInputChange('clientEmail', e.target.value)}
                  className="border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 text-right bg-white/80 backdrop-blur-sm"
                  suppressHydrationWarning
                />
              </div>

              <div>
                <label className="block mb-2 font-semibold text-right text-gray-700">
                  <Phone className="h-4 w-4 inline ml-2" />
                  מספר טלפון
                </label>
                <Input
                  type="tel"
                  placeholder="הכנס/י מספר טלפון"
                  value={formData.clientPhone}
                  onChange={(e) => handleInputChange('clientPhone', e.target.value)}
                  className="border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 text-right bg-white/80 backdrop-blur-sm"
                  suppressHydrationWarning
                />
              </div>

              <div>
                <label className="block mb-2 font-semibold text-right text-gray-700">
                  <MessageSquare className="h-4 w-4 inline ml-2" />
                  הערות (אופציונלי)
                </label>
                <Textarea
                  placeholder="ספר לי על המטרות שלך בכושר..."
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  rows={3}
                  className="border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 text-right bg-white/80 backdrop-blur-sm"
                  suppressHydrationWarning
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-right"
              >
                {error}
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                type="submit"
                disabled={loading || !selectedSlot}
                className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white text-lg py-6 rounded-2xl shadow-2xl border-0 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                suppressHydrationWarning
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    קובע פגישה...
                  </div>
                ) : (
                  <>
                    <Calendar className="h-5 w-5 ml-2" />
                    קבע פגישה
                  </>
                )}
              </Button>
            </motion.div>
          </form>
        </CardContent>
      </Card>
    </motion.section>
  );
}
