"use client";

import React from 'react';
import { User, Mail, Phone, MessageSquare } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface BookingFormData {
  name: string;
  email: string;
  phone: string;
  note: string;
}

interface BookingFormProps {
  formData: BookingFormData;
  onChange: (field: keyof BookingFormData, value: string) => void;
  errors: Partial<BookingFormData>;
}

export default function BookingForm({ formData, onChange, errors }: BookingFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="booking-name" className="block text-sm font-medium text-gray-700 text-right mb-2">
          <User className="h-4 w-4 inline ml-2" />
          שם מלא *
        </label>
        <Input
          id="booking-name"
          type="text"
          placeholder="הכנס/י את שמך המלא"
          value={formData.name}
          onChange={(e) => onChange('name', e.target.value)}
          className={`border-2 text-right ${errors.name ? 'border-red-300' : 'border-gray-200'} focus:border-primary focus:ring-2 focus:ring-primary/20`}
          suppressHydrationWarning
        />
        {errors.name && (
          <p className="text-red-500 text-xs mt-1 text-right">{errors.name}</p>
        )}
      </div>

      <div>
        <label htmlFor="booking-email" className="block text-sm font-medium text-gray-700 text-right mb-2">
          <Mail className="h-4 w-4 inline ml-2" />
          אימייל *
        </label>
        <Input
          id="booking-email"
          type="email"
          placeholder="הכנס/י את האימייל שלך"
          value={formData.email}
          onChange={(e) => onChange('email', e.target.value)}
          className={`border-2 text-right ${errors.email ? 'border-red-300' : 'border-gray-200'} focus:border-primary focus:ring-2 focus:ring-primary/20`}
          suppressHydrationWarning
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1 text-right">{errors.email}</p>
        )}
      </div>

      <div>
        <label htmlFor="booking-phone" className="block text-sm font-medium text-gray-700 text-right mb-2">
          <Phone className="h-4 w-4 inline ml-2" />
          מספר טלפון
        </label>
        <Input
          id="booking-phone"
          type="tel"
          placeholder="הכנס/י מספר טלפון"
          value={formData.phone}
          onChange={(e) => onChange('phone', e.target.value)}
          className={`border-2 text-right ${errors.phone ? 'border-red-300' : 'border-gray-200'} focus:border-primary focus:ring-2 focus:ring-primary/20`}
          suppressHydrationWarning
        />
        {errors.phone && (
          <p className="text-red-500 text-xs mt-1 text-right">{errors.phone}</p>
        )}
      </div>

      <div>
        <label htmlFor="booking-note" className="block text-sm font-medium text-gray-700 text-right mb-2">
          <MessageSquare className="h-4 w-4 inline ml-2" />
          הערות
        </label>
        <Textarea
          id="booking-note"
          placeholder="ספר לי על המטרות שלך בכושר..."
          value={formData.note}
          onChange={(e) => onChange('note', e.target.value)}
          rows={3}
          className={`border-2 text-right ${errors.note ? 'border-red-300' : 'border-gray-200'} focus:border-primary focus:ring-2 focus:ring-primary/20`}
          suppressHydrationWarning
        />
        {errors.note && (
          <p className="text-red-500 text-xs mt-1 text-right">{errors.note}</p>
        )}
      </div>
    </div>
  );
}
