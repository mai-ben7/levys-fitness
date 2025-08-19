"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Dumbbell, 
  Target,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Plus,
  Minus
} from 'lucide-react';

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
  duration: number; // in minutes
}

interface DaySchedule {
  date: string;
  dayName: string;
  isWorkingDay: boolean;
  timeSlots: TimeSlot[];
}

interface BookingForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  selectedDate: string;
  selectedTime: string;
  selectedDuration: number;
  goal: string;
  experience: string;
  message: string;
}

const WORKING_HOURS = {
  start: 7, // 7:00 AM
  end: 22,  // 10:00 PM
  slotDuration: 60, // 60 minutes
};

const DURATION_OPTIONS = [
  { value: 60, label: 'שעה אחת', price: 150 },
  { value: 90, label: 'שעה וחצי', price: 200 },
  { value: 120, label: 'שעתיים', price: 250 },
  { value: 180, label: '3 שעות', price: 350 },
];

const EXPERIENCE_OPTIONS = [
  { value: 'beginner', label: 'מתחיל' },
  { value: 'intermediate', label: 'בינוני' },
  { value: 'advanced', label: 'מתקדם' },
];

export default function BookingPage() {
  const [activeTab, setActiveTab] = useState<'calendar' | 'contact'>('calendar');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedDuration, setSelectedDuration] = useState(60);
  const [bookingForm, setBookingForm] = useState<BookingForm>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    selectedDate: '',
    selectedTime: '',
    selectedDuration: 60,
    goal: '',
    experience: 'beginner',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Generate calendar data for next 30 days
  const generateCalendarData = (): DaySchedule[] => {
    const calendar: DaySchedule[] = [];
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const dayName = date.toLocaleDateString('he-IL', { weekday: 'long' });
      const dateStr = date.toISOString().split('T')[0];
      
      // Define working days (Sunday-Thursday, 7 AM - 10 PM)
      const isWorkingDay = date.getDay() !== 5 && date.getDay() !== 6; // Not Friday/Saturday
      
      const timeSlots: TimeSlot[] = [];
      if (isWorkingDay) {
        for (let hour = WORKING_HOURS.start; hour < WORKING_HOURS.end; hour++) {
          const timeStr = `${hour.toString().padStart(2, '0')}:00`;
          timeSlots.push({
            id: `${dateStr}-${timeStr}`,
            time: timeStr,
            available: Math.random() > 0.3, // 70% availability for demo
            duration: WORKING_HOURS.slotDuration,
          });
        }
      }
      
      calendar.push({
        date: dateStr,
        dayName,
        isWorkingDay,
        timeSlots,
      });
    }
    
    return calendar;
  };

  const calendarData = generateCalendarData();

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedTime('');
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setBookingForm(prev => ({
      ...prev,
      selectedDate,
      selectedTime: time,
      selectedDuration,
    }));
  };

  const handleDurationChange = (duration: number) => {
    setSelectedDuration(duration);
    setBookingForm(prev => ({
      ...prev,
      selectedDuration: duration,
    }));
  };

  const handleFormChange = (field: keyof BookingForm, value: string | number) => {
    setBookingForm(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would send the booking data to your API
      console.log('Booking submitted:', bookingForm);
      
      setSubmitStatus('success');
      setTimeout(() => {
        setSubmitStatus('idle');
        setActiveTab('calendar');
        setBookingForm({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          selectedDate: '',
          selectedTime: '',
          selectedDuration: 60,
          goal: '',
          experience: 'beginner',
          message: '',
        });
      }, 3000);
    } catch (error) {
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSelectedDurationPrice = () => {
    return DURATION_OPTIONS.find(option => option.value === selectedDuration)?.price || 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-50" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
            className="inline-block mb-4"
          >
            <div className="bg-gradient-to-br from-emerald-100 to-cyan-100 rounded-full p-4 shadow-lg border border-emerald-200">
              <Calendar className="h-10 w-10 text-emerald-600" />
            </div>
          </motion.div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent mb-4">
            קבע פגישה עם המאמן
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            בחר את הזמן המתאים לך וקבל אימון מותאם אישית עם המאמן המקצועי שלנו
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar Section */}
          <div className="lg:col-span-2">
            <Card className="bg-white/80 backdrop-blur-sm border border-emerald-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl font-bold text-slate-800">
                  <div className="bg-gradient-to-br from-emerald-100 to-cyan-100 rounded-lg p-2 border border-emerald-200">
                    <Calendar className="h-5 w-5 text-emerald-600" />
                  </div>
                  יומן זמינות
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'calendar' | 'contact')}>
                  <TabsList className="grid w-full grid-cols-2 bg-slate-50 border border-slate-200 rounded-lg">
                    <TabsTrigger value="calendar" className="text-slate-700 data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-sm">
                      בחירת זמן
                    </TabsTrigger>
                    <TabsTrigger value="contact" className="text-slate-700 data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-sm">
                      פרטי פגישה
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="calendar" className="space-y-4 mt-4">
                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-2">
                      {['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'].map((day) => (
                        <div key={day} className="text-center p-2 font-medium text-slate-600 text-sm">
                          {day}
                        </div>
                      ))}
                      
                      {calendarData.map((day) => (
                        <motion.button
                          key={day.date}
                          onClick={() => handleDateSelect(day.date)}
                          className={`p-2 rounded-lg border transition-all duration-200 ${
                            selectedDate === day.date
                              ? 'bg-emerald-100 border-emerald-300 text-emerald-700'
                              : day.isWorkingDay
                              ? 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                              : 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                          }`}
                          disabled={!day.isWorkingDay}
                          whileHover={day.isWorkingDay ? { scale: 1.05 } : {}}
                          whileTap={day.isWorkingDay ? { scale: 0.95 } : {}}
                        >
                          <div className="text-sm font-medium">
                            {new Date(day.date).getDate()}
                          </div>
                          <div className="text-xs">
                            {day.dayName}
                          </div>
                        </motion.button>
                      ))}
                    </div>

                    {/* Time Slots */}
                    {selectedDate && (
                      <div className="space-y-3">
                        <h3 className="text-base font-medium text-slate-800">
                          זמנים זמינים ל-{new Date(selectedDate).toLocaleDateString('he-IL')}
                        </h3>
                        <div className="grid grid-cols-3 gap-2">
                          {calendarData
                            .find(day => day.date === selectedDate)
                            ?.timeSlots.filter(slot => slot.available)
                            .map((slot) => (
                              <motion.button
                                key={slot.id}
                                onClick={() => handleTimeSelect(slot.time)}
                                className={`p-2 rounded-lg border transition-all duration-200 ${
                                  selectedTime === slot.time
                                    ? 'bg-emerald-100 border-emerald-300 text-emerald-700'
                                    : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                                }`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <div className="text-sm font-medium">{slot.time}</div>
                                <div className="text-xs text-slate-500">זמין</div>
                              </motion.button>
                            ))}
                        </div>
                      </div>
                    )}

                    {/* Duration Selection */}
                    {selectedTime && (
                      <div className="space-y-3">
                        <h3 className="text-base font-medium text-slate-800">משך הפגישה</h3>
                        <div className="grid grid-cols-2 gap-2">
                          {DURATION_OPTIONS.map((option) => (
                            <motion.button
                              key={option.value}
                              onClick={() => handleDurationChange(option.value)}
                              className={`p-3 rounded-lg border transition-all duration-200 ${
                                selectedDuration === option.value
                                  ? 'bg-emerald-100 border-emerald-300 text-emerald-700'
                                  : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                              }`}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <div className="text-sm font-medium">{option.label}</div>
                              <div className="text-xs text-slate-500">₪{option.price}</div>
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Next Button */}
                    {selectedDate && selectedTime && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="pt-3"
                      >
                        <Button
                          onClick={() => setActiveTab('contact')}
                          className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-medium py-2 rounded-lg shadow-md text-sm"
                        >
                          המשך לפרטי פגישה
                          <ArrowLeft className="h-4 w-4 mr-2" />
                        </Button>
                      </motion.div>
                    )}
                  </TabsContent>

                  <TabsContent value="contact" className="space-y-4 mt-4">
                    <form onSubmit={handleSubmit} className="space-y-4">
                      {/* Selected Appointment Summary */}
                      {selectedDate && selectedTime && (
                        <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                          <h4 className="font-medium text-emerald-800 mb-2 text-sm">סיכום הפגישה</h4>
                          <div className="grid grid-cols-2 gap-3 text-xs">
                            <div>
                              <span className="text-slate-600">תאריך:</span>
                              <span className="font-medium text-slate-800 mr-2">
                                {new Date(selectedDate).toLocaleDateString('he-IL')}
                              </span>
                            </div>
                            <div>
                              <span className="text-slate-600">שעה:</span>
                              <span className="font-medium text-slate-800 mr-2">{selectedTime}</span>
                            </div>
                            <div>
                              <span className="text-slate-600">משך:</span>
                              <span className="font-medium text-slate-800 mr-2">
                                {DURATION_OPTIONS.find(opt => opt.value === selectedDuration)?.label}
                              </span>
                            </div>
                            <div>
                              <span className="text-slate-600">מחיר:</span>
                              <span className="font-medium text-emerald-700 mr-2">₪{getSelectedDurationPrice()}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Personal Details */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-slate-700 font-medium text-sm">שם פרטי</Label>
                          <Input
                            value={bookingForm.firstName}
                            onChange={(e) => handleFormChange('firstName', e.target.value)}
                            placeholder="יוחנן"
                            className="bg-white border-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-lg text-sm"
                            required
                          />
                        </div>
                        <div>
                          <Label className="text-slate-700 font-medium text-sm">שם משפחה</Label>
                          <Input
                            value={bookingForm.lastName}
                            onChange={(e) => handleFormChange('lastName', e.target.value)}
                            placeholder="כהן"
                            className="bg-white border-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-lg text-sm"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label className="text-slate-700 font-medium text-sm">אימייל</Label>
                        <Input
                          type="email"
                          value={bookingForm.email}
                          onChange={(e) => handleFormChange('email', e.target.value)}
                          placeholder="yohanan@example.com"
                          className="bg-white border-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-lg text-sm"
                          required
                        />
                      </div>

                      <div>
                        <Label className="text-slate-700 font-medium text-sm">טלפון</Label>
                        <Input
                          type="tel"
                          value={bookingForm.phone}
                          onChange={(e) => handleFormChange('phone', e.target.value)}
                          placeholder="050-123-4567"
                          className="bg-white border-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-lg text-sm"
                          required
                        />
                      </div>

                      <div>
                        <Label className="text-slate-700 font-medium text-sm">רמת ניסיון</Label>
                        <Select
                          value={bookingForm.experience}
                          onValueChange={(value) => handleFormChange('experience', value)}
                        >
                          <SelectTrigger className="bg-white border-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-lg text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {EXPERIENCE_OPTIONS.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-slate-700 font-medium text-sm">מטרות האימון</Label>
                        <Textarea
                          value={bookingForm.goal}
                          onChange={(e) => handleFormChange('goal', e.target.value)}
                          placeholder="ספר לי על המטרות שלך בכושר ומה שברצונך להשיג..."
                          rows={3}
                          className="bg-white border-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-lg text-sm"
                          required
                        />
                      </div>

                      <div>
                        <Label className="text-slate-700 font-medium text-sm">הערות נוספות</Label>
                        <Textarea
                          value={bookingForm.message}
                          onChange={(e) => handleFormChange('message', e.target.value)}
                          placeholder="הערות נוספות או בקשות מיוחדות..."
                          rows={2}
                          className="bg-white border-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-lg text-sm"
                        />
                      </div>

                      {/* Submit Button */}
                      <div className="flex gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setActiveTab('calendar')}
                          className="flex-1 bg-white border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg py-2 text-sm"
                        >
                          <ArrowRight className="h-4 w-4 ml-2" />
                          חזור ליומן
                        </Button>
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="flex-1 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-medium py-2 rounded-lg shadow-md text-sm"
                        >
                          {isSubmitting ? (
                            <div className="flex items-center gap-2">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              שולח...
                            </div>
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4 ml-2" />
                              קבע פגישה
                            </>
                          )}
                        </Button>
                      </div>

                      {/* Status Messages */}
                      {submitStatus === 'success' && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 text-emerald-700 text-sm"
                        >
                          <CheckCircle className="h-4 w-4" />
                          הפגישה נקבעה בהצלחה! נשלח אליך אישור באימייל
                        </motion.div>
                      )}

                      {submitStatus === 'error' && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-rose-700 text-sm"
                        >
                          <AlertCircle className="h-4 w-4" />
                          שגיאה בקביעת הפגישה. אנא נסה שוב
                        </motion.div>
                      )}
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Quick Contact */}
            <Card className="bg-white/80 backdrop-blur-sm border border-emerald-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-lg font-bold text-slate-800">
                  <div className="bg-gradient-to-br from-cyan-100 to-blue-100 rounded-lg p-2 border border-cyan-200">
                    <Phone className="h-4 w-4 text-cyan-600" />
                  </div>
                  יצירת קשר מהירה
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-slate-600 text-xs">
                  לא בטוחים מתי מתאים לכם? השאירו פרטים ונחזור אליכם בהקדם
                </p>
                <Button
                  variant="outline"
                  className="w-full bg-white border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg py-2 text-sm"
                >
                  <Mail className="h-4 w-4 ml-2" />
                  השאר פרטים
                </Button>
              </CardContent>
            </Card>

            {/* Pricing Info */}
            <Card className="bg-white/80 backdrop-blur-sm border border-emerald-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-lg font-bold text-slate-800">
                  <div className="bg-gradient-to-br from-amber-100 to-yellow-100 rounded-lg p-2 border border-amber-200">
                    <Target className="h-4 w-4 text-amber-600" />
                  </div>
                  מחירים
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {DURATION_OPTIONS.map((option) => (
                  <div key={option.value} className="flex justify-between items-center p-2 rounded-lg bg-slate-50">
                    <span className="text-xs text-slate-700">{option.label}</span>
                    <span className="font-medium text-slate-800 text-sm">₪{option.price}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Location Info */}
            <Card className="bg-white/80 backdrop-blur-sm border border-emerald-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-lg font-bold text-slate-800">
                  <div className="bg-gradient-to-br from-emerald-100 to-green-100 rounded-lg p-2 border border-emerald-200">
                    <MapPin className="h-4 w-4 text-emerald-600" />
                  </div>
                  מיקום
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-slate-600 text-xs">
                  האימונים מתקיימים במכון הכושר שלנו או בבית הלקוח
                </p>
                <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-xs">
                  גמישות במיקום
                </Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
