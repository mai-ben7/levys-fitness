"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { 
  Calendar, 
  Mail, 
  Phone, 
  CheckCircle, 
  X, 
  AlertCircle,
  MessageSquare,
  Filter,
  Search,
  SortAsc,
  SortDesc,
  Edit
} from 'lucide-react';

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

interface BookingRequestsManagerProps {
  bookingRequests: BookingRequest[];
  onBookingAction: (bookingId: string, action: 'confirm' | 'reject' | 'cancel') => void;
  onBookingUpdate: (bookingId: string, updates: Partial<BookingRequest>) => void;
  onSendMessage: (bookingId: string, message: string) => void;
}

export default function BookingRequestsManager({
  bookingRequests,
  onBookingAction,
  onBookingUpdate,
  onSendMessage,
}: BookingRequestsManagerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'createdAt' | 'clientName'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const [editingBooking, setEditingBooking] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<BookingRequest>>({});

  const filteredBookings = bookingRequests
    .filter(booking => {
      const matchesSearch = 
        booking.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.clientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.clientPhone.includes(searchTerm);
      
      const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case 'createdAt':
          comparison = a.createdAt.getTime() - b.createdAt.getTime();
          break;
        case 'clientName':
          comparison = a.clientName.localeCompare(b.clientName);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const handleBookingAction = (bookingId: string, action: 'confirm' | 'reject' | 'cancel') => {
    onBookingAction(bookingId, action);
  };

  const handleEditBooking = (booking: BookingRequest) => {
    setEditingBooking(booking.id);
    setEditForm({
      clientName: booking.clientName,
      clientEmail: booking.clientEmail,
      clientPhone: booking.clientPhone,
      goal: booking.goal,
      experience: booking.experience,
      message: booking.message,
      notes: booking.notes,
    });
  };

  const handleSaveEdit = () => {
    if (editingBooking) {
      onBookingUpdate(editingBooking, editForm);
      setEditingBooking(null);
      setEditForm({});
    }
  };

  const handleCancelEdit = () => {
    setEditingBooking(null);
    setEditForm({});
  };

  const handleSendMessage = () => {
    if (selectedBooking && messageText.trim()) {
      onSendMessage(selectedBooking, messageText);
      setMessageText('');
      setSelectedBooking(null);
    }
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

  const getPaymentStatusColor = (status?: string) => {
    switch (status) {
      case 'paid': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'refunded': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-amber-100 text-amber-700 border-amber-200';
    }
  };

  const getPaymentStatusText = (status?: string) => {
    switch (status) {
      case 'paid': return 'שולם';
      case 'refunded': return 'הוחזר';
      default: return 'ממתין לתשלום';
    }
  };

  const stats = {
    total: bookingRequests.length,
    pending: bookingRequests.filter(b => b.status === 'pending').length,
    confirmed: bookingRequests.filter(b => b.status === 'confirmed').length,
    rejected: bookingRequests.filter(b => b.status === 'rejected').length,
    cancelled: bookingRequests.filter(b => b.status === 'cancelled').length,
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm border border-emerald-200 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-xl font-bold text-slate-800">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-emerald-100 to-cyan-100 rounded-lg p-2 border border-emerald-200">
              <Calendar className="h-5 w-5 text-emerald-600" />
            </div>
            ניהול בקשות פגישות
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="bg-white border-slate-300 hover:bg-slate-50 text-slate-700 text-xs"
            >
              {sortOrder === 'asc' ? <SortAsc className="h-3 w-3 ml-1" /> : <SortDesc className="h-3 w-3 ml-1" />}
              מיון
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Stats */}
        <div className="grid grid-cols-5 gap-3 mb-6">
          <div className="text-center p-3 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg border border-emerald-200">
            <div className="text-xl font-bold text-emerald-700">{stats.total}</div>
            <div className="text-xs text-slate-600">סך הכל</div>
          </div>
          <div className="text-center p-3 bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg border border-amber-200">
            <div className="text-xl font-bold text-amber-700">{stats.pending}</div>
            <div className="text-xs text-slate-600">ממתינות</div>
          </div>
          <div className="text-center p-3 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg border border-emerald-200">
            <div className="text-xl font-bold text-emerald-700">{stats.confirmed}</div>
            <div className="text-xs text-slate-600">אושרו</div>
          </div>
          <div className="text-center p-3 bg-gradient-to-br from-rose-50 to-rose-100 rounded-lg border border-rose-200">
            <div className="text-xl font-bold text-rose-700">{stats.rejected}</div>
            <div className="text-xs text-slate-600">נדחו</div>
          </div>
          <div className="text-center p-3 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg border border-slate-200">
            <div className="text-xl font-bold text-slate-700">{stats.cancelled}</div>
            <div className="text-xs text-slate-600">בוטלו</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="חפש לפי שם, אימייל או טלפון..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10 bg-white border-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-lg text-sm"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40 bg-white border-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-lg text-sm">
              <Filter className="h-4 w-4 ml-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">כל הסטטוסים</SelectItem>
              <SelectItem value="pending">ממתין לאישור</SelectItem>
              <SelectItem value="confirmed">אושר</SelectItem>
              <SelectItem value="rejected">נדחה</SelectItem>
              <SelectItem value="cancelled">בוטל</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={(value: 'date' | 'createdAt' | 'clientName') => setSortBy(value)}>
            <SelectTrigger className="w-40 bg-white border-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-lg text-sm">
              <SortAsc className="h-4 w-4 ml-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">תאריך פגישה</SelectItem>
              <SelectItem value="createdAt">תאריך יצירה</SelectItem>
              <SelectItem value="clientName">שם לקוח</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Bookings List */}
        <div className="space-y-3">
          {filteredBookings.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-3xl mb-3">📋</div>
              <p className="text-slate-600 text-sm">לא נמצאו בקשות פגישה</p>
            </div>
          ) : (
            filteredBookings.map((booking) => (
              <motion.div
                key={booking.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-white rounded-lg border border-slate-200 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-medium text-slate-800">{booking.clientName}</h4>
                      <Badge className={getStatusColor(booking.status)}>
                        {getStatusText(booking.status)}
                      </Badge>
                      {booking.paymentStatus && (
                        <Badge className={getPaymentStatusColor(booking.paymentStatus)}>
                          {getPaymentStatusText(booking.paymentStatus)}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {booking.clientEmail}
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {booking.clientPhone}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedBooking(booking.id)}
                      className="bg-white border-slate-300 hover:bg-slate-50 text-slate-700 text-xs"
                    >
                      <MessageSquare className="h-3 w-3 ml-1" />
                      הודעה
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditBooking(booking)}
                      className="bg-white border-slate-300 hover:bg-slate-50 text-slate-700 text-xs"
                    >
                      <Edit className="h-3 w-3 ml-1" />
                      ערוך
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                  <div>
                    <span className="text-slate-600">תאריך:</span>
                    <span className="font-medium text-slate-800 mr-2">
                      {new Date(booking.date).toLocaleDateString('he-IL')}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-600">שעה:</span>
                    <span className="font-medium text-slate-800 mr-2">{booking.time}</span>
                  </div>
                  <div>
                    <span className="text-slate-600">משך:</span>
                    <span className="font-medium text-slate-800 mr-2">{booking.duration} דקות</span>
                  </div>
                  <div>
                    <span className="text-slate-600">מחיר:</span>
                    <span className="font-medium text-emerald-700 mr-2">₪{booking.price}</span>
                  </div>
                </div>

                {booking.message && (
                  <div className="mb-3 p-2 bg-slate-50 rounded text-sm text-slate-700">
                    <strong>הודעה מהלקוח:</strong> {booking.message}
                  </div>
                )}

                {booking.notes && (
                  <div className="mb-3 p-2 bg-amber-50 rounded text-sm text-amber-700">
                    <strong>הערות:</strong> {booking.notes}
                  </div>
                )}

                {booking.status === 'pending' && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleBookingAction(booking.id, 'confirm')}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
                    >
                      <CheckCircle className="h-3 w-3 ml-1" />
                      אשר
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleBookingAction(booking.id, 'reject')}
                      className="bg-white border-slate-300 hover:bg-slate-50 text-slate-700 text-xs"
                    >
                      <X className="h-3 w-3 ml-1" />
                      דחה
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleBookingAction(booking.id, 'cancel')}
                      className="bg-white border-slate-300 hover:bg-slate-50 text-slate-700 text-xs"
                    >
                      <AlertCircle className="h-3 w-3 ml-1" />
                      בטל
                    </Button>
                  </div>
                )}
              </motion.div>
            ))
          )}
        </div>

        {/* Message Modal */}
        {selectedBooking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setSelectedBooking(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-medium text-slate-800 mb-4">שלח הודעה</h3>
              <Textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="כתוב הודעה ללקוח..."
                className="bg-white border-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-lg text-sm mb-4"
                rows={4}
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleSendMessage}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm"
                >
                  <MessageSquare className="h-4 w-4 ml-1" />
                  שלח
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSelectedBooking(null)}
                  className="bg-white border-slate-300 hover:bg-slate-50 text-slate-700 text-sm"
                >
                  <X className="h-4 w-4 ml-1" />
                  ביטול
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Edit Modal */}
        {editingBooking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setEditingBooking(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-lg p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-medium text-slate-800 mb-4">ערוך פרטי פגישה</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-slate-700 font-medium text-sm">שם לקוח</Label>
                    <Input
                      value={editForm.clientName || ''}
                      onChange={(e) => setEditForm({ ...editForm, clientName: e.target.value })}
                      className="bg-white border-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-700 font-medium text-sm">אימייל</Label>
                    <Input
                      value={editForm.clientEmail || ''}
                      onChange={(e) => setEditForm({ ...editForm, clientEmail: e.target.value })}
                      className="bg-white border-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-lg text-sm"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-slate-700 font-medium text-sm">טלפון</Label>
                  <Input
                    value={editForm.clientPhone || ''}
                    onChange={(e) => setEditForm({ ...editForm, clientPhone: e.target.value })}
                    className="bg-white border-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <Label className="text-slate-700 font-medium text-sm">מטרות האימון</Label>
                  <Textarea
                    value={editForm.goal || ''}
                    onChange={(e) => setEditForm({ ...editForm, goal: e.target.value })}
                    className="bg-white border-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-lg text-sm"
                    rows={2}
                  />
                </div>
                <div>
                  <Label className="text-slate-700 font-medium text-sm">הערות</Label>
                  <Textarea
                    value={editForm.notes || ''}
                    onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                    className="bg-white border-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-lg text-sm"
                    rows={2}
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <Button
                  onClick={handleSaveEdit}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm"
                >
                  <CheckCircle className="h-4 w-4 ml-1" />
                  שמור
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancelEdit}
                  className="bg-white border-slate-300 hover:bg-slate-50 text-slate-700 text-sm"
                >
                  <X className="h-4 w-4 ml-1" />
                  ביטול
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
