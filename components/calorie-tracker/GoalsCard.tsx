"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Target } from 'lucide-react';
import { DailyGoals } from './types';
import { copy } from './copy';

interface GoalsCardProps {
  goals: DailyGoals;
  onGoalsChange: (goals: DailyGoals) => void;
  onUseForWeek: () => void;
}

const presetGoals = {
  cut: { calories: 1800, protein: 150, carbs: 150, fat: 60 },
  maintain: { calories: 2200, protein: 150, carbs: 250, fat: 75 },
  bulk: { calories: 2800, protein: 180, carbs: 300, fat: 90 },
};

export default function GoalsCard({ goals, onGoalsChange, onUseForWeek }: GoalsCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempGoals, setTempGoals] = useState<DailyGoals>(goals);
  const [selectedPreset, setSelectedPreset] = useState<keyof typeof presetGoals | null>(null);

  const handleInputChange = (field: keyof DailyGoals, value: string) => {
    const numValue = parseInt(value) || 0;
    setTempGoals(prev => ({
      ...prev,
      [field]: numValue,
    }));
  };

  const handleSave = () => {
    onGoalsChange(tempGoals);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempGoals(goals);
    setIsEditing(false);
  };

  const handlePreset = (presetName: keyof typeof presetGoals) => {
    const preset = presetGoals[presetName];
    setTempGoals(preset);
    onGoalsChange(preset);
    setIsEditing(false);
    setSelectedPreset(presetName);
  };

  // Keep selected preset in sync with external goals
  useEffect(() => {
    const match = (a: DailyGoals, b: DailyGoals) =>
      a.calories === b.calories && a.protein === b.protein && a.carbs === b.carbs && a.fat === b.fat;
    const found = (Object.keys(presetGoals) as Array<keyof typeof presetGoals>).find((k) =>
      match(goals, presetGoals[k])
    ) || null;
    setSelectedPreset(found);
  }, [goals]);

  return (
    <Card className="w-full bg-white/80 backdrop-blur-sm border border-emerald-200 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl" dir="rtl">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl font-bold text-slate-800">
          <div className="bg-gradient-to-br from-emerald-100 to-cyan-100 rounded-lg p-2 border border-emerald-200">
            <Target className="h-5 w-5 text-emerald-600" />
          </div>
          יעדים יומיים
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {isEditing ? (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-slate-700 font-medium text-sm">קלוריות</Label>
                <Input
                  type="number"
                  value={tempGoals.calories}
                  onChange={(e) => handleInputChange('calories', e.target.value)}
                  className="bg-white border-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20 text-slate-900 rounded-lg text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-700 font-medium text-sm">חלבון (גרם)</Label>
                <Input
                  type="number"
                  value={tempGoals.protein}
                  onChange={(e) => handleInputChange('protein', e.target.value)}
                  className="bg-white border-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20 text-slate-900 rounded-lg text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-700 font-medium text-sm">פחמימות (גרם)</Label>
                <Input
                  type="number"
                  value={tempGoals.carbs}
                  onChange={(e) => handleInputChange('carbs', e.target.value)}
                  className="bg-white border-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20 text-slate-900 rounded-lg text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-700 font-medium text-sm">שומן (גרם)</Label>
                <Input
                  type="number"
                  value={tempGoals.fat}
                  onChange={(e) => handleInputChange('fat', e.target.value)}
                  className="bg-white border-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20 text-slate-900 rounded-lg text-sm"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={handleSave}
                className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-medium rounded-lg py-2 px-6 text-sm shadow-md"
              >
                שמור יעדים
              </Button>
              <Button
                variant="outline"
                onClick={handleCancel}
                className="bg-white border-slate-300 hover:bg-slate-50 hover:border-emerald-300 transition-all duration-300 text-slate-700 rounded-lg py-2 px-6 text-sm"
              >
                ביטול
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Preset selection - as checkboxes on top */}
            <div className="flex items-center gap-4">
              {(Object.keys(presetGoals) as Array<keyof typeof presetGoals>).map((name) => (
                <label key={name} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedPreset === name}
                    onChange={(e) => {
                      if (e.target.checked) {
                        handlePreset(name);
                      } else {
                        setSelectedPreset(null);
                      }
                    }}
                    className="h-4 w-4 accent-emerald-600 rounded"
                  />
                  {copy.presets[name as keyof typeof copy.presets]}
                </label>
              ))}
            </div>
            {/* Goal Display */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg border border-emerald-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-700">{goals.calories}</div>
                  <div className="text-xs text-slate-600 font-medium">קלוריות</div>
                </div>
              </div>
              <div className="p-4 bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-lg border border-cyan-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-cyan-700">{goals.protein}</div>
                  <div className="text-xs text-slate-600 font-medium">גרם חלבון</div>
                </div>
              </div>
              <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-700">{goals.carbs}</div>
                  <div className="text-xs text-slate-600 font-medium">גרם פחמימות</div>
                </div>
              </div>
              <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-700">{goals.fat}</div>
                  <div className="text-xs text-slate-600 font-medium">גרם שומן</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                onClick={() => setIsEditing(true)}
                className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium rounded-lg py-2 px-6 text-sm shadow-md"
              >
                ערוך יעדים
              </Button>
              <Button
                onClick={onUseForWeek}
                className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-medium rounded-lg py-2 px-6 text-sm shadow-md"
              >
                השתמש לשבוע
              </Button>
            </div>

            {/* Removed preset buttons (replaced by checkboxes above) */}
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
