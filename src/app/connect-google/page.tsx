"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, CheckCircle, ExternalLink, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function ConnectGoogle() {
  const [authUrl, setAuthUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Check if we're returning from OAuth callback
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');

    if (code) {
      // We have a code, complete the OAuth flow
      completeOAuth(code);
    } else if (error) {
      setError('Authentication failed: ' + error);
      setLoading(false);
    } else {
      // Get the auth URL
      getAuthUrl();
    }
  }, []);

  const getAuthUrl = async () => {
    try {
      const response = await fetch('/api/google/oauth/start');
      const data = await response.json();
      
      if (response.ok) {
        setAuthUrl(data.authUrl);
      } else {
        setError(data.error || 'Failed to get authentication URL');
      }
    } catch (error) {
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const completeOAuth = async (code: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/google/oauth/callback?code=${code}`);
      const data = await response.json();
      
      if (response.ok) {
        setIsConnected(true);
      } else {
        setError(data.error || 'Failed to complete authentication');
      }
    } catch (error) {
      setError('Failed to complete authentication');
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = () => {
    if (authUrl) {
      window.location.href = authUrl;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <Loader2 className="h-8 w-8 text-white" />
            </motion.div>
            <h2 className="text-2xl font-bold mb-2">מתחבר לגוגל...</h2>
            <p className="text-gray-600">אנא המתן בזמן שאנו מתחברים לחשבון הגוגל שלך</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <CheckCircle className="h-8 w-8 text-white" />
            </motion.div>
            <h2 className="text-2xl font-bold text-green-800 mb-2">החיבור הושלם בהצלחה!</h2>
            <p className="text-gray-600 mb-6">חשבון הגוגל שלך מחובר כעת למערכת הזמנות</p>
            <Button 
              onClick={() => window.location.href = '/'}
              className="bg-green-600 hover:bg-green-700"
            >
              חזור לאתר הראשי
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <span className="text-2xl">❌</span>
            </motion.div>
            <h2 className="text-2xl font-bold text-red-800 mb-2">שגיאה בחיבור</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="space-y-2">
              <Button 
                onClick={() => window.location.reload()}
                className="bg-red-600 hover:bg-red-700"
              >
                נסה שוב
              </Button>
              <Button 
                onClick={() => window.location.href = '/'}
                variant="outline"
                className="w-full"
              >
                חזור לאתר הראשי
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          <motion.div
            className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4"
            whileHover={{ scale: 1.1, rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <Calendar className="h-8 w-8 text-white" />
          </motion.div>
          <h2 className="text-2xl font-bold mb-2">חבר את גוגל קלנדר</h2>
          <p className="text-gray-600 mb-6">
            כדי לאפשר הזמנות אוטומטיות, עליך לחבר את חשבון הגוגל שלך למערכת
          </p>
          
          <div className="space-y-4">
            <Button 
              onClick={handleConnect}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              size="lg"
            >
              <ExternalLink className="h-5 w-5 ml-2" />
              התחבר עם גוגל
            </Button>
            
            <Button 
              onClick={() => window.location.href = '/'}
              variant="outline"
              className="w-full"
            >
              חזור לאתר הראשי
            </Button>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg text-right">
            <h4 className="font-semibold text-blue-800 mb-2">מה יקרה אחרי החיבור?</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• תוכל לקבוע זמני זמינות בגוגל קלנדר</li>
              <li>• לקוחות יוכלו להזמין פגישות אוטומטית</li>
              <li>• פגישות ייווצרו עם קישורי Google Meet</li>
              <li>• תקבל התראות אימייל על הזמנות חדשות</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
