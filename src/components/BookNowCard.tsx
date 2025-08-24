"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, CheckCircle, ExternalLink, Download } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SERVICES, type Service } from '@/config/services';
import SlotGrid from './SlotGrid';
import BookingForm from './BookingForm';

interface TimeSlot {
  start: string;
  end: string;
}

interface BookingFormData {
  name: string;
  email: string;
  phone: string;
  note: string;
}

interface BookingSuccess {
  htmlLink?: string;
  meetLink?: string;
  eventId?: string;
}

export default function BookNowCard() {
  const [selectedService, setSelectedService] = useState<Service>(SERVICES[0]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [loading, setLoading] = useState(false);

  const [bookingSuccess, setBookingSuccess] = useState<BookingSuccess | null>(null);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<BookingFormData>({
    name: '',
    email: '',
    phone: '',
    note: ''
  });

  const [errors, setErrors] = useState<Partial<BookingFormData>>({});

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  // Helper function to check if a slot is on the selected local date
  const isSameLocalDay = (iso: string, selectedDateStr: string) => {
    const dt = new Date(iso); // contains +03:00 offset now
    const selectedDate = new Date(selectedDateStr);
    return dt.getFullYear() === selectedDate.getFullYear() && 
           dt.getMonth() === selectedDate.getMonth() && 
           dt.getDate() === selectedDate.getDate();
  };

  // Load available slots when service or date changes
  useEffect(() => {
    if (selectedDate) {
      loadAvailableSlots();
    }
  }, [selectedService, selectedDate]);

  const loadAvailableSlots = async () => {
    setLoadingSlots(true);
    setError('');
    try {
      const response = await fetch(`/api/availability?service=${selectedService.id}&date=${selectedDate}`);
      const data = await response.json();
      
      if (response.ok) {
        const allSlots = data.slots || [];
        
        // Filter slots for the selected local date
        const slotsForDay = allSlots.filter((slot: TimeSlot) => 
          isSameLocalDay(slot.start, selectedDate)
        );
        
        // Sort by start time
        slotsForDay.sort((a: TimeSlot, b: TimeSlot) => 
          new Date(a.start).getTime() - new Date(b.start).getTime()
        );
        
        // Skip past times only if the selected date is today
        const today = new Date().toISOString().split('T')[0];
        const now = new Date();
        const filteredSlots = selectedDate === today 
          ? slotsForDay.filter((slot: TimeSlot) => new Date(slot.start) > now)
          : slotsForDay;
        
        setSlots(filteredSlots);
      } else {
        setError(data.error || 'שגיאה בטעינת זמנים פנויים');
      }
    } catch (error) {
      setError('שגיאה בטעינת זמנים פנויים');
    } finally {
      setLoadingSlots(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<BookingFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'שם מלא הוא שדה חובה';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'אימייל הוא שדה חובה';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'אנא הכנס/י אימייל תקין';
    }

    if (formData.phone.trim() && !/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'אנא הכנס/י מספר טלפון תקין';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedSlot) {
      setError('אנא בחר/י זמן פגישה');
      return;
    }

    if (!validateForm()) {
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
          name: formData.name,
          email: formData.email,
          phone: formData.phone || undefined,
          note: formData.note || undefined,
          start: selectedSlot.start,
          end: selectedSlot.end,
          service: selectedService.id
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setBookingSuccess(data);
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          note: ''
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

  const handleFormChange = (field: keyof BookingFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };



  const generateICS = async () => {
    if (!selectedSlot || !bookingSuccess) return;

    try {
      const { createEvent } = await import('ics');
      
      const event = {
        start: [
          new Date(selectedSlot.start).getFullYear(),
          new Date(selectedSlot.start).getMonth() + 1,
          new Date(selectedSlot.start).getDate(),
          new Date(selectedSlot.start).getHours(),
          new Date(selectedSlot.start).getMinutes()
        ] as [number, number, number, number, number],
        end: [
          new Date(selectedSlot.end).getFullYear(),
          new Date(selectedSlot.end).getMonth() + 1,
          new Date(selectedSlot.end).getDate(),
          new Date(selectedSlot.end).getHours(),
          new Date(selectedSlot.end).getMinutes()
        ] as [number, number, number, number, number],
        title: `${selectedService.label} - ${formData.name}`,
        description: formData.note || '',
        location: bookingSuccess.meetLink || '',
        url: bookingSuccess.htmlLink || '',
        status: 'CONFIRMED' as const,
        busyStatus: 'BUSY' as const,
        organizer: { name: 'Levy\'s Fitness', email: 'training.program.levys@gmail.com' },
        attendees: [{ name: formData.name, email: formData.email }]
      };

      const { error, value } = createEvent(event);
      
      if (error) {
        console.error('Error creating ICS file:', error);
        return;
      }

      const blob = new Blob([value], { type: 'text/calendar' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `booking-${selectedSlot.start.split('T')[0]}.ics`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating ICS file:', error);
    }
  };

  if (bookingSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="h-full"
      >
        <Card className="border-2 border-green-200 bg-green-50 h-full">
          <CardContent className="p-6 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <CheckCircle className="h-8 w-8 text-white" />
            </motion.div>
            
            <h3 className="text-xl font-bold text-green-800 mb-4">הפגישה נקבעה בהצלחה!</h3>
            
            <div className="space-y-4 text-right">
              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">תאריך ושעה:</p>
                <p className="font-semibold">
                  {new Date(selectedSlot!.start).toLocaleDateString('he-IL')} - {new Date(selectedSlot!.start).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              
              {bookingSuccess.htmlLink && (
                <div className="bg-white p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">פתח/י ב-Google Calendar:</p>
                  <a 
                    href={bookingSuccess.htmlLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 font-semibold flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    פתח ב-Google Calendar
                  </a>
                </div>
              )}

              {bookingSuccess.meetLink && (
                <div className="bg-white p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">קישור Google Meet:</p>
                  <a 
                    href={bookingSuccess.meetLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 font-semibold flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    הצטרף לפגישה
                  </a>
                </div>
              )}
            </div>
            
            <div className="space-y-2 mt-6">
              <Button 
                onClick={generateICS}
                variant="outline"
                className="w-full"
                suppressHydrationWarning
              >
                <Download className="h-4 w-4 ml-2" />
                הורד/י קובץ ליומן (ICS)
              </Button>
              
              <Button 
                onClick={() => setBookingSuccess(null)}
                className="w-full bg-green-600 hover:bg-green-700"
                suppressHydrationWarning
              >
                קבע פגישה נוספת
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <Card className="h-full border-2 border-primary/20">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-xl font-bold text-gray-900">קבע/י פגישה עכשיו</CardTitle>
        <p className="text-gray-600 text-sm">בחר/י שירות, תאריך ושעה מתאימים</p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Service Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 text-right mb-2">
              סוג השירות
            </label>
            <Select value={selectedService.id} onValueChange={(value) => {
              const service = SERVICES.find(s => s.id === value);
              if (service) setSelectedService(service);
            }}>
              <SelectTrigger className="text-right" suppressHydrationWarning>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SERVICES.map((service) => (
                  <SelectItem key={service.id} value={service.id}>
                    {service.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 text-right mb-2">
              <Calendar className="h-4 w-4 inline ml-2" />
              תאריך הפגישה
            </label>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={today}
              className="border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 text-right"
              suppressHydrationWarning
            />
          </div>



          {/* Time Slots */}
          {selectedDate && (
            <>
              <SlotGrid
                slots={slots}
                loading={loadingSlots}
                selectedSlot={selectedSlot}
                onSlotSelect={setSelectedSlot}
              />
              
              {/* No slots available message */}
              {!loadingSlots && slots.length === 0 && (
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg text-right text-sm">
                  <p className="mb-2">אין זמנים זמינים לתאריך זה.</p>
                  <p className="text-xs">צור אירועי "Availability" ביומן Google שלך או בדוק תאריך אחר.</p>
                </div>
              )}

              {/* Slots available message */}
              {!loadingSlots && slots.length > 0 && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-right text-sm">
                  <p>נמצאו {slots.length} זמנים זמינים לתאריך זה.</p>
                </div>
              )}
            </>
          )}

          {/* Booking Form */}
          {selectedSlot && (
            <BookingForm
              formData={formData}
              onChange={handleFormChange}
              errors={errors}
            />
          )}



          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-right text-sm"
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
              className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white text-lg py-4 rounded-xl shadow-lg border-0 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
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
                  קבע/י פגישה
                </>
              )}
            </Button>
          </motion.div>
        </form>
      </CardContent>
    </Card>
  );
}
