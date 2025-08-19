"use client";

import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Target, CheckCircle } from 'lucide-react';
import { DailyGoals, FoodEntry } from './types';
import { withinTolerance } from './utils';

interface TodayProgressProps {
  goals: DailyGoals;
  entries: FoodEntry[];
  selectedDate: string;
}

interface DayTotals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export const TodayProgress = ({ goals, entries, selectedDate }: TodayProgressProps) => {
  const totals: DayTotals = entries.reduce(
    (acc, entry) => ({
      calories: acc.calories + entry.calories,
      protein: acc.protein + entry.protein,
      carbs: acc.carbs + entry.carbs,
      fat: acc.fat + entry.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const remaining = {
    calories: Math.max(0, goals.calories - totals.calories),
    protein: Math.max(0, goals.protein - totals.protein),
    carbs: Math.max(0, goals.carbs - totals.carbs),
    fat: Math.max(0, goals.fat - totals.fat),
  };

  const progress = {
    calories: Math.min(100, (totals.calories / goals.calories) * 100),
    protein: Math.min(100, (totals.protein / goals.protein) * 100),
    carbs: Math.min(100, (totals.carbs / goals.carbs) * 100),
    fat: Math.min(100, (totals.fat / goals.fat) * 100),
  };

  const macroData = [
    { name: 'חלבון', value: totals.protein, goal: goals.protein, color: '#0EA5E9' },
    { name: 'פחמימות', value: totals.carbs, goal: goals.carbs, color: '#10B981' },
    { name: 'שומן', value: totals.fat, goal: goals.fat, color: '#F59E0B' },
  ];

  const isOnTrack = withinTolerance(totals.calories, goals.calories, 0.1);

  return (
    <Card className="w-full bg-white/80 backdrop-blur-sm border border-emerald-200 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl" dir="rtl">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl font-bold text-slate-800">
          <div className="bg-gradient-to-br from-emerald-100 to-cyan-100 rounded-lg p-2 border border-emerald-200">
            <Target className="h-5 w-5 text-emerald-600" />
          </div>
          התקדמות יומית
        </CardTitle>
        <p className="text-slate-600 text-sm">
          {new Date(selectedDate).toLocaleDateString('he-IL', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Calorie Progress */}
        <div className="text-center">
          <div className="relative inline-block">
            <div className="w-32 h-32 relative">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#E2E8F0"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke={progress.calories >= 100 ? '#EF4444' : '#0EA5E9'}
                  strokeWidth="3"
                  strokeDasharray={`${progress.calories}, 100`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold text-slate-900">
                    {Math.round(totals.calories)}
                  </div>
                  <div className="text-xs text-slate-600 font-medium">קלוריות</div>
                </div>
              </div>
            </div>
            <div className="absolute -top-2 -right-2">
              {isOnTrack && (
                <Badge className="bg-emerald-500/90 text-white border-emerald-400 shadow-md px-2 py-1 rounded-full text-xs">
                  <CheckCircle className="h-3 w-3 ml-1" />
                  על המסלול
                </Badge>
              )}
            </div>
          </div>
          <div className="mt-4 space-y-1">
            <div className="text-sm text-slate-700 font-medium">
              יעד: {goals.calories} קלוריות
            </div>
            <div className="text-sm text-slate-700 font-medium">
              נותר: {remaining.calories} קלוריות
            </div>
          </div>
        </div>

        {/* Macro Breakdown */}
        <div>
          <h4 className="text-sm font-medium text-slate-800 mb-3">פירוט מאקרו-נוטריאנטים</h4>
          <div className="space-y-3">
            {macroData.map((macro) => (
              <div key={macro.name} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-700">{macro.name}</span>
                  <span className="text-sm text-slate-600 font-medium">
                    {macro.value} / {macro.goal} גרם
                  </span>
                </div>
                <Progress
                  value={Math.min(100, (macro.value / macro.goal) * 100)}
                  className="h-2 bg-slate-200 rounded-full"
                />
                <div className="flex justify-between text-xs text-slate-500">
                  <span>0</span>
                  <span>{macro.goal} גרם</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Remaining Counters */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg border border-emerald-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-700">{remaining.protein}</div>
              <div className="text-xs text-slate-600 font-medium">גרם חלבון נותר</div>
            </div>
          </div>
          <div className="p-4 bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-lg border border-cyan-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-700">{remaining.carbs}</div>
              <div className="text-xs text-slate-600 font-medium">גרם פחמימות נותר</div>
            </div>
          </div>
          <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-700">{remaining.fat}</div>
              <div className="text-xs text-slate-600 font-medium">גרם שומן נותר</div>
            </div>
          </div>
          <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-700">{remaining.calories}</div>
              <div className="text-xs text-slate-600 font-medium">קלוריות נותרות</div>
            </div>
          </div>
        </div>

        {/* Progress Summary */}
        <div className="p-4 bg-gradient-to-br from-white to-slate-50 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-800">התקדמות כללית</span>
            <span className="text-sm font-bold text-emerald-700">{Math.round(progress.calories)}%</span>
          </div>
          <Progress
            value={progress.calories}
            className="h-2 bg-slate-200 rounded-full"
          />
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>0 קלוריות</span>
            <span>{goals.calories} קלוריות</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
