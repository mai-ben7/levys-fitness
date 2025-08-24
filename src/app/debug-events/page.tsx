"use client";

import { useState } from 'react';

export default function DebugEvents() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const listEvents = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/list-events');
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8" dir="rtl">
      <h1 className="text-2xl font-bold mb-4">בדיקת כל האירועים</h1>
      <button 
        onClick={listEvents}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? 'בודק...' : 'רשום כל האירועים'}
      </button>
      
      {result && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">תוצאות:</h2>
          <div className="bg-gray-100 p-4 rounded">
            <p><strong>תאריך:</strong> {result.date}</p>
            <p><strong>סה"כ אירועים:</strong> {result.totalEvents}</p>
            
            {result.events && result.events.length > 0 && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">פירוט האירועים:</h3>
                {result.events.map((event: any, index: number) => (
                  <div key={index} className="border-b border-gray-300 pb-2 mb-2">
                    <p><strong>כותרת:</strong> {event.title}</p>
                    <p><strong>התחלה:</strong> {event.start}</p>
                    <p><strong>סיום:</strong> {event.end}</p>
                    <p><strong>תיאור:</strong> {event.description || 'אין תיאור'}</p>
                    <p><strong>צבע:</strong> {event.color || 'ברירת מחדל'}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
