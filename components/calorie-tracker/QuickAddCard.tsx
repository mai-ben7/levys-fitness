"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Utensils, Clock, Star } from 'lucide-react';
import { FoodEntry, MealType } from './types';
import { calcCalories } from './utils';
import { copy } from './copy';

interface QuickAddCardProps {
  presets: FoodEntry[];
  onAddFood: (entry: FoodEntry) => void;
  onSavePreset: (preset: FoodEntry) => void;
  selectedDate: string;
}

const mealTypes: { value: MealType; label: string; icon: React.ReactNode }[] = [
  { value: 'breakfast', label: copy.meals.breakfast, icon: <Clock className="h-4 w-4" /> },
  { value: 'lunch', label: copy.meals.lunch, icon: <Utensils className="h-4 w-4" /> },
  { value: 'dinner', label: copy.meals.dinner, icon: <Utensils className="h-4 w-4" /> },
  { value: 'snack', label: copy.meals.snack, icon: <Star className="h-4 w-4" /> },
];

export default function QuickAddCard({ presets, onAddFood, onSavePreset, selectedDate }: QuickAddCardProps) {
  const [formData, setFormData] = useState<Omit<FoodEntry, 'id' | 'dateISO' | 'calories' | 'createdAt' | 'updatedAt'>>({
    meal: 'breakfast',
    name: '',
    protein: 0,
    carbs: 0,
    fat: 0,
    quantity: 1,
    unit: 'יחידה',
    note: '',
  });



  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const calories = calcCalories({ 
      protein: formData.protein, 
      carbs: formData.carbs, 
      fat: formData.fat 
    });
    
    const newEntry: FoodEntry = {
      id: crypto.randomUUID(),
      dateISO: selectedDate,
      meal: formData.meal,
      name: formData.name,
      calories: Math.round(calories),
      protein: formData.protein,
      carbs: formData.carbs,
      fat: formData.fat,
      quantity: formData.quantity,
      unit: formData.unit,
      note: formData.note || '',
      createdAt: Date.now(),
    };
    
    onAddFood(newEntry);
    
    // Reset form
    setFormData({
      meal: 'breakfast',
      name: '',
      protein: 0,
      carbs: 0,
      fat: 0,
      quantity: 1,
      unit: 'יחידה',
      note: '',
    });
  };

  const handleSaveAsPreset = () => {
    const calories = calcCalories({ 
      protein: formData.protein, 
      carbs: formData.carbs, 
      fat: formData.fat 
    });
    
    const preset: FoodEntry = {
      id: crypto.randomUUID(),
      dateISO: selectedDate,
      meal: formData.meal,
      name: formData.name,
      calories: Math.round(calories),
      protein: formData.protein,
      carbs: formData.carbs,
      fat: formData.fat,
      quantity: formData.quantity,
      unit: formData.unit,
      note: formData.note || '',
      createdAt: Date.now(),
    };
    
    onSavePreset(preset);
  };

  const handlePresetClick = (preset: FoodEntry) => {
    setFormData({
      meal: preset.meal,
      name: preset.name,
      protein: preset.protein,
      carbs: preset.carbs,
      fat: preset.fat,
      quantity: preset.quantity || 1,
      unit: preset.unit || 'יחידה',
      note: preset.note || '',
    });
  };

  const calculatedCalories = calcCalories({ 
    protein: formData.protein, 
    carbs: formData.carbs, 
    fat: formData.fat 
  });

  return (
    <Card className="w-full bg-white/80 backdrop-blur-sm border border-emerald-200 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl" dir="rtl">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl font-bold text-slate-800">
          <div className="bg-gradient-to-br from-emerald-100 to-cyan-100 rounded-lg p-2 border border-emerald-200">
            <Utensils className="h-5 w-5 text-emerald-600" />
          </div>
          הוסף מזון מהיר
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Food Name */}
          <div className="space-y-2">
            <Label className="text-slate-700 font-medium text-sm">שם המזון</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="הכנס שם המזון..."
              className="bg-white border-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-lg text-sm text-slate-900"
              required
            />
          </div>

          {/* Macros */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label className="text-slate-700 font-medium text-sm">חלבון (גרם)</Label>
              <Input
                type="number"
                value={formData.protein}
                onChange={(e) => setFormData({ ...formData, protein: Number(e.target.value) || 0 })}
                className="bg-white border-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-lg text-sm text-slate-900"
                min="0"
                step="0.1"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-700 font-medium text-sm">פחמימות (גרם)</Label>
              <Input
                type="number"
                value={formData.carbs}
                onChange={(e) => setFormData({ ...formData, carbs: Number(e.target.value) || 0 })}
                className="bg-white border-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-lg text-sm text-slate-900"
                min="0"
                step="0.1"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-700 font-medium text-sm">שומן (גרם)</Label>
              <Input
                type="number"
                value={formData.fat}
                onChange={(e) => setFormData({ ...formData, fat: Number(e.target.value) || 0 })}
                className="bg-white border-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-lg text-sm text-slate-900"
                min="0"
                step="0.1"
              />
            </div>
          </div>

          {/* Quantity */}
          <div className="space-y-2">
            <Label className="text-slate-700 font-medium text-sm">כמות</Label>
            <Input
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) || 1 })}
              className="bg-white border-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-lg text-sm text-slate-900"
              min="0.1"
              step="0.1"
            />
          </div>

          {/* Meal Type */}
          <div className="space-y-2">
            <Label className="text-slate-700 font-medium text-sm">סוג ארוחה</Label>
            <div className="grid grid-cols-2 gap-2">
              {mealTypes.map((meal) => (
                <Button
                  key={meal.value}
                  type="button"
                  variant={formData.meal === meal.value ? "default" : "outline"}
                  onClick={() => setFormData({ ...formData, meal: meal.value })}
                  className={`flex items-center gap-2 text-sm ${
                    formData.meal === meal.value
                      ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-md'
                      : 'bg-white border border-slate-300 hover:bg-slate-50 hover:border-emerald-300 text-slate-700'
                  } transition-all duration-300 rounded-lg py-2`}
                >
                  {meal.icon}
                  {meal.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label className="text-slate-700 font-medium text-sm">הערות</Label>
            <Textarea
              value={formData.note || ''}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              placeholder="הוסף הערות על המזון..."
              className="bg-white border-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-lg resize-none text-sm text-slate-900"
              rows={2}
            />
          </div>

          {/* Calculated Calories */}
          <div className="p-3 bg-gradient-to-br from-emerald-50 to-cyan-50 rounded-lg border border-emerald-200">
            <div className="text-center">
              <div className="text-xl font-bold text-emerald-700">
                {Math.round(calculatedCalories)} קלוריות
              </div>
              <div className="text-xs text-slate-600">סך הכל קלוריות</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              type="submit"
              className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-medium rounded-lg py-2 px-6 text-sm shadow-md"
            >
              הוסף מזון
            </Button>
            <Button
              type="button"
              onClick={handleSaveAsPreset}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-medium rounded-lg py-2 px-6 text-sm shadow-md"
            >
              שמור כמועדף
            </Button>
          </div>
        </form>

        {/* Presets */}
        {presets.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-slate-800">מועדפים</h4>
            <div className="grid grid-cols-1 gap-2">
              {presets.map((preset) => (
                <motion.button
                  key={preset.id}
                  onClick={() => handlePresetClick(preset)}
                  className="w-full p-3 bg-gradient-to-r from-slate-50 to-slate-100 hover:from-white hover:to-slate-50 border border-slate-200 rounded-lg transition-all duration-300 text-right shadow-sm"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <div className="font-medium text-slate-800 text-sm">{preset.name}</div>
                      <div className="text-xs text-slate-600">
                        {preset.protein}ג חלבון • {preset.carbs}ג פחמימות • {preset.fat}ג שומן
                      </div>
                    </div>
                    <div className="text-sm font-bold text-emerald-600">
                      {Math.round(calcCalories({ protein: preset.protein, carbs: preset.carbs, fat: preset.fat }))} קלוריות
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
