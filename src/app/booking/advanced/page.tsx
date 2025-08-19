"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Textarea } from '../../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Badge } from '../../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { Switch } from '../../../components/ui/switch';
import CalendarGrid from '../../../components/booking/CalendarGrid';
import TimeSlotManager from '../../../components/booking/TimeSlotManager';
import BookingRequestsManager from '../../../components/booking/BookingRequestsManager';
import { 
  Calendar, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Settings,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Plus,
  Minus,
  Edit,
  Trash2,
  Save,
  X,
  BarChart3,
  TrendingUp,
  Users,
  DollarSign
} from 'lucide-react';

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
  isCustom?: boolean;
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

interface TrainerSettings {
  workingDays: {
    sunday: boolean;
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
  };
  defaultWorkingHours: {
    start: string;
    end: string;
  };
  slotDuration: number;
  defaultPrice: number;
  maxBookingsPerSlot: number;
  autoConfirm: boolean;
  requireApproval: boolean;
}

interface BookingRequest {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  date: string;
  time: string;
  duration: number;
  price: number;
  status: 'pending' | 'confirmed' | 'rejected' | 'cancelled';
  goal: string;
  experience: string;
  message: string;
  createdAt: Date;
  updatedAt?: Date;
  notes?: string;
  paymentStatus?: 'pending' | 'paid' | 'refunded';
}

const DEFAULT_SETTINGS: TrainerSettings = {
  workingDays: {
    sunday: true,
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: false,
    saturday: false,
  },
  defaultWorkingHours: {
    start: '07:00',
    end: '22:00',
  },
  slotDuration: 60,
  defaultPrice: 150,
  maxBookingsPerSlot: 1,
  autoConfirm: false,
  requireApproval: true,
};

export default function AdvancedBookingPage() {
  const [activeTab, setActiveTab] = useState<'calendar' | 'settings' | 'bookings' | 'analytics'>('calendar');
  const [settings, setSettings] = useState<TrainerSettings>(DEFAULT_SETTINGS);
  const [isEditingSettings, setIsEditingSettings] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [calendarData, setCalendarData] = useState<DaySchedule[]>([]);
  const [bookingRequests, setBookingRequests] = useState<BookingRequest[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Generate calendar data based on settings
  const generateCalendarData = (): DaySchedule[] => {
    const calendar: DaySchedule[] = [];
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const dayName = date.toLocaleDateString('he-IL', { weekday: 'long' });
      const dateStr = date.toISOString().split('T')[0];
      const dayOfWeek = date.getDay();
      
      // Check if this day is a working day
      const isWorkingDay = (
        (dayOfWeek === 0 && settings.workingDays.sunday) ||
        (dayOfWeek === 1 && settings.workingDays.monday) ||
        (dayOfWeek === 2 && settings.workingDays.tuesday) ||
        (dayOfWeek === 3 && settings.workingDays.wednesday) ||
        (dayOfWeek === 4 && settings.workingDays.thursday) ||
        (dayOfWeek === 5 && settings.workingDays.friday) ||
        (dayOfWeek === 6 && settings.workingDays.saturday)
      );
      
      const timeSlots: TimeSlot[] = [];
      if (isWorkingDay) {
        const startHour = parseInt(settings.defaultWorkingHours.start.split(':')[0]);
        const endHour = parseInt(settings.defaultWorkingHours.end.split(':')[0]);
        
        for (let hour = startHour; hour < endHour; hour++) {
          const timeStr = `${hour.toString().padStart(2, '0')}:00`;
          timeSlots.push({
            id: `${dateStr}-${timeStr}`,
            time: timeStr,
            available: true,
            duration: settings.slotDuration,
            price: settings.defaultPrice,
            maxBookings: settings.maxBookingsPerSlot,
            currentBookings: 0,
          });
        }
      }
      
      calendar.push({
        date: dateStr,
        dayName,
        isWorkingDay,
        workingHours: settings.defaultWorkingHours,
        timeSlots,
      });
    }
    
    return calendar;
  };

  useEffect(() => {
    setCalendarData(generateCalendarData());
  }, [settings]);

  const handleSettingsChange = (field: keyof TrainerSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleWorkingDayToggle = (day: keyof TrainerSettings['workingDays']) => {
    setSettings(prev => ({
      ...prev,
      workingDays: {
        ...prev.workingDays,
        [day]: !prev.workingDays[day],
      },
    }));
  };

  const handleSaveSettings = () => {
    setIsSubmitting(true);
    // Here you would save settings to your backend
    setTimeout(() => {
      setIsSubmitting(false);
      setIsEditingSettings(false);
    }, 1000);
  };

  const handleBookingAction = (bookingId: string, action: 'confirm' | 'reject' | 'cancel') => {
    setBookingRequests(prev => 
      prev.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: action === 'confirm' ? 'confirmed' : action === 'reject' ? 'rejected' : 'cancelled' }
          : booking
      )
    );
  };

  const handleBookingUpdate = (bookingId: string, updates: Partial<BookingRequest>) => {
    setBookingRequests(prev => 
      prev.map(booking => 
        booking.id === bookingId 
          ? { ...booking, ...updates, updatedAt: new Date() }
          : booking
      )
    );
  };

  const handleBookingDelete = (bookingId: string) => {
    setBookingRequests(prev => prev.filter(booking => booking.id !== bookingId));
  };

  const handleSendMessage = (bookingId: string, message: string) => {
    // Here you would send the message to the client
    console.log(`Sending message to booking ${bookingId}:`, message);
  };

  const handleTimeSlotUpdate = (slotId: string, updates: Partial<TimeSlot>) => {
    setCalendarData(prev => 
      prev.map(day => ({
        ...day,
        timeSlots: day.timeSlots.map(slot => 
          slot.id === slotId ? { ...slot, ...updates } : slot
        )
      }))
    );
  };

  const handleTimeSlotDelete = (slotId: string) => {
    setCalendarData(prev => 
      prev.map(day => ({
        ...day,
        timeSlots: day.timeSlots.filter(slot => slot.id !== slotId)
      }))
    );
  };

  const handleTimeSlotAdd = (newSlot: Omit<TimeSlot, 'id'>) => {
    const slotId = `${selectedDate}-${newSlot.time}-custom`;
    const slotWithId = { ...newSlot, id: slotId };
    
    setCalendarData(prev => 
      prev.map(day => 
        day.date === selectedDate 
          ? { ...day, timeSlots: [...day.timeSlots, slotWithId] }
          : day
      )
    );
  };

  const handleBulkUpdate = (updates: Partial<TimeSlot>) => {
    setCalendarData(prev => 
      prev.map(day => 
        day.date === selectedDate 
          ? { 
              ...day, 
              timeSlots: day.timeSlots.map(slot => ({ ...slot, ...updates }))
            }
          : day
      )
    );
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
  };

  const handleTimeSlotEdit = (date: string, slotId: string) => {
    // This would open a modal or navigate to edit mode
    console.log('Edit slot:', slotId, 'for date:', date);
  };

  const handleDaySettingsEdit = (date: string) => {
    // This would open day settings modal
    console.log('Edit day settings for:', date);
  };

  const handleAddCustomSlot = (date: string) => {
    setSelectedDate(date);
    // This would trigger the add slot form
  };

  const getStatusColor = (status: BookingRequest['status']) => {
    switch (status) {
      case 'confirmed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'rejected': return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'cancelled': return 'bg-slate-100 text-slate-700 border-slate-200';
      default: return 'bg-amber-100 text-amber-700 border-amber-200';
    }
  };

  const getStatusText = (status: BookingRequest['status']) => {
    switch (status) {
      case 'confirmed': return 'אושר';
      case 'rejected': return 'נדחה';
      case 'cancelled': return 'בוטל';
      default: return 'ממתין לאישור';
    }
  };

  const selectedDayData = calendarData.find(day => day.date === selectedDate);

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
              <Settings className="h-10 w-10 text-emerald-600" />
            </div>
          </motion.div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent mb-4">
            מערכת יומן מתקדמת
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            ניהול מתקדם של יומן המאמן עם אפשרויות קביעת פגישות אוטומטית
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Calendar Section */}
          <div className="lg:col-span-3">
            <Card className="bg-white/80 backdrop-blur-sm border border-emerald-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl font-bold text-slate-800">
                  <div className="bg-gradient-to-br from-emerald-100 to-cyan-100 rounded-lg p-2 border border-emerald-200">
                    <Calendar className="h-5 w-5 text-emerald-600" />
                  </div>
                  יומן זמינות מתקדם
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'calendar' | 'settings' | 'bookings' | 'analytics')}>
                  <TabsList className="grid w-full grid-cols-4 bg-slate-50 border border-slate-200 rounded-lg">
                    <TabsTrigger value="calendar" className="text-slate-700 data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-sm">
                      יומן
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="text-slate-700 data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-sm">
                      הגדרות
                    </TabsTrigger>
                    <TabsTrigger value="bookings" className="text-slate-700 data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-sm">
                      בקשות
                    </TabsTrigger>
                    <TabsTrigger value="analytics" className="text-slate-700 data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-sm">
                      ניתוח
                    </TabsTrigger>
                  </TabsList>

                  {/* Calendar Tab */}
                  <TabsContent value="calendar" className="space-y-6 mt-4">
                    <CalendarGrid
                      calendarData={calendarData}
                      selectedDate={selectedDate}
                      onDateSelect={handleDateSelect}
                      onTimeSlotEdit={handleTimeSlotEdit}
                      onDaySettingsEdit={handleDaySettingsEdit}
                      onAddCustomSlot={handleAddCustomSlot}
                    />
                    
                    {selectedDate && selectedDayData && (
                      <TimeSlotManager
                        selectedDate={selectedDate}
                        timeSlots={selectedDayData.timeSlots}
                        onSlotUpdate={handleTimeSlotUpdate}
                        onSlotDelete={handleTimeSlotDelete}
                        onSlotAdd={handleTimeSlotAdd}
                        onBulkUpdate={handleBulkUpdate}
                      />
                    )}
                  </TabsContent>

                  {/* Settings Tab */}
                  <TabsContent value="settings" className="space-y-4 mt-4">
                    <div className="space-y-4">
                      {/* Working Days */}
                      <div>
                        <h3 className="text-base font-medium text-slate-800 mb-3">ימי עבודה</h3>
                        <div className="grid grid-cols-2 gap-3">
                          {Object.entries(settings.workingDays).map(([day, isWorking]) => (
                            <div key={day} className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                              <span className="text-sm font-medium text-slate-700">
                                {day === 'sunday' && 'ראשון'}
                                {day === 'monday' && 'שני'}
                                {day === 'tuesday' && 'שלישי'}
                                {day === 'wednesday' && 'רביעי'}
                                {day === 'thursday' && 'חמישי'}
                                {day === 'friday' && 'שישי'}
                                {day === 'saturday' && 'שבת'}
                              </span>
                              <Switch
                                checked={isWorking}
                                onCheckedChange={(checked: boolean) => handleWorkingDayToggle(day as keyof TrainerSettings['workingDays'])}
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Working Hours */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-slate-700 font-medium text-sm">שעת התחלה</Label>
                          <Input
                            type="time"
                            value={settings.defaultWorkingHours.start}
                            onChange={(e) => handleSettingsChange('defaultWorkingHours', {
                              ...settings.defaultWorkingHours,
                              start: e.target.value
                            })}
                            className="bg-white border-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-lg text-sm"
                          />
                        </div>
                        <div>
                          <Label className="text-slate-700 font-medium text-sm">שעת סיום</Label>
                          <Input
                            type="time"
                            value={settings.defaultWorkingHours.end}
                            onChange={(e) => handleSettingsChange('defaultWorkingHours', {
                              ...settings.defaultWorkingHours,
                              end: e.target.value
                            })}
                            className="bg-white border-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-lg text-sm"
                          />
                        </div>
                      </div>

                      {/* Other Settings */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-slate-700 font-medium text-sm">משך פגישה (דקות)</Label>
                          <Input
                            type="number"
                            value={settings.slotDuration}
                            onChange={(e) => handleSettingsChange('slotDuration', parseInt(e.target.value))}
                            className="bg-white border-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-lg text-sm"
                          />
                        </div>
                        <div>
                          <Label className="text-slate-700 font-medium text-sm">מחיר ברירת מחדל</Label>
                          <Input
                            type="number"
                            value={settings.defaultPrice}
                            onChange={(e) => handleSettingsChange('defaultPrice', parseInt(e.target.value))}
                            className="bg-white border-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-lg text-sm"
                          />
                        </div>
                      </div>

                      {/* Booking Settings */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                          <div>
                            <div className="text-sm font-medium text-slate-700">אישור אוטומטי</div>
                            <div className="text-xs text-slate-500">פגישות יאושרו אוטומטית</div>
                          </div>
                          <Switch
                            checked={settings.autoConfirm}
                            onCheckedChange={(checked: boolean) => handleSettingsChange('autoConfirm', checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                          <div>
                            <div className="text-sm font-medium text-slate-700">דרוש אישור</div>
                            <div className="text-xs text-slate-500">פגישות דורשות אישור ידני</div>
                          </div>
                          <Switch
                            checked={settings.requireApproval}
                            onCheckedChange={(checked: boolean) => handleSettingsChange('requireApproval', checked)}
                          />
                        </div>
                      </div>

                      {/* Save Button */}
                      <Button
                        onClick={handleSaveSettings}
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-medium py-2 rounded-lg shadow-md text-sm"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center gap-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            שומר...
                          </div>
                        ) : (
                          <>
                            <Save className="h-4 w-4 ml-2" />
                            שמור הגדרות
                          </>
                        )}
                      </Button>
                    </div>
                  </TabsContent>

                  {/* Bookings Tab */}
                  <TabsContent value="bookings" className="space-y-4 mt-4">
                    <BookingRequestsManager
                      bookingRequests={bookingRequests}
                      onBookingAction={handleBookingAction}
                      onBookingUpdate={handleBookingUpdate}
                      onBookingDelete={handleBookingDelete}
                      onSendMessage={handleSendMessage}
                    />
                  </TabsContent>

                  {/* Analytics Tab */}
                  <TabsContent value="analytics" className="space-y-4 mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-emerald-700">פגישות החודש</p>
                              <p className="text-2xl font-bold text-emerald-800">24</p>
                            </div>
                            <div className="bg-emerald-200 rounded-full p-2">
                              <Calendar className="h-6 w-6 text-emerald-700" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-gradient-to-br from-cyan-50 to-cyan-100 border-cyan-200">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-cyan-700">הכנסות החודש</p>
                              <p className="text-2xl font-bold text-cyan-800">₪3,600</p>
                            </div>
                            <div className="bg-cyan-200 rounded-full p-2">
                              <DollarSign className="h-6 w-6 text-cyan-700" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-purple-700">לקוחות פעילים</p>
                              <p className="text-2xl font-bold text-purple-800">12</p>
                            </div>
                            <div className="bg-purple-200 rounded-full p-2">
                              <Users className="h-6 w-6 text-purple-700" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-amber-700">אחוז זמינות</p>
                              <p className="text-2xl font-bold text-amber-800">85%</p>
                            </div>
                            <div className="bg-amber-200 rounded-full p-2">
                              <TrendingUp className="h-6 w-6 text-amber-700" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <Card className="bg-white/80 backdrop-blur-sm border border-emerald-200">
                        <CardHeader>
                          <CardTitle className="text-lg font-bold text-slate-800">סטטיסטיקות שבועיות</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'].map((day, index) => (
                              <div key={day} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                                <span className="text-sm text-slate-700">{day}</span>
                                <div className="flex items-center gap-2">
                                  <div className="w-16 bg-slate-200 rounded-full h-2">
                                    <div 
                                      className="bg-emerald-500 h-2 rounded-full" 
                                      style={{ width: `${Math.random() * 100}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-xs text-slate-600">{Math.floor(Math.random() * 5) + 1}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-white/80 backdrop-blur-sm border border-emerald-200">
                        <CardHeader>
                          <CardTitle className="text-lg font-bold text-slate-800">פעילות אחרונה</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {[
                              { action: 'פגישה חדשה', client: 'דוד כהן', time: 'לפני 2 שעות' },
                              { action: 'ביטול פגישה', client: 'שרה לוי', time: 'לפני 4 שעות' },
                              { action: 'עדכון הגדרות', client: 'מערכת', time: 'לפני 6 שעות' },
                              { action: 'פגישה חדשה', client: 'מיכאל רוזן', time: 'לפני יום' },
                            ].map((activity, index) => (
                              <div key={index} className="flex items-center gap-3 p-2 bg-slate-50 rounded">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                <div className="flex-1">
                                  <p className="text-sm text-slate-800">{activity.action}</p>
                                  <p className="text-xs text-slate-600">{activity.client}</p>
                                </div>
                                <span className="text-xs text-slate-500">{activity.time}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Quick Stats */}
            <Card className="bg-white/80 backdrop-blur-sm border border-emerald-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-slate-800">סטטיסטיקות</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-center p-3 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg border border-emerald-200">
                  <div className="text-xl font-bold text-emerald-700">{bookingRequests.length}</div>
                  <div className="text-xs text-slate-600">סך הכל בקשות</div>
                </div>
                <div className="text-center p-3 bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-lg border border-cyan-200">
                  <div className="text-xl font-bold text-cyan-700">
                    {bookingRequests.filter(b => b.status === 'pending').length}
                  </div>
                  <div className="text-xs text-slate-600">ממתינות לאישור</div>
                </div>
                <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                  <div className="text-xl font-bold text-purple-700">
                    {bookingRequests.filter(b => b.status === 'confirmed').length}
                  </div>
                  <div className="text-xs text-slate-600">פגישות מאושרות</div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-white/80 backdrop-blur-sm border border-emerald-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-slate-800">פעולות מהירות</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full bg-white border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg py-2 text-sm"
                >
                  <Calendar className="h-4 w-4 ml-2" />
                  צור פגישה חדשה
                </Button>
                <Button
                  variant="outline"
                  className="w-full bg-white border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg py-2 text-sm"
                >
                  <Settings className="h-4 w-4 ml-2" />
                  הגדרות מתקדמות
                </Button>
                <Button
                  variant="outline"
                  className="w-full bg-white border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg py-2 text-sm"
                >
                  <Mail className="h-4 w-4 ml-2" />
                  שלח הודעה לכל הלקוחות
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
