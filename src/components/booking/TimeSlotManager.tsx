"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { 
  Clock, 
  Edit, 
  Trash2, 
  Plus, 
  Save, 
  X, 
  DollarSign,
  Users,
  AlertCircle,
  CheckCircle
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

interface TimeSlotManagerProps {
  selectedDate: string;
  timeSlots: TimeSlot[];
  onSlotUpdate: (slotId: string, updates: Partial<TimeSlot>) => void;
  onSlotDelete: (slotId: string) => void;
  onSlotAdd: (newSlot: Omit<TimeSlot, 'id'>) => void;
  onBulkUpdate: (updates: Partial<TimeSlot>) => void;
}

export default function TimeSlotManager({
  selectedDate,
  timeSlots,
  onSlotUpdate,
  onSlotDelete,
  onSlotAdd,
  onBulkUpdate,
}: TimeSlotManagerProps) {
  const [editingSlot, setEditingSlot] = useState<string | null>(null);
  const [isAddingSlot, setIsAddingSlot] = useState(false);
  const [bulkEditMode, setBulkEditMode] = useState(false);
  const [editForm, setEditForm] = useState<Partial<TimeSlot>>({});
  const [newSlotForm, setNewSlotForm] = useState<Partial<TimeSlot>>({
    time: '',
    available: true,
    duration: 60,
    price: 150,
    maxBookings: 1,
    currentBookings: 0,
    isCustom: true,
  });

  const handleEditSlot = (slot: TimeSlot) => {
    setEditingSlot(slot.id);
    setEditForm({
      time: slot.time,
      available: slot.available,
      duration: slot.duration,
      price: slot.customPrice || slot.price,
      maxBookings: slot.maxBookings,
      customNote: slot.customNote,
    });
  };

  const handleSaveEdit = () => {
    if (editingSlot) {
      onSlotUpdate(editingSlot, editForm);
      setEditingSlot(null);
      setEditForm({});
    }
  };

  const handleCancelEdit = () => {
    setEditingSlot(null);
    setEditForm({});
  };

  const handleAddSlot = () => {
    if (newSlotForm.time) {
      onSlotAdd(newSlotForm as Omit<TimeSlot, 'id'>);
      setNewSlotForm({
        time: '',
        available: true,
        duration: 60,
        price: 150,
        maxBookings: 1,
        currentBookings: 0,
        isCustom: true,
      });
      setIsAddingSlot(false);
    }
  };

  const handleBulkUpdate = () => {
    onBulkUpdate(editForm);
    setBulkEditMode(false);
    setEditForm({});
  };

  const getSlotStatus = (slot: TimeSlot) => {
    if (!slot.available) return 'unavailable';
    if (slot.currentBookings >= slot.maxBookings) return 'full';
    if (slot.currentBookings > 0) return 'partially-booked';
    return 'available';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unavailable': return 'bg-slate-100 border-slate-200 text-slate-400';
      case 'full': return 'bg-red-100 border-red-200 text-red-700';
      case 'partially-booked': return 'bg-amber-100 border-amber-200 text-amber-700';
      case 'available': return 'bg-emerald-100 border-emerald-200 text-emerald-700';
      default: return 'bg-white border-slate-200 text-slate-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'unavailable': return <X className="h-4 w-4" />;
      case 'full': return <AlertCircle className="h-4 w-4" />;
      case 'partially-booked': return <Users className="h-4 w-4" />;
      case 'available': return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm border border-emerald-200 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-xl font-bold text-slate-800">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-emerald-100 to-cyan-100 rounded-lg p-2 border border-emerald-200">
              <Clock className="h-5 w-5 text-emerald-600" />
            </div>
            זמני פגישות - {new Date(selectedDate).toLocaleDateString('he-IL')}
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setBulkEditMode(!bulkEditMode)}
              className={`bg-white border-slate-300 hover:bg-slate-50 text-slate-700 text-xs ${
                bulkEditMode ? 'bg-emerald-50 border-emerald-300' : ''
              }`}
            >
              <Edit className="h-3 w-3 ml-1" />
              עריכה מרוכזת
            </Button>
            <Button
              size="sm"
              onClick={() => setIsAddingSlot(true)}
              className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white text-xs"
            >
              <Plus className="h-3 w-3 ml-1" />
              הוסף זמן
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Bulk Edit Mode */}
        {bulkEditMode && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-amber-50 rounded-lg border border-amber-200"
          >
            <h4 className="text-sm font-medium text-amber-800 mb-3">עריכה מרוכזת</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-slate-700 font-medium text-sm">מחיר</Label>
                <Input
                  type="number"
                  value={editForm.price || ''}
                  onChange={(e) => setEditForm({ ...editForm, price: parseInt(e.target.value) })}
                  className="bg-white border-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-lg text-sm"
                  placeholder="מחיר ברירת מחדל"
                />
              </div>
              <div>
                <Label className="text-slate-700 font-medium text-sm">משך (דקות)</Label>
                <Input
                  type="number"
                  value={editForm.duration || ''}
                  onChange={(e) => setEditForm({ ...editForm, duration: parseInt(e.target.value) })}
                  className="bg-white border-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-lg text-sm"
                  placeholder="משך ברירת מחדל"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <Button
                size="sm"
                onClick={handleBulkUpdate}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
              >
                <Save className="h-3 w-3 ml-1" />
                החל על הכל
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setBulkEditMode(false)}
                className="bg-white border-slate-300 hover:bg-slate-50 text-slate-700 text-xs"
              >
                <X className="h-3 w-3 ml-1" />
                ביטול
              </Button>
            </div>
          </motion.div>
        )}

        {/* Add New Slot */}
        {isAddingSlot && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-emerald-50 rounded-lg border border-emerald-200"
          >
            <h4 className="text-sm font-medium text-emerald-800 mb-3">הוסף זמן חדש</h4>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label className="text-slate-700 font-medium text-sm">שעה</Label>
                <Input
                  type="time"
                  value={newSlotForm.time || ''}
                  onChange={(e) => setNewSlotForm({ ...newSlotForm, time: e.target.value })}
                  className="bg-white border-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-lg text-sm"
                />
              </div>
              <div>
                <Label className="text-slate-700 font-medium text-sm">מחיר</Label>
                <Input
                  type="number"
                  value={newSlotForm.price || ''}
                  onChange={(e) => setNewSlotForm({ ...newSlotForm, price: parseInt(e.target.value) })}
                  className="bg-white border-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-lg text-sm"
                />
              </div>
              <div>
                <Label className="text-slate-700 font-medium text-sm">משך (דקות)</Label>
                <Input
                  type="number"
                  value={newSlotForm.duration || ''}
                  onChange={(e) => setNewSlotForm({ ...newSlotForm, duration: parseInt(e.target.value) })}
                  className="bg-white border-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-lg text-sm"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <Button
                size="sm"
                onClick={handleAddSlot}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
              >
                <Plus className="h-3 w-3 ml-1" />
                הוסף
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsAddingSlot(false)}
                className="bg-white border-slate-300 hover:bg-slate-50 text-slate-700 text-xs"
              >
                <X className="h-3 w-3 ml-1" />
                ביטול
              </Button>
            </div>
          </motion.div>
        )}

        {/* Time Slots Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {timeSlots.map((slot) => {
            const status = getSlotStatus(slot);
            const isEditing = editingSlot === slot.id;

            return (
              <motion.div
                key={slot.id}
                layout
                className={`p-3 rounded-lg border transition-all duration-200 ${
                  isEditing ? 'bg-emerald-50 border-emerald-300' : getStatusColor(status)
                }`}
              >
                {isEditing ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs text-slate-600">שעה</Label>
                        <Input
                          type="time"
                          value={editForm.time || ''}
                          onChange={(e) => setEditForm({ ...editForm, time: e.target.value })}
                          className="bg-white border-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-lg text-xs"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-slate-600">מחיר</Label>
                        <Input
                          type="number"
                          value={editForm.price || ''}
                          onChange={(e) => setEditForm({ ...editForm, price: parseInt(e.target.value) })}
                          className="bg-white border-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-lg text-xs"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-slate-600">הערה</Label>
                      <Textarea
                        value={editForm.customNote || ''}
                        onChange={(e) => setEditForm({ ...editForm, customNote: e.target.value })}
                        className="bg-white border-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-lg text-xs"
                        rows={2}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={editForm.available !== false}
                          onCheckedChange={(checked) => setEditForm({ ...editForm, available: checked })}
                        />
                        <span className="text-xs text-slate-600">זמין</span>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          onClick={handleSaveEdit}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
                        >
                          <Save className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCancelEdit}
                          className="bg-white border-slate-300 hover:bg-slate-50 text-slate-700 text-xs"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(status)}
                        <span className="font-medium text-sm">{slot.time}</span>
                        {slot.isCustom && (
                          <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs">
                            מותאם
                          </Badge>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditSlot(slot)}
                          className="h-6 w-6 p-0 bg-white border-slate-300 hover:bg-slate-50"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        {slot.isCustom && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onSlotDelete(slot.id)}
                            className="h-6 w-6 p-0 bg-white border-slate-300 hover:bg-slate-50"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        <span>₪{slot.customPrice || slot.price}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{slot.duration} דקות</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>{slot.currentBookings}/{slot.maxBookings}</span>
                      </div>
                      <div className={`w-2 h-2 rounded-full ${
                        status === 'available' ? 'bg-emerald-500' :
                        status === 'partially-booked' ? 'bg-amber-500' :
                        status === 'full' ? 'bg-red-500' : 'bg-slate-400'
                      }`} />
                    </div>
                    
                    {slot.customNote && (
                      <div className="text-xs text-slate-600 bg-white/50 rounded p-1">
                        {slot.customNote}
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <h4 className="text-sm font-medium text-slate-800 mb-3">סיכום היום</h4>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="text-xl font-bold text-emerald-700">{timeSlots.length}</div>
              <div className="text-xs text-slate-600">סך הכל זמנים</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-cyan-700">
                {timeSlots.filter(slot => slot.available).length}
              </div>
              <div className="text-xs text-slate-600">זמנים זמינים</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-purple-700">
                {timeSlots.reduce((total, slot) => total + slot.currentBookings, 0)}
              </div>
              <div className="text-xs text-slate-600">פגישות מוזמנות</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
