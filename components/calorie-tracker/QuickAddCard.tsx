"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Utensils, Clock, Star, Search, Edit3, Database } from 'lucide-react';
import { FoodEntry, MealType } from './types';
import { calcCalories } from './utils';
import { copy } from './copy';
import FoodSearch from './FoodSearch';

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

interface FoodDetails {
  id: string;
  name_he: string;
  category?: string;
  kcal?: number;
  protein_g?: number;
  carbs_g?: number;
  fat_g?: number;
  nutrients?: Record<string, any>;
  servings: {
    unit: string;
    grams: number;
  }[];
  perServing?: {
    kcal?: number;
    protein_g?: number;
    carbs_g?: number;
    fat_g?: number;
  };
}

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
  const [showFoodSearch, setShowFoodSearch] = useState(false);
  const [isManualMode, setIsManualMode] = useState(false);
  const [selectedFood, setSelectedFood] = useState<FoodDetails | null>(null);

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
    setSelectedFood(null);
    setIsManualMode(false);
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
    setSelectedFood(null);
    setIsManualMode(true);
  };

  const handleFoodSearchSelect = (food: FoodDetails) => {
    setSelectedFood(food);
    
    // Use the first serving's nutritional information or perServing data
    if (food.perServing) {
      setFormData({
        ...formData,
        name: food.name_he || 'מזון לא ידוע',
        protein: food.perServing.protein_g || 0,
        carbs: food.perServing.carbs_g || 0,
        fat: food.perServing.fat_g || 0,
        quantity: 1,
        unit: food.servings[0]?.unit || 'יחידה',
        note: food.category ? `מקור: ${food.category}` : 'מסד נתונים של משרד הבריאות',
      });
    } else if (food.servings.length > 0) {
      // Use the first serving's grams to calculate nutrition
      const firstServing = food.servings[0];
      const factor = firstServing.grams / 100; // Convert from per 100g to per serving
      
      setFormData({
        ...formData,
        name: food.name_he || 'מזון לא ידוע',
        protein: (food.protein_g || 0) * factor,
        carbs: (food.carbs_g || 0) * factor,
        fat: (food.fat_g || 0) * factor,
        quantity: 1,
        unit: firstServing.unit,
        note: food.category ? `מקור: ${food.category}` : 'מסד נתונים של משרד הבריאות',
      });
    } else {
      // Fallback: use per 100g data
      setFormData({
        ...formData,
        name: food.name_he || 'מזון לא ידוע',
        protein: food.protein_g || 0,
        carbs: food.carbs_g || 0,
        fat: food.fat_g || 0,
        quantity: 100,
        unit: 'גרם',
        note: food.category ? `מקור: ${food.category} (ל-100 גרם)` : 'מסד נתונים של משרד הבריאות (ל-100 גרם)',
      });
    }
    
    setShowFoodSearch(false);
  };

  const calculatedCalories = calcCalories({ 
    protein: formData.protein, 
    carbs: formData.carbs, 
    fat: formData.fat 
  });

  return (
    <>
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
          {/* Mode Toggle */}
          <div className="flex gap-2 p-2 bg-slate-50 rounded-lg">
            <Button
              type="button"
              variant={!isManualMode ? "default" : "outline"}
              onClick={() => setIsManualMode(false)}
              className={`flex items-center gap-2 text-sm ${
                !isManualMode
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md'
                  : 'bg-white border border-slate-300 hover:bg-slate-50 text-slate-700'
              } transition-all duration-300 rounded-lg py-2`}
            >
              <Database className="h-4 w-4" />
              חיפוש במסד נתונים
            </Button>
            <Button
              type="button"
              variant={isManualMode ? "default" : "outline"}
              onClick={() => setIsManualMode(true)}
              className={`flex items-center gap-2 text-sm ${
                isManualMode
                  ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-md'
                  : 'bg-white border border-slate-300 hover:bg-slate-50 text-slate-700'
              } transition-all duration-300 rounded-lg py-2`}
            >
              <Edit3 className="h-4 w-4" />
              הזנה ידנית
            </Button>
          </div>

          {!isManualMode ? (
            // Database Search Mode
            <div className="space-y-4">
              {!selectedFood ? (
                // Show search interface
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center gap-3 mb-3">
                      <Database className="h-6 w-6 text-blue-500" />
                      <h3 className="text-lg font-semibold text-slate-800">חיפוש במסד הנתונים של משרד הבריאות</h3>
                    </div>
                    <p className="text-slate-600 text-sm mb-4">הקלד שם מזון למציאת מידע תזונתי מדויק</p>
                    
                    {/* Search Bar */}
                    <div className="flex gap-2">
                      <Input
                        placeholder="הקלד שם מזון... (למשל: חלב, יוגורט, תפוח)"
                        className="flex-1 bg-white border-blue-300 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg text-sm text-slate-900"
                        onFocus={() => setShowFoodSearch(true)}
                        readOnly
                      />
                      <Button
                        onClick={() => setShowFoodSearch(true)}
                        className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-4 py-2 rounded-lg shadow-md transition-all duration-300"
                      >
                        <Search className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                // Show selected food details
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-slate-800">{selectedFood.name_he}</h4>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedFood(null)}
                        className="text-xs"
                      >
                        שנה מזון
                      </Button>
                    </div>
                    <div className="text-sm text-slate-600">
                      {selectedFood.category && <span className="mr-2">קטגוריה: {selectedFood.category}</span>}
                      <span>מקור: משרד הבריאות</span>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Quantity and Unit */}
                    <div className="grid grid-cols-2 gap-3">
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
                      <div className="space-y-2">
                        <Label className="text-slate-700 font-medium text-sm">יחידה</Label>
                        <Input
                          value={formData.unit}
                          onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                          className="bg-white border-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-lg text-sm text-slate-900"
                        />
                      </div>
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
                </div>
              )}
            </div>
          ) : (
            // Manual Entry Mode
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
          )}

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

      {/* Food Search Modal */}
      <AnimatePresence>
        {showFoodSearch && (
          <FoodSearch
            onSelectFood={handleFoodSearchSelect}
            onClose={() => setShowFoodSearch(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
