"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Phone, Mail, MessageSquare, CheckCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ContactFormData {
  name: string;
  phone: string;
  email: string;
  message: string;
  consent: boolean;
}

export default function ContactOnlyCard() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    phone: '',
    email: '',
    message: '',
    consent: false
  });

  const [errors, setErrors] = useState<Partial<ContactFormData>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<ContactFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'שם מלא הוא שדה חובה';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'מספר טלפון הוא שדה חובה';
    } else if (!/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'אנא הכנס/י מספר טלפון תקין';
    }

    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'אנא הכנס/י אימייל תקין';
    }

    if (!formData.consent) {
      newErrors.consent = 'אנא אשר/י יצירת קשר';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email || undefined,
          message: formData.message || undefined,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        // Reset form
        setFormData({
          name: '',
          phone: '',
          email: '',
          message: '',
          consent: false
        });
      } else {
        setErrors({ message: data.error || 'שגיאה בשליחת הפרטים' });
      }
    } catch (error) {
      setErrors({ message: 'שגיאה בשליחת הפרטים' });
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (field: keyof ContactFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="h-full"
      >
        <Card className="border-2 border-blue-200 bg-blue-50 h-full">
          <CardContent className="p-6 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <CheckCircle className="h-8 w-8 text-white" />
            </motion.div>
            
            <h3 className="text-xl font-bold text-blue-800 mb-4">הפרטים נשלחו!</h3>
            <p className="text-blue-700 mb-6">נחזור אליך בהקדם</p>
            
            <Button 
              onClick={() => setSuccess(false)}
              className="w-full bg-blue-600 hover:bg-blue-700"
              suppressHydrationWarning
            >
              שלח הודעה נוספת
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <Card className="h-full border-2 border-gray-200">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-xl font-bold text-gray-900">שלחו פרטים בלבד</CardTitle>
        <p className="text-gray-600 text-sm">נחזור אליך בהקדם האפשרי</p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Honeypot field */}
          <input
            type="text"
            name="website"
            style={{ display: 'none' }}
            tabIndex={-1}
            autoComplete="off"
          />

          <div>
            <label htmlFor="contact-name" className="block text-sm font-medium text-gray-700 text-right mb-2">
              <User className="h-4 w-4 inline ml-2" />
              שם מלא *
            </label>
            <Input
              id="contact-name"
              type="text"
              placeholder="הכנס/י את שמך המלא"
              value={formData.name}
              onChange={(e) => handleFormChange('name', e.target.value)}
              className={`border-2 text-right ${errors.name ? 'border-red-300' : 'border-gray-200'} focus:border-primary focus:ring-2 focus:ring-primary/20`}
              suppressHydrationWarning
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1 text-right">{errors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="contact-phone" className="block text-sm font-medium text-gray-700 text-right mb-2">
              <Phone className="h-4 w-4 inline ml-2" />
              מספר טלפון *
            </label>
            <Input
              id="contact-phone"
              type="tel"
              placeholder="הכנס/י מספר טלפון"
              value={formData.phone}
              onChange={(e) => handleFormChange('phone', e.target.value)}
              className={`border-2 text-right ${errors.phone ? 'border-red-300' : 'border-gray-200'} focus:border-primary focus:ring-2 focus:ring-primary/20`}
              suppressHydrationWarning
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1 text-right">{errors.phone}</p>
            )}
          </div>

          <div>
            <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700 text-right mb-2">
              <Mail className="h-4 w-4 inline ml-2" />
              אימייל
            </label>
            <Input
              id="contact-email"
              type="email"
              placeholder="הכנס/י את האימייל שלך"
              value={formData.email}
              onChange={(e) => handleFormChange('email', e.target.value)}
              className={`border-2 text-right ${errors.email ? 'border-red-300' : 'border-gray-200'} focus:border-primary focus:ring-2 focus:ring-primary/20`}
              suppressHydrationWarning
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1 text-right">{errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="contact-message" className="block text-sm font-medium text-gray-700 text-right mb-2">
              <MessageSquare className="h-4 w-4 inline ml-2" />
              הודעה
            </label>
            <Textarea
              id="contact-message"
              placeholder="ספר לי על המטרות שלך בכושר..."
              value={formData.message}
              onChange={(e) => handleFormChange('message', e.target.value)}
              rows={4}
              className={`border-2 text-right ${errors.message ? 'border-red-300' : 'border-gray-200'} focus:border-primary focus:ring-2 focus:ring-primary/20`}
              suppressHydrationWarning
            />
            {errors.message && (
              <p className="text-red-500 text-xs mt-1 text-right">{errors.message}</p>
            )}
          </div>

          <div className="flex items-start space-x-2 space-x-reverse">
            <Checkbox
              id="contact-consent"
              checked={formData.consent}
              onCheckedChange={(checked) => handleFormChange('consent', checked as boolean)}
              className="mt-1"
              suppressHydrationWarning
            />
            <label htmlFor="contact-consent" className="text-sm text-gray-700 text-right leading-relaxed">
              אני מאשר/ת יצירת קשר *
            </label>
          </div>
          {errors.consent && (
            <p className="text-red-500 text-xs text-right">{errors.consent}</p>
          )}

          {/* Submit Button */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white text-lg py-4 rounded-xl shadow-lg border-0 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              suppressHydrationWarning
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  שולח פרטים...
                </div>
              ) : (
                <>
                  <MessageSquare className="h-5 w-5 ml-2" />
                  שלח פרטים
                </>
              )}
            </Button>
          </motion.div>
        </form>
      </CardContent>
    </Card>
  );
}
