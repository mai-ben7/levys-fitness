"use client";

import { useState } from 'react';

export default function DebugAvailability() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testAvailability = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/availability?service=session60&date=2025-08-30');
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
      <h1 className="text-2xl font-bold mb-4">בדיקת זמינות</h1>
      <button 
        onClick={testAvailability}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? 'בודק...' : 'בדוק זמינות'}
      </button>
      
      {result && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">תוצאות:</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
