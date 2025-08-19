"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  BookOpen, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Clock, 
  Utensils, 
  Star
} from 'lucide-react';
import { FoodEntry, MealType } from './types';
import { getMealColor } from './utils';
import { copy } from './copy';

interface JournalProps {
  entries: FoodEntry[];
  onEditEntry: (id: string, entry: FoodEntry) => void;
  onDeleteEntry: (id: string) => void;
  dailyNotes: string;
  onUpdateDailyNotes: (notes: string) => void;
}

const mealTypes: { value: MealType; label: string; icon: React.ReactNode }[] = [
  { value: 'breakfast', label: copy.meals.breakfast, icon: <Clock className="h-4 w-4" /> },
  { value: 'lunch', label: copy.meals.lunch, icon: <Utensils className="h-4 w-4" /> },
  { value: 'dinner', label: copy.meals.dinner, icon: <Utensils className="h-4 w-4" /> },
  { value: 'snack', label: copy.meals.snack, icon: <Star className="h-4 w-4" /> },
];

export default function Journal({ 
  entries, 
  onEditEntry, 
  onDeleteEntry, 
  dailyNotes,
  onUpdateDailyNotes 
}: JournalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [mealFilter, setMealFilter] = useState<MealType | 'all'>('all');
  const [editingEntry, setEditingEntry] = useState<FoodEntry | null>(null);
  const [editForm, setEditForm] = useState<{
    id: string;
    name: string;
    calories: string;
    protein: string;
    carbs: string;
    fat: string;
    quantity: string;
    unit: string;
    meal: MealType;
    note: string;
  } | null>(null);

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMeal = mealFilter === 'all' || entry.meal === mealFilter;
    return matchesSearch && matchesMeal;
  });

  const entriesByMeal = filteredEntries.reduce((acc, entry) => {
    if (!acc[entry.meal]) {
      acc[entry.meal] = [];
    }
    acc[entry.meal].push(entry);
    return acc;
  }, {} as Record<MealType, FoodEntry[]>);

  const handleInputChange = (field: string, value: string) => {
    if (!editForm) return;
    
    setEditForm(prev => {
      if (!prev) return null;
      return {
        ...prev,
        [field]: value,
      };
    });
  };

  const handleSaveEdit = () => {
    if (!editForm || !editingEntry) return;

    const updatedEntry: FoodEntry = {
      ...editingEntry,
      name: editForm.name,
      calories: parseFloat(editForm.calories) || 0,
      protein: parseFloat(editForm.protein) || 0,
      carbs: parseFloat(editForm.carbs) || 0,
      fat: parseFloat(editForm.fat) || 0,
      quantity: parseFloat(editForm.quantity) || 1,
      unit: editForm.unit,
      meal: editForm.meal,
      note: editForm.note,
    };

    onEditEntry(editingEntry.id, updatedEntry);
    setEditingEntry(null);
    setEditForm(null);
  };

  const handleCancelEdit = () => {
    setEditingEntry(null);
    setEditForm(null);
  };

  const handleEdit = (entry: FoodEntry) => {
    setEditingEntry(entry);
    setEditForm({
      id: entry.id,
      name: entry.name,
      calories: entry.calories.toString(),
      protein: entry.protein.toString(),
      carbs: entry.carbs.toString(),
      fat: entry.fat.toString(),
      quantity: (entry.quantity || 1).toString(),
      unit: entry.unit || 'יחידה',
      meal: entry.meal,
      note: entry.note || '',
    });
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('he-IL', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card className="w-full bg-white/80 backdrop-blur-sm border border-emerald-200 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl" dir="rtl">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl font-bold text-slate-800">
          <div className="bg-gradient-to-br from-emerald-100 to-cyan-100 rounded-lg p-2 border border-emerald-200">
            <BookOpen className="h-5 w-5 text-emerald-600" />
          </div>
          יומן מזון
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Search and Filter */}
        <div className="space-y-3">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="חפש מזון..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10 bg-white border-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20 text-slate-900 rounded-lg text-sm"
              />
            </div>
            <Select value={mealFilter} onValueChange={(value: MealType | 'all') => setMealFilter(value)}>
              <SelectTrigger className="w-40 bg-white border-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20 text-slate-900 rounded-lg text-sm">
                <Filter className="h-4 w-4 ml-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">כל הארוחות</SelectItem>
                {mealTypes.map((meal) => (
                  <SelectItem key={meal.value} value={meal.value}>
                    <div className="flex items-center gap-2">
                      {meal.icon}
                      {meal.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Daily Notes */}
        <div>
          <Label htmlFor="daily-notes" className="text-slate-700 font-medium text-sm">הערות יומיות</Label>
          <Textarea
            id="daily-notes"
            value={dailyNotes}
            onChange={(e) => onUpdateDailyNotes(e.target.value)}
            placeholder="כתוב הערות על היום שלך..."
            rows={2}
            className="bg-white border-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20 text-slate-900 rounded-lg text-sm"
          />
        </div>

        {/* Entries List */}
        {filteredEntries.length === 0 ? (
          <div className="text-center py-6">
            <div className="text-3xl mb-3">📝</div>
            <p className="text-slate-600 text-sm">{copy.emptyState}</p>
          </div>
        ) : (
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-5 bg-slate-50 border border-slate-200 rounded-lg">
              <TabsTrigger value="all" className="text-xs text-slate-700 data-[state=active]:bg-emerald-600 data-[state=active]:text-white">הכל</TabsTrigger>
              {mealTypes.map((meal) => (
                <TabsTrigger key={meal.value} value={meal.value} className="text-xs text-slate-700 data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                  {meal.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="all" className="space-y-3 mt-3">
              {Object.entries(entriesByMeal).map(([meal, mealEntries]) => (
                <div key={meal} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge className={`${getMealColor(meal)} text-white shadow-sm text-xs`}>
                      {mealTypes.find(m => m.value === meal)?.label}
                    </Badge>
                    <span className="text-xs text-slate-700">
                      {mealEntries.length} פריטים
                    </span>
                  </div>
                  <div className="space-y-2">
                    {mealEntries.map((entry) => (
                      <JournalEntry
                        key={entry.id}
                        entry={entry}
                        onEdit={handleEdit}
                        onDelete={onDeleteEntry}
                        isEditing={editingEntry?.id === entry.id}
                        editForm={editForm}
                        onInputChange={handleInputChange}
                        onSaveEdit={handleSaveEdit}
                        onCancelEdit={handleCancelEdit}
                        formatTime={formatTime}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </TabsContent>

            {mealTypes.map((meal) => (
              <TabsContent key={meal.value} value={meal.value} className="space-y-3 mt-3">
                {entriesByMeal[meal.value as MealType]?.map((entry) => (
                  <JournalEntry
                    key={entry.id}
                    entry={entry}
                    onEdit={handleEdit}
                    onDelete={onDeleteEntry}
                    isEditing={editingEntry?.id === entry.id}
                    editForm={editForm}
                    onInputChange={handleInputChange}
                    onSaveEdit={handleSaveEdit}
                    onCancelEdit={handleCancelEdit}
                    formatTime={formatTime}
                  />
                ))}
              </TabsContent>
            ))}
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}

interface JournalEntryProps {
  entry: FoodEntry;
  onEdit: (entry: FoodEntry) => void;
  onDelete: (id: string) => void;
  isEditing: boolean;
  editForm: {
    id: string;
    name: string;
    calories: string;
    protein: string;
    carbs: string;
    fat: string;
    quantity: string;
    unit: string;
    meal: MealType;
    note: string;
  } | null;
  onInputChange: (field: string, value: string) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  formatTime: (timestamp: number) => string;
}

function JournalEntry({
  entry,
  onEdit,
  onDelete,
  isEditing,
  editForm,
  onInputChange,
  onSaveEdit,
  onCancelEdit,
  formatTime,
}: JournalEntryProps) {
  if (isEditing) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-3 bg-gradient-to-br from-emerald-50 to-cyan-50 rounded-lg border border-emerald-200"
      >
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs text-slate-600">שם</Label>
              <Input
                value={editForm?.name}
                onChange={(e) => onInputChange('name', e.target.value)}
                className="bg-white border-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20 text-slate-900 rounded-lg text-sm"
              />
            </div>
            <div>
              <Label className="text-xs text-slate-600">קלוריות</Label>
              <Input
                type="number"
                value={editForm?.calories}
                onChange={(e) => onInputChange('calories', e.target.value)}
                className="bg-white border-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20 text-slate-900 rounded-lg text-sm"
              />
            </div>
            <div>
              <Label className="text-xs text-slate-600">חלבון</Label>
              <Input
                type="number"
                value={editForm?.protein}
                onChange={(e) => onInputChange('protein', e.target.value)}
                className="bg-white border-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20 text-slate-900 rounded-lg text-sm"
              />
            </div>
            <div>
              <Label className="text-xs text-slate-600">פחמימות</Label>
              <Input
                type="number"
                value={editForm?.carbs}
                onChange={(e) => onInputChange('carbs', e.target.value)}
                className="bg-white border-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20 text-slate-900 rounded-lg text-sm"
              />
            </div>
            <div>
              <Label className="text-xs text-slate-600">שומן</Label>
              <Input
                type="number"
                value={editForm?.fat}
                onChange={(e) => onInputChange('fat', e.target.value)}
                className="bg-white border-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20 text-slate-900 rounded-lg text-sm"
              />
            </div>
            <div>
              <Label className="text-xs text-slate-600">כמות</Label>
              <Input
                type="number"
                value={editForm?.quantity}
                onChange={(e) => onInputChange('quantity', e.target.value)}
                className="bg-white border-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20 text-slate-900 rounded-lg text-sm"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={onSaveEdit} className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs rounded-lg px-4">
              שמור
            </Button>
            <Button size="sm" variant="outline" onClick={onCancelEdit} className="bg-white border-slate-300 hover:bg-slate-50 hover:border-emerald-300 text-slate-700 text-xs rounded-lg px-4">
              ביטול
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex items-center justify-between p-3 bg-slate-50 backdrop-blur-sm rounded-lg border border-slate-200 hover:bg-white transition-all duration-200"
    >
      <div className="flex items-center gap-3 flex-1">
        <div className={`w-2 h-2 rounded-full ${getMealColor(entry.meal)}`} />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-slate-800 text-sm">{entry.name}</span>
            <Badge variant="secondary" className="text-xs bg-slate-200 text-slate-700 border-slate-300">
              {entry.calories} קלוריות
            </Badge>
          </div>
          <div className="text-xs text-slate-600">
            {entry.protein}גרם חלבון • {entry.carbs}גרם פחמימות • {entry.fat}גרם שומן
            {entry.quantity && entry.quantity > 1 && ` • ${entry.quantity} ${entry.unit}`}
          </div>
          {entry.note && (
            <div className="text-xs text-slate-500 mt-1">{entry.note}</div>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-500">{formatTime(entry.createdAt)}</span>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onEdit(entry)}
          className="h-6 w-6 p-0 text-slate-500 hover:text-emerald-600"
        >
          <Edit className="h-3 w-3" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onDelete(entry.id)}
          className="h-6 w-6 p-0 text-slate-500 hover:text-rose-500"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </motion.div>
  );
}
