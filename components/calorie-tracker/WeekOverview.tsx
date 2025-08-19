"use client";

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, Award } from 'lucide-react';

interface WeekData {
  date: string;
  calories: number;
  goalHit: boolean;
}

interface WeekOverviewProps {
  weekData: WeekData[];
  streakCount: number;
}



export const WeekOverview = ({ weekData, streakCount }: WeekOverviewProps) => {
  const formatDay = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('he-IL', { 
      weekday: 'short', 
      month: 'short' 
    });
  };

  const chartData = weekData.map(day => ({
    name: formatDay(day.date),
    calories: day.calories,
    goalHit: day.goalHit,
  }));

  const averageCalories = weekData.reduce((sum, day) => sum + day.calories, 0) / weekData.length;
  const goalHitDays = weekData.filter(day => day.goalHit).length;

  return (
    <Card className="w-full bg-white/80 backdrop-blur-sm border border-emerald-200 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl" dir="rtl">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl font-bold text-slate-800">
          <div className="bg-gradient-to-br from-emerald-100 to-cyan-100 rounded-lg p-2 border border-emerald-200">
            <Calendar className="h-5 w-5 text-emerald-600" />
          </div>
          סקירה שבועית
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg border border-emerald-200">
            <div className="text-xl font-bold text-emerald-700">{Math.round(averageCalories)}</div>
            <div className="text-xs text-slate-600">ממוצע יומי</div>
          </div>
          <div className="text-center p-3 bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-lg border border-cyan-200">
            <div className="text-xl font-bold text-cyan-700">{goalHitDays}</div>
            <div className="text-xs text-slate-600">ימים שהשיגו יעד</div>
          </div>
          <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Badge className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white flex items-center gap-1 shadow-md text-xs">
                <Award className="h-3 w-3" />
                {streakCount} ימים ברצף! 🔥
              </Badge>
            </motion.div>
          </div>
        </div>

        {/* Chart */}
        <div className="space-y-3">
          <h4 className="text-xs font-medium text-slate-700">גרף קלוריות שבועי</h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#64748B', fontSize: 10 }}
                  axisLine={{ stroke: '#E2E8F0' }}
                />
                <YAxis 
                  tick={{ fill: '#64748B', fontSize: 10 }}
                  axisLine={{ stroke: '#E2E8F0' }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.08)',
                    color: '#0F172A',
                  }}
                  formatter={(value: number) => [`${value} קלוריות`, 'קלוריות']}
                  labelFormatter={(label) => `${label}`}
                />
                <Bar 
                  dataKey="calories" 
                  fill="#0EA5E9"
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily Breakdown */}
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-slate-700">פירוט יומי</h4>
          <div className="space-y-2">
            {weekData.map((day, index) => (
              <motion.div
                key={day.date}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center justify-between p-2 rounded-lg border transition-all duration-200 ${
                  day.goalHit 
                    ? 'bg-emerald-50 border-emerald-200' 
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    day.goalHit ? 'bg-emerald-500' : 'bg-slate-400'
                  }`} />
                  <span className="text-xs font-medium text-slate-800">
                    {formatDay(day.date)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-700">
                    {day.calories} קלוריות
                  </span>
                  {day.goalHit && (
                    <Badge className="bg-emerald-500/90 text-white border-emerald-400 text-xs">
                      יעד הושג
                    </Badge>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Weekly Summary */}
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
          <h4 className="text-xs font-medium text-slate-700 mb-2">סיכום שבועי</h4>
          <p className="text-xs text-slate-700">
            השבוע צרכת {Math.round(averageCalories)} קלוריות בממוצע ליום. 
            {goalHitDays > 0 && ` השגת את היעד ב-${goalHitDays} ימים.`}
            {streakCount > 0 && ` יש לך רצף של ${streakCount} ימים!`}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
