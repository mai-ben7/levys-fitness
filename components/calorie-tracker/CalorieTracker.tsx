"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { TrackerState, FoodEntry, DailyGoals } from './types';
import { loadState, saveState } from './storage';
import { copy } from './copy';
import GoalsCard from './GoalsCard';
import QuickAddCard from './QuickAddCard';
import { TodayProgress } from './TodayProgress';
import Journal from './Journal';
import { WeekOverview } from './WeekOverview';
// import { ImportExport } from './ImportExport';

// Utility functions
const toLocalYMD = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

const sumDayTotals = (entries: FoodEntry[]) =>
  entries.reduce(
    (acc, entry) => ({
      calories: acc.calories + entry.calories,
      protein: acc.protein + entry.protein,
      carbs: acc.carbs + entry.carbs,
      fat: acc.fat + entry.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

const getWeekData = (state: TrackerState, selectedDate: string) => {
  const weekData = [];
  const selectedDateObj = new Date(selectedDate);
  const startOfWeek = new Date(selectedDateObj);
  startOfWeek.setDate(selectedDateObj.getDate() - selectedDateObj.getDay());

  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    const dateStr = toLocalYMD(date);
    const entries = state.entriesByDate[dateStr] || [];
    const goals = state.goalsByDate[dateStr] || state.goalsByDate.default || {
      calories: 2000,
      protein: 150,
      carbs: 200,
      fat: 65,
    };
    const totals = sumDayTotals(entries);
    const goalHit = totals.calories >= goals.calories * 0.9;

    weekData.push({
      date: dateStr,
      calories: totals.calories,
      goalHit,
    });
  }

  return weekData;
};

const getStreakCount = (state: TrackerState, selectedDate: string) => {
  let streak = 0;

  const selectedDateObj = new Date(selectedDate);

  for (let i = 0; i < 30; i++) {
    const checkDate = new Date(selectedDateObj);
    checkDate.setDate(selectedDateObj.getDate() - i);
    const dateStr = toLocalYMD(checkDate);
    const entries = state.entriesByDate[dateStr] || [];
    const goals = state.goalsByDate[dateStr] || state.goalsByDate.default || {
      calories: 2000,
      protein: 150,
      carbs: 200,
      fat: 65,
    };
    const totals = sumDayTotals(entries);
    const goalHit = totals.calories >= goals.calories * 0.9;

    if (goalHit) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
};

// Animation Components
const RevealText = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay }}
  >
    {children}
  </motion.div>
);

const StaggerContainer = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial="hidden"
    animate="visible"
    variants={{
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1,
        },
      },
    }}
  >
    {children}
  </motion.div>
);

const StaggerItem = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
    }}
    transition={{ duration: 0.5 }}
  >
    {children}
  </motion.div>
);

export default function CalorieTracker() {
  const [state, setState] = useState<TrackerState>({
    version: 1,
    goalsByDate: {},
    entriesByDate: {},
    presets: [],
  });
  const [selectedDate, setSelectedDate] = useState(toLocalYMD(new Date()));
  const [dailyNotes, setDailyNotes] = useState('');
  const [isHydrated, setIsHydrated] = useState(false);


  // Load state on mount
  useEffect(() => {
    const savedState = loadState();
    setState(savedState);
    setIsHydrated(true);
  }, []);

  // Save state whenever it changes
  useEffect(() => {
    if (isHydrated) {
      saveState(state);
    }
  }, [state, isHydrated]);

  // Get current day's data
  const currentGoals = state.goalsByDate[selectedDate] || state.goalsByDate.default || {
    calories: 2000,
    protein: 150,
    carbs: 200,
    fat: 65,
  };
  const currentEntries = state.entriesByDate[selectedDate] || [];

  const weekData = getWeekData(state, selectedDate);
  const streakCount = getStreakCount(state, selectedDate);

  // Handlers
  const handleAddEntry = (entry: FoodEntry) => {
    const newState = {
      ...state,
      entriesByDate: {
        ...state.entriesByDate,
        [selectedDate]: [...currentEntries, entry],
      },
    };
    setState(newState);
    saveState(newState);
  };

  const handleEditEntry = (id: string, updatedEntry: FoodEntry) => {
    const newEntries = currentEntries.map(entry =>
      entry.id === id ? updatedEntry : entry
    );
    const newState = {
      ...state,
      entriesByDate: {
        ...state.entriesByDate,
        [selectedDate]: newEntries,
      },
    };
    setState(newState);
    saveState(newState);
  };

  const handleDeleteEntry = (id: string) => {
    const newEntries = currentEntries.filter(entry => entry.id !== id);
    const newState = {
      ...state,
      entriesByDate: {
        ...state.entriesByDate,
        [selectedDate]: newEntries,
      },
    };
    setState(newState);
    saveState(newState);
  };



  const handleUpdateGoals = (goals: DailyGoals) => {
    const newState = {
      ...state,
      goalsByDate: {
        ...state.goalsByDate,
        [selectedDate]: goals,
      },
    };
    setState(newState);
    saveState(newState);
  };

  const handleUpdateDailyNotes = (notes: string) => {
    setDailyNotes(notes);
  };

  const handlePrevDay = () => {
    const prevDate = new Date(selectedDate);
    prevDate.setDate(prevDate.getDate() - 1);
    setSelectedDate(toLocalYMD(prevDate));
  };

  const handleNextDay = () => {
    const nextDate = new Date(selectedDate);
    nextDate.setDate(nextDate.getDate() + 1);
    setSelectedDate(toLocalYMD(nextDate));
  };

  const handleToday = () => {
    setSelectedDate(toLocalYMD(new Date()));
  };

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-slate-600">טוען...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-50" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <RevealText>
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
              className="inline-block mb-4 -mt-8"
            >
              <div className="bg-gradient-to-br from-emerald-100 to-cyan-100 rounded-full p-4 shadow-lg border border-emerald-200">
                <div className="text-4xl">💪</div>
              </div>
            </motion.div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent mb-4">
              {copy.title}
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              עקוב אחר יעדי התזונה היומיים שלך ובנה הרגלים בריאים עם כלי מעקב מתקדם
            </p>
          </div>
        </RevealText>

        {/* Date Navigation */}
        <StaggerContainer>
          <StaggerItem>
            <Card className="w-full bg-white/80 backdrop-blur-sm border border-emerald-200 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrevDay}
                    className="bg-gradient-to-r from-emerald-500 to-cyan-500 border-emerald-500 hover:from-emerald-600 hover:to-cyan-600 hover:border-emerald-400 transition-all duration-300 text-white font-medium px-4 py-2 rounded-lg shadow-md"
                  >
                    <ChevronRight className="h-4 w-4 ml-1" />
                    יום קודם
                  </Button>
                  
                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleToday}
                      className="bg-white border border-slate-300 hover:bg-slate-50 hover:border-emerald-300 transition-all duration-300 text-slate-700 font-medium px-4 py-2 rounded-lg shadow-md"
                    >
                      היום
                    </Button>
                    
                    <div className="text-center">
                      <div className="flex items-center gap-2 bg-gradient-to-r from-emerald-50 to-cyan-50 px-4 py-2 rounded-lg border border-emerald-200 shadow-md">
                        <Calendar className="h-4 w-4 text-emerald-600" />
                        <span className="font-medium text-slate-800 text-sm">
                          {new Date(selectedDate).toLocaleDateString('he-IL', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextDay}
                    className="bg-gradient-to-r from-emerald-500 to-cyan-500 border-emerald-500 hover:from-emerald-600 hover:to-cyan-600 hover:border-emerald-400 transition-all duration-300 text-white font-medium px-4 py-2 rounded-lg shadow-md"
                  >
                    יום הבא
                    <ChevronLeft className="h-4 w-4 mr-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </StaggerItem>

          {/* Main Content - Improved Grid Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mt-6">
            {/* Left Column - Goals */}
            <div className="xl:col-span-3 space-y-6">
              <StaggerItem>
                <GoalsCard
                  goals={currentGoals}
                  onGoalsChange={handleUpdateGoals}
                  onUseForWeek={() => {
                    const currentGoals = state.goalsByDate[selectedDate] || state.goalsByDate['default'];
                    const newGoalsByDate = { ...state.goalsByDate };
                    
                    // Apply current goals to next 6 days
                    for (let i = 1; i <= 6; i++) {
                      const futureDate = new Date(selectedDate);
                      futureDate.setDate(futureDate.getDate() + i);
                      const futureDateStr = toLocalYMD(futureDate);
                      newGoalsByDate[futureDateStr] = currentGoals;
                    }

                    const newState = {
                      ...state,
                      goalsByDate: newGoalsByDate,
                    };
                    setState(newState);
                    saveState(newState);
                  }}
                />
              </StaggerItem>
            </div>

            {/* Center Column - Quick Add & Progress, then Journal & WeekOverview side by side */}
            <div className="xl:col-span-9 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <StaggerItem>
                  <QuickAddCard
                    presets={state.presets}
                    onAddFood={handleAddEntry}
                    onSavePreset={(preset: FoodEntry) => {
                      const newState = {
                        ...state,
                        presets: [...state.presets, preset],
                      };
                      setState(newState);
                      saveState(newState);
                    }}
                    selectedDate={selectedDate}
                  />
                </StaggerItem>
                
                <StaggerItem>
                  <TodayProgress
                    goals={currentGoals}
                    entries={currentEntries}
                    selectedDate={selectedDate}
                  />
                </StaggerItem>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <StaggerItem>
                  <Journal
                    entries={currentEntries}
                    onEditEntry={handleEditEntry}
                    onDeleteEntry={handleDeleteEntry}
                    dailyNotes={dailyNotes}
                    onUpdateDailyNotes={handleUpdateDailyNotes}
                  />
                </StaggerItem>
                
                <StaggerItem>
                  <WeekOverview
                    weekData={weekData}
                    streakCount={streakCount}
                  />
                </StaggerItem>
              </div>
            </div>
            
          </div>
        </StaggerContainer>
      </div>
    </div>
  );
}
