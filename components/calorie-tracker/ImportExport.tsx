"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { FileText, Download, Upload, Info, AlertTriangle } from 'lucide-react';
import { TrackerState } from './types';


interface ImportExportProps {
  state: TrackerState;
  onImportData: (data: TrackerState) => void;
}

export const ImportExport = ({ state, onImportData }: ImportExportProps) => {
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [importMessage, setImportMessage] = useState('');

  const getStats = () => {
    const totalEntries = Object.values(state.entriesByDate).flat().length;
    const totalDays = Object.keys(state.entriesByDate).length;
    const totalPresets = state.presets.length;
    
    return { totalEntries, totalDays, totalPresets };
  };

  const handleExport = () => {
    try {
      const dataStr = JSON.stringify(state, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(dataBlob);
      link.download = `calorie-tracker-${new Date().toISOString().split('T')[0]}.json`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(link.href);
      
      setImportStatus('success');
      setImportMessage('הנתונים יוצאו בהצלחה!');
      
      setTimeout(() => {
        setImportStatus('idle');
        setImportMessage('');
      }, 3000);
    } catch {
      setImportStatus('error');
      setImportMessage('שגיאה בייצוא הנתונים');
      
      setTimeout(() => {
        setImportStatus('idle');
        setImportMessage('');
      }, 3000);
    }
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        
        if (confirm('האם ברצונך למזג את הנתונים עם הנתונים הקיימים או להחליף אותם?')) {
          onImportData(data);
          setImportStatus('success');
          setImportMessage('הנתונים יובאו בהצלחה!');
        } else {
          onImportData(data);
          setImportStatus('success');
          setImportMessage('הנתונים הוחלפו בהצלחה!');
        }
        
        setTimeout(() => {
          setImportStatus('idle');
          setImportMessage('');
        }, 3000);
      } catch {
        setImportStatus('error');
        setImportMessage('שגיאה בקריאת הקובץ');
        
        setTimeout(() => {
          setImportStatus('idle');
          setImportMessage('');
        }, 3000);
      }
    };
    reader.readAsText(file);
  };

  const stats = getStats();

  return (
    <Card className="w-full bg-white/80 backdrop-blur-sm border border-emerald-200 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl" dir="rtl">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl font-bold text-slate-800">
          <div className="bg-gradient-to-br from-emerald-100 to-cyan-100 rounded-lg p-2 border border-emerald-200">
            <FileText className="h-5 w-5 text-emerald-600" />
          </div>
          ייבוא/ייצוא נתונים
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Status Message */}
        {importStatus !== 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-3 rounded-lg flex items-center gap-2 ${
              importStatus === 'success' 
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' 
                : 'bg-rose-50 border border-rose-200 text-rose-700'
            }`}
          >
            {importStatus === 'success' ? (
              <Info className="h-4 w-4" />
            ) : (
              <AlertTriangle className="h-4 w-4" />
            )}
            <span className="text-sm">{importMessage}</span>
          </motion.div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg border border-emerald-200">
            <div className="text-xl font-bold text-emerald-700">{stats.totalEntries}</div>
            <div className="text-xs text-slate-600">סך הכל רשומות</div>
          </div>
          <div className="text-center p-3 bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-lg border border-cyan-200">
            <div className="text-xl font-bold text-cyan-700">{stats.totalDays}</div>
            <div className="text-xs text-slate-600">ימים עם רשומות</div>
          </div>
          <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
            <div className="text-xl font-bold text-purple-700">{stats.totalPresets}</div>
            <div className="text-xs text-slate-600">מועדפים</div>
          </div>
        </div>

        {/* Export Data */}
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-slate-700">ייצוא נתונים</h4>
          <p className="text-xs text-slate-600">
            ייצא את כל הנתונים שלך לקובץ JSON שניתן לשמור כגיבוי
          </p>
          <Button 
            onClick={handleExport}
            className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-medium shadow-md rounded-lg py-2 px-6 text-sm"
          >
            <Download className="h-4 w-4 ml-2" />
            ייצא נתונים
          </Button>
        </div>

        {/* Import Data */}
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-slate-700">ייבוא נתונים</h4>
          <p className="text-xs text-slate-600">
            ייבא נתונים מקובץ JSON. הנתונים החדשים יחליפו או ימזגו עם הנתונים הקיימים
          </p>
          <div className="relative">
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Button 
              variant="outline"
              className="bg-white border-slate-300 hover:bg-slate-50 hover:border-emerald-300 transition-all duration-300 text-slate-700 font-medium rounded-lg py-2 px-6 text-sm"
            >
              <Upload className="h-4 w-4 ml-2" />
              בחר קובץ לייבוא
            </Button>
          </div>
        </div>

        {/* Data Info */}
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
          <h4 className="text-xs font-medium text-slate-700 mb-2">מידע על הנתונים</h4>
          <ul className="text-xs text-slate-700 space-y-1">
            <li>• הנתונים נשמרים באופן מקומי בדפדפן שלך</li>
            <li>• ייצוא הנתונים מאפשר לך ליצור גיבוי</li>
            <li>• ייבוא הנתונים מאפשר לך לשחזר גיבוי או להעביר נתונים למכשיר אחר</li>
            <li>• פורמט הקובץ הוא JSON סטנדרטי</li>
          </ul>
        </div>

        {/* Backup Reminder */}
        <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5" />
            <div>
              <h4 className="text-xs font-medium text-amber-700">זכור לגבות</h4>
              <p className="text-xs text-slate-700 mt-1">
                מומלץ לייצא את הנתונים שלך באופן קבוע כדי למנוע אובדן מידע
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
