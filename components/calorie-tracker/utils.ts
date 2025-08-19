import { FoodEntry, DayTotals, WeekData, DailyGoals } from './types';

export const toLocalYMD = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const calcCalories = ({ protein, carbs, fat }: { protein: number; carbs: number; fat: number }): number => {
  return Math.round(protein * 4 + carbs * 4 + fat * 9);
};

export const sumDayTotals = (entries: FoodEntry[]): DayTotals => {
  return entries.reduce(
    (totals, entry) => ({
      calories: totals.calories + entry.calories,
      protein: totals.protein + entry.protein,
      carbs: totals.carbs + entry.carbs,
      fat: totals.fat + entry.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );
};

export const withinTolerance = (value: number, goal: number, percent: number = 5): boolean => {
  const tolerance = (goal * percent) / 100;
  return Math.abs(value - goal) <= tolerance;
};

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const getWeekData = (entriesByDate: Record<string, FoodEntry[]>, goalsByDate: Record<string, DailyGoals>): WeekData[] => {
  const today = new Date();
  const weekData: WeekData[] = [];
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = toLocalYMD(date);
    
    const entries = entriesByDate[dateStr] || [];
    const totals = sumDayTotals(entries);
    const goals = goalsByDate[dateStr] || goalsByDate['default'] || { calories: 2000, protein: 150, carbs: 200, fat: 65 };
    
    weekData.push({
      date: dateStr,
      calories: totals.calories,
      goal: goals.calories,
      goalHit: withinTolerance(totals.calories, goals.calories, 5),
    });
  }
  
  return weekData;
};

export const getStreakCount = (weekData: WeekData[]): number => {
  let streak = 0;
  for (let i = weekData.length - 1; i >= 0; i--) {
    if (weekData[i].goalHit) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
};

export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

export const formatNumber = (num: number): string => {
  return Math.round(num).toString();
};

export const getMealColor = (meal: string): string => {
  const colors = {
    breakfast: 'bg-orange-500',
    lunch: 'bg-blue-500',
    dinner: 'bg-purple-500',
    snack: 'bg-green-500',
  };
  return colors[meal as keyof typeof colors] || 'bg-gray-500';
};

export const getMealIcon = (meal: string): string => {
  const icons = {
    breakfast: '🌅',
    lunch: '☀️',
    dinner: '🌙',
    snack: '🍎',
  };
  return icons[meal as keyof typeof icons] || '🍽️';
};

